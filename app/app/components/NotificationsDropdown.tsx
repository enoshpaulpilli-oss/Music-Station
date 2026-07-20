"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  read: boolean;
};

type NotificationDropdownProps = {
  open: boolean;
  onClose: () => void;
};

function formatTimestamp(timestamp: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(timestamp));
  } catch {
    return timestamp;
  }
}

export default function NotificationsDropdown({ open, onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id,title,body,created_at,read")
          .order("created_at", { ascending: false })
          .limit(6);

        if (!mounted) return;

        if (error) {
          if (
            error.message.includes("does not exist") ||
            error.message.includes("relation \"notifications\" does not exist")
          ) {
            setNotifications([]);
            setError(null);
          } else {
            setError(error.message);
          }
        } else {
          setNotifications(data ?? []);
          setError(null);
        }
      } catch {
        setError("Unable to load notifications.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadNotifications();

    const channel = supabase
      .channel("notifications-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          if (!mounted) return;

          const newNotification = payload.new as NotificationItem;
          setNotifications((prev) => {
            if (!newNotification?.id) return prev;
            const existing = prev.find((item) => item.id === newNotification.id);
            if (payload.eventType === "INSERT" && !existing) {
              return [newNotification, ...prev].slice(0, 6);
            }
            if (payload.eventType === "UPDATE" && existing) {
              return prev.map((item) =>
                item.id === newNotification.id ? newNotification : item,
              );
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[320px] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/95 shadow-[0_30px_100px_rgba(0,0,0,0.75)] backdrop-blur-3xl"
        >
          <div className="border-b border-white/[0.07] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Notifications</p>
                <p className="text-xs text-neutral-500">Latest updates from your workspace</p>
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

          <div className="max-h-72 overflow-y-auto px-4 py-3">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 rounded-3xl bg-white/5 p-4 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-neutral-400">
                No notifications.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">
                      {notification.body}
                    </p>
                    <p className="mt-3 text-[11px] text-white/30">
                      {formatTimestamp(notification.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
