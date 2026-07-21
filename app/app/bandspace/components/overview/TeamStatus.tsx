"use client";

type TeamMemberStatus = {
  id: string;
  name: string;
  role?: string | null;
  avatarUrl?: string | null;
  status:
    | "confirmed"
    | "pending"
    | "unavailable";
};

type TeamStatusProps = {
  members?: TeamMemberStatus[];
  onViewMembers?: () => void;
};

const statusLabels = {
  confirmed: "Confirmed",
  pending: "Pending",
  unavailable: "Unavailable",
} as const;

function getInitial(name: string) {
  const initial = name.trim().charAt(0);

  return initial ? initial.toUpperCase() : "M";
}

function getStatusClasses(
  status: TeamMemberStatus["status"],
) {
  switch (status) {
    case "confirmed":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";

    case "unavailable":
      return "border-red-500/25 bg-red-500/10 text-red-300";

    default:
      return "border-amber-500/25 bg-amber-500/10 text-amber-300";
  }
}

export default function TeamStatus({
  members = [],
  onViewMembers,
}: TeamStatusProps) {
  const confirmed = members.filter(
    (member) =>
      member.status === "confirmed",
  ).length;

  const pending = members.filter(
    (member) => member.status === "pending",
  ).length;

  const unavailable = members.filter(
    (member) =>
      member.status === "unavailable",
  ).length;

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur-3xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Availability
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-default)]">
            Team status
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            See who is ready for the next
            service or rehearsal.
          </p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
          ◎
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatusStat
          label="Confirmed"
          value={confirmed}
          className="border-emerald-500/20 bg-emerald-500/5"
        />

        <StatusStat
          label="Pending"
          value={pending}
          className="border-amber-500/20 bg-amber-500/5"
        />

        <StatusStat
          label="Unavailable"
          value={unavailable}
          className="border-red-500/20 bg-red-500/5"
        />
      </div>

      <div className="mt-5 space-y-3">
        {members.length > 0 ? (
          members.slice(0, 5).map((member) => (
            <article
              key={member.id}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3"
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-xl border border-[var(--border)] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">
                  {getInitial(member.name)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--text-default)]">
                  {member.name}
                </p>

                <p className="mt-0.5 truncate text-xs text-[var(--text-subtle)]">
                  {member.role ||
                    "Band member"}
                </p>
              </div>

              <span
                className={[
                  "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                  getStatusClasses(
                    member.status,
                  ),
                ].join(" ")}
              >
                {
                  statusLabels[
                    member.status
                  ]
                }
              </span>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-5 py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
              ◎
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[var(--text-default)]">
              No availability yet
            </h3>

            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
              Member responses will appear
              here once a rehearsal or
              service is scheduled.
            </p>
          </div>
        )}
      </div>

      {onViewMembers && (
        <button
          type="button"
          onClick={onViewMembers}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--text-default)] transition hover:border-[var(--accent-ring)] hover:bg-[var(--accent-soft)]"
        >
          View all members
        </button>
      )}
    </section>
  );
}

function StatusStat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-3 text-center",
        className,
      ].join(" ")}
    >
      <p className="text-xl font-semibold text-[var(--text-default)]">
        {value}
      </p>

      <p className="mt-1 truncate text-[10px] text-[var(--text-subtle)]">
        {label}
      </p>
    </div>
  );
}