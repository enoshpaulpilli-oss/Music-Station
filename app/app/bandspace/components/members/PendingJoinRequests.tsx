"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Button } from "../../../components/ui";
import { supabase } from "@/lib/supabase/client";

type PendingJoinRequest = {
  request_id: string;
  band_id: string;
  user_id: string;
  request_status: string;
  requested_at: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
};

type PendingJoinRequestsProps = {
  bandId: string;
  currentUserRole: string;
};

function getRequestName(
  request: PendingJoinRequest,
) {
  return (
    request.display_name ||
    request.username ||
    request.email?.split("@")[0] ||
    "Band member"
  );
}

function formatRequestedTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

export default function PendingJoinRequests({
  bandId,
  currentUserRole,
}: PendingJoinRequestsProps) {
  const canReview =
    currentUserRole === "owner" ||
    currentUserRole === "admin";

  const [requests, setRequests] =
    useState<PendingJoinRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const [reviewingRequest, setReviewingRequest] =
    useState<string | null>(null);

  const loadRequests = useCallback(
    async () => {
      if (!canReview) {
        setRequests([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: requestError } =
        await supabase.rpc(
          "list_pending_band_join_requests",
          {
            p_band_id: bandId,
          },
        );

      if (requestError) {
        setRequests([]);
        setError(requestError.message);
        setLoading(false);
        return;
      }

      setRequests(
        (data ?? []) as PendingJoinRequest[],
      );

      setLoading(false);
    },
    [bandId, canReview],
  );

  useEffect(() => {
    if (!canReview) {
      return;
    }

    void loadRequests();

    const channel = supabase
      .channel(
        `band-join-requests-${bandId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "band_join_requests",
          filter: `band_id=eq.${bandId}`,
        },
        () => {
          void loadRequests();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    bandId,
    canReview,
    loadRequests,
  ]);

  const reviewRequest = async (
    requestId: string,
    approve: boolean,
  ) => {
    if (reviewingRequest) {
      return;
    }

    setReviewingRequest(requestId);
    setError(null);

    const { error: reviewError } =
      await supabase.rpc(
        "review_band_join_request",
        {
          p_request_id: requestId,
          p_approve: approve,
        },
      );

    if (reviewError) {
      setError(reviewError.message);
      setReviewingRequest(null);
      return;
    }

    setRequests((currentRequests) =>
      currentRequests.filter(
        (request) =>
          request.request_id !==
          requestId,
      ),
    );

    setReviewingRequest(null);
  };

  if (!canReview) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-3xl sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-default)]">
              Join requests
            </h2>

            <span className="flex min-h-7 min-w-7 items-center justify-center rounded-full border border-[var(--accent-ring)] bg-[var(--accent-soft)] px-2 text-xs font-semibold text-[var(--accent)]">
              {requests.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Review people requesting access
            to this BandSpace.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            void loadRequests()
          }
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-6 text-center text-sm text-[var(--text-muted)]">
          Loading join requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-4 py-6 text-center">
          <p className="text-sm font-medium text-[var(--text-default)]">
            No pending requests
          </p>

          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            New join-code requests will
            appear here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {requests.map((request) => {
            const isReviewing =
              reviewingRequest ===
              request.request_id;

            return (
              <article
                key={request.request_id}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                    {request.avatar_url ? (
                      <img
                        src={
                          request.avatar_url
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getRequestName(
                        request,
                      )
                        .slice(0, 1)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text-default)]">
                      {getRequestName(
                        request,
                      )}
                    </p>

                    {request.email && (
                      <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                        {request.email}
                      </p>
                    )}

                    <p className="mt-1 text-[11px] text-[var(--text-subtle)]">
                      Requested{" "}
                      {formatRequestedTime(
                        request.requested_at,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={Boolean(
                      reviewingRequest,
                    )}
                    onClick={() =>
                      void reviewRequest(
                        request.request_id,
                        false,
                      )
                    }
                  >
                    {isReviewing
                      ? "Reviewing..."
                      : "Reject"}
                  </Button>

                  <Button
                    type="button"
                    disabled={Boolean(
                      reviewingRequest,
                    )}
                    loading={isReviewing}
                    onClick={() =>
                      void reviewRequest(
                        request.request_id,
                        true,
                      )
                    }
                  >
                    Approve
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export type {
  PendingJoinRequest,
  PendingJoinRequestsProps,
};
