"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { supabase } from "@/lib/supabase/client";

type NotificationItem = {
  id: string;
  user_id: string;
  band_id: string | null;
  join_request_id: string | null;
  type: string;
  title: string;
  message: string;
  payload: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};

type NotificationDropdownProps = {
  open: boolean;
  onClose: () => void;
  onUnreadCountChange?: (
    count: number,
  ) => void;
};

function formatTimestamp(timestamp: string) {
  try {
    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: "numeric",
        minute: "numeric",
        month: "short",
        day: "numeric",
      },
    ).format(new Date(timestamp));
  } catch {
    return timestamp;
  }
}

function getActionLabel(
  notification: NotificationItem,
) {
  if (
    notification.type ===
    "band_join_request"
  ) {
    return "Review request";
  }

  if (
    notification.type ===
    "band_join_approved"
  ) {
    return "Open BandSpace";
  }

  return notification.read_at
    ? null
    : "Mark as read";
}

export default function NotificationsDropdown({
  open,
  onClose,
  onUnreadCountChange,
}: NotificationDropdownProps) {
  const [
    notifications,
    setNotifications,
  ] = useState<NotificationItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const [
    processingId,
    setProcessingId,
  ] = useState<string | null>(null);

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          !notification.read_at,
      ).length,
    [notifications],
  );

  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [
    onUnreadCountChange,
    unreadCount,
  ]);

  useEffect(() => {
    let active = true;

    let channel:
      | ReturnType<
          typeof supabase.channel
        >
      | null = null;

    const setupNotifications =
      async () => {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!active) {
          return;
        }

        if (userError || !user) {
          setNotifications([]);
          setError(
            userError?.message ||
              "You must be signed in to view notifications.",
          );
          setLoading(false);
          return;
        }

        const {
          data,
          error: notificationError,
        } = await supabase
          .from("notifications")
          .select(
            [
              "id",
              "user_id",
              "band_id",
              "join_request_id",
              "type",
              "title",
              "message",
              "payload",
              "read_at",
              "created_at",
            ].join(","),
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(10);

        if (!active) {
          return;
        }

        if (notificationError) {
          setNotifications([]);
          setError(
            notificationError.message,
          );
        } else {
          setNotifications(
            (data ?? []) as unknown as NotificationItem[],
          );
          setError(null);
        }

        setLoading(false);

        channel = supabase
          .channel(
            `notifications-${user.id}`,
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            (change) => {
              if (!active) {
                return;
              }

              if (
                change.eventType ===
                "DELETE"
              ) {
                const removed =
                  change.old as {
                    id?: string;
                  };

                if (!removed.id) {
                  return;
                }

                setNotifications(
                  (current) =>
                    current.filter(
                      (item) =>
                        item.id !==
                        removed.id,
                    ),
                );

                return;
              }

              const updated =
                change.new as NotificationItem;

              if (!updated.id) {
                return;
              }

              setNotifications(
                (current) => {
                  const exists =
                    current.some(
                      (item) =>
                        item.id ===
                        updated.id,
                    );

                  if (
                    change.eventType ===
                      "INSERT" &&
                    !exists
                  ) {
                    return [
                      updated,
                      ...current,
                    ].slice(0, 10);
                  }

                  if (exists) {
                    return current.map(
                      (item) =>
                        item.id ===
                        updated.id
                          ? updated
                          : item,
                    );
                  }

                  return current;
                },
              );
            },
          )
          .subscribe();
      };

    void setupNotifications();

    return () => {
      active = false;

      if (channel) {
        void supabase.removeChannel(
          channel,
        );
      }
    };
  }, []);

  const markAsRead = async (
    notificationId: string,
  ) => {
    setProcessingId(notificationId);
    setError(null);

    const { error: readError } =
      await supabase.rpc(
        "mark_notification_read",
        {
          p_notification_id:
            notificationId,
        },
      );

    if (readError) {
      setError(readError.message);
      setProcessingId(null);
      return false;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id ===
        notificationId
          ? {
              ...notification,
              read_at:
                notification.read_at ||
                new Date().toISOString(),
            }
          : notification,
      ),
    );

    setProcessingId(null);
    return true;
  };

  const handleNotificationAction =
    async (
      notification: NotificationItem,
    ) => {
      if (processingId) {
        return;
      }

      if (!notification.read_at) {
        const marked = await markAsRead(
          notification.id,
        );

        if (!marked) {
          return;
        }
      }

      if (
        notification.band_id &&
        (notification.type ===
          "band_join_request" ||
          notification.type ===
            "band_join_approved")
      ) {
        window.location.assign(
          `/app/bandspace?band=${encodeURIComponent(
            notification.band_id,
          )}&section=members`,
        );
      }
    };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.98,
          }}
          transition={{
            duration: 0.18,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/95 shadow-[0_30px_100px_rgba(0,0,0,0.75)] backdrop-blur-3xl"
        >
          <div className="border-b border-white/[0.07] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">
                    Notifications
                  </p>

                  {unreadCount > 0 && (
                    <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-neutral-500">
                  Latest updates from
                  your workspace
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-white/60 transition hover:border-white/[0.12] hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          <div
            className="max-h-80 overflow-y-auto px-4 py-3"
            aria-live="polite"
          >
            {loading ? (
              <div className="space-y-3">
                {Array.from({
                  length: 3,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-3xl bg-white/5"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </div>
            ) : notifications.length ===
              0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-sm font-medium text-white">
                  Nothing to display
                  here
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  New BandSpace
                  updates will appear
                  automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(
                  (notification) => {
                    const actionLabel =
                      getActionLabel(
                        notification,
                      );

                    return (
                      <article
                        key={
                          notification.id
                        }
                        className={[
                          "rounded-3xl border p-4 transition",
                          notification.read_at
                            ? "border-white/10 bg-white/[0.035]"
                            : "border-orange-400/25 bg-orange-500/[0.08]",
                        ].join(" ")}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={[
                              "mt-1 h-2 w-2 shrink-0 rounded-full",
                              notification.read_at
                                ? "bg-white/20"
                                : "bg-orange-400",
                            ].join(" ")}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white">
                              {
                                notification.title
                              }
                            </p>

                            <p className="mt-1 text-sm leading-6 text-neutral-400">
                              {
                                notification.message
                              }
                            </p>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <p className="text-[11px] text-white/30">
                                {formatTimestamp(
                                  notification.created_at,
                                )}
                              </p>

                              {actionLabel && (
                                <button
                                  type="button"
                                  disabled={
                                    processingId ===
                                    notification.id
                                  }
                                  onClick={() =>
                                    void handleNotificationAction(
                                      notification,
                                    )
                                  }
                                  className="rounded-xl border border-orange-400/20 bg-orange-500/10 px-3 py-1.5 text-[11px] font-semibold text-orange-300 transition hover:bg-orange-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {processingId ===
                                  notification.id
                                    ? "Loading..."
                                    : actionLabel}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type {
  NotificationDropdownProps,
  NotificationItem,
};
