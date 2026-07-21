"use client";

type UpcomingServiceProps = {
  title?: string;
  date?: string | null;
  time?: string | null;
  location?: string | null;
  setlistName?: string | null;
  rehearsalDate?: string | null;
  onOpenSetlist?: () => void;
  onOpenRehearsal?: () => void;
};

function formatDate(
  value: string | null | undefined,
) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function getDateParts(
  value: string | null | undefined,
) {
  if (!value) {
    return {
      day: "--",
      month: "---",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "---",
    };
  }

  return {
    day: new Intl.DateTimeFormat("en-AU", {
      day: "2-digit",
    }).format(date),
    month: new Intl.DateTimeFormat("en-AU", {
      month: "short",
    })
      .format(date)
      .toUpperCase(),
  };
}

export default function UpcomingService({
  title = "Sunday Service",
  date = null,
  time = null,
  location = null,
  setlistName = null,
  rehearsalDate = null,
  onOpenSetlist,
  onOpenRehearsal,
}: UpcomingServiceProps) {
  const dateParts = getDateParts(date);
  const formattedDate = formatDate(date);
  const formattedRehearsal =
    formatDate(rehearsalDate);

  const hasService =
    Boolean(date) ||
    Boolean(time) ||
    Boolean(location) ||
    Boolean(setlistName);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--accent-ring)] bg-[var(--surface)] p-5 backdrop-blur-3xl sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-[75px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Coming up
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-default)]">
              Upcoming service
            </h2>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
            ◷
          </span>
        </div>

        {hasService ? (
          <>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-3xl border border-[var(--accent-ring)] bg-[var(--accent-soft)]">
                <span className="text-2xl font-bold tracking-[-0.04em] text-[var(--text-default)]">
                  {dateParts.day}
                </span>

                <span className="mt-0.5 text-[10px] font-semibold tracking-[0.18em] text-[var(--accent)]">
                  {dateParts.month}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-[var(--text-default)]">
                  {title}
                </h3>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {formattedDate ||
                    "Date not selected"}
                  {time ? ` · ${time}` : ""}
                </p>

                <p className="mt-1 truncate text-xs text-[var(--text-subtle)]">
                  {location ||
                    "Location not added"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onOpenSetlist}
                disabled={!onOpenSetlist}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-left transition enabled:hover:border-[var(--accent-ring)] enabled:hover:bg-[var(--accent-soft)] disabled:cursor-default"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Setlist
                </span>

                <span className="mt-2 block truncate text-sm font-semibold text-[var(--text-default)]">
                  {setlistName ||
                    "No setlist attached"}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenRehearsal}
                disabled={!onOpenRehearsal}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-left transition enabled:hover:border-[var(--accent-ring)] enabled:hover:bg-[var(--accent-soft)] disabled:cursor-default"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Rehearsal
                </span>

                <span className="mt-2 block truncate text-sm font-semibold text-[var(--text-default)]">
                  {formattedRehearsal ||
                    "Not scheduled"}
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-5 py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
              +
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[var(--text-default)]">
              No upcoming service
            </h3>

            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
              Your band’s next service will
              appear here after it is
              scheduled.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}