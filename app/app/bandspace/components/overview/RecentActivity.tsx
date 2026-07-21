"use client";

type ActivityType =
  | "song"
  | "setlist"
  | "rehearsal"
  | "member"
  | "file"
  | "task"
  | "general";

export type BandActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description?: string | null;
  actorName?: string | null;
  createdAt: string;
};

type RecentActivityProps = {
  activities?: BandActivityItem[];
  onViewAll?: () => void;
};

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "song":
      return "♫";

    case "setlist":
      return "≡";

    case "rehearsal":
      return "◷";

    case "member":
      return "◎";

    case "file":
      return "▱";

    case "task":
      return "✓";

    default:
      return "•";
  }
}

function formatActivityTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const difference =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    difference / 60_000,
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export default function RecentActivity({
  activities = [],
  onViewAll,
}: RecentActivityProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur-3xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Latest updates
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-default)]">
            Recent activity
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Keep track of changes made across
            this BandSpace.
          </p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
          ↻
        </span>
      </div>

      {activities.length > 0 ? (
        <div className="mt-5 space-y-3">
          {activities
            .slice(0, 6)
            .map((activity) => (
              <article
                key={activity.id}
                className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-base text-[var(--accent)]">
                  {getActivityIcon(
                    activity.type,
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold leading-5 text-[var(--text-default)]">
                      {activity.title}
                    </p>

                    <time
                      dateTime={
                        activity.createdAt
                      }
                      className="shrink-0 text-[10px] text-[var(--text-subtle)]"
                    >
                      {formatActivityTime(
                        activity.createdAt,
                      )}
                    </time>
                  </div>

                  {activity.description && (
                    <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                      {activity.description}
                    </p>
                  )}

                  {activity.actorName && (
                    <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                      By {activity.actorName}
                    </p>
                  )}
                </div>
              </article>
            ))}

          {activities.length > 6 && (
            <p className="text-center text-xs text-[var(--text-subtle)]">
              +{activities.length - 6} more
              updates
            </p>
          )}

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--text-default)] transition hover:border-[var(--accent-ring)] hover:bg-[var(--accent-soft)]"
            >
              View all activity
            </button>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-5 py-9 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
            ↻
          </div>

          <h3 className="mt-4 text-sm font-semibold text-[var(--text-default)]">
            No recent activity
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--text-muted)]">
            Updates will appear here when
            members add songs, setlists,
            rehearsals or files.
          </p>
        </div>
      )}
    </section>
  );
}