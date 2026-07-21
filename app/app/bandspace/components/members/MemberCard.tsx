"use client";

type MemberRole =
  | "owner"
  | "admin"
  | "leader"
  | "member";

type MemberCardProps = {
  name: string;
  email?: string | null;
  role: MemberRole | string;
  avatarUrl?: string | null;
  isCurrentUser?: boolean;
  canManage?: boolean;
  updating?: boolean;
  onRoleChange?: (role: MemberRole) => void;
  onRemove?: () => void;
};

const editableRoles: Array<{
  value: MemberRole;
  label: string;
}> = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "leader",
    label: "Leader",
  },
  {
    value: "member",
    label: "Member",
  },
];

function formatRole(role: string) {
  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getInitial(name: string) {
  const initial = name.trim().charAt(0);

  return initial ? initial.toUpperCase() : "M";
}

function getRoleDescription(role: string) {
  switch (role) {
    case "owner":
      return "Full control of this BandSpace";

    case "admin":
      return "Can manage members and band content";

    case "leader":
      return "Can organise music and services";

    default:
      return "Can access and contribute to the band";
  }
}

export default function MemberCard({
  name,
  email,
  role,
  avatarUrl,
  isCurrentUser = false,
  canManage = false,
  updating = false,
  onRoleChange,
  onRemove,
}: MemberCardProps) {
  const isOwner = role === "owner";

  return (
    <article className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur-3xl transition hover:border-[var(--accent-ring)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-12 w-12 rounded-2xl border border-[var(--border)] object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-base font-bold text-[var(--accent)]">
                {getInitial(name)}
              </div>
            )}

            <span
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface)] bg-emerald-400"
              aria-label="Active member"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-[var(--text-default)]">
                {name}
              </h3>

              {isCurrentUser && (
                <span className="rounded-full border border-[var(--accent-ring)] bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                  You
                </span>
              )}

              {isOwner && (
                <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300">
                  Owner
                </span>
              )}
            </div>

            {email && (
              <p className="mt-1 truncate text-xs text-[var(--text-subtle)]">
                {email}
              </p>
            )}

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {getRoleDescription(role)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {canManage &&
          !isOwner &&
          !isCurrentUser &&
          onRoleChange ? (
            <label className="relative">
              <span className="sr-only">
                Change role for {name}
              </span>

              <select
                value={role}
                disabled={updating}
                onChange={(event) =>
                  onRoleChange(
                    event.target.value as MemberRole,
                  )
                }
                className="h-10 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 text-sm font-medium text-[var(--text-default)] outline-none transition hover:border-[var(--accent-ring)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editableRoles.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <span className="inline-flex h-10 items-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 text-xs font-semibold text-[var(--text-muted)]">
              {formatRole(role)}
            </span>
          )}

          {canManage &&
            !isOwner &&
            !isCurrentUser &&
            onRemove && (
              <button
                type="button"
                disabled={updating}
                onClick={onRemove}
                aria-label={`Remove ${name} from the band`}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 text-lg text-red-300 transition hover:border-red-500/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            )}
        </div>
      </div>
    </article>
  );
}