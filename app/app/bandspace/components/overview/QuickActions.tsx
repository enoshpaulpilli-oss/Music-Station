"use client";

import type { BandSection } from "../layout/BandSidebar";

type QuickActionsProps = {
  canInviteMembers: boolean;
  onSectionChange: (
    section: BandSection,
  ) => void;
  onInviteMember: () => void;
};

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: string;
  section?: BandSection;
  invite?: boolean;
};

const actions: QuickAction[] = [
  {
    id: "add-song",
    title: "Add a song",
    description:
      "Start building your shared song library.",
    icon: "♫",
    section: "songs",
  },
  {
    id: "create-setlist",
    title: "Create a setlist",
    description:
      "Prepare the order for an upcoming service.",
    icon: "≡",
    section: "setlists",
  },
  {
    id: "schedule-rehearsal",
    title: "Schedule rehearsal",
    description:
      "Choose a practice time for the band.",
    icon: "◷",
    section: "rehearsals",
  },
  {
    id: "invite-member",
    title: "Invite a member",
    description:
      "Share the private BandSpace join code.",
    icon: "+",
    invite: true,
  },
];

export default function QuickActions({
  canInviteMembers,
  onSectionChange,
  onInviteMember,
}: QuickActionsProps) {
  const visibleActions = actions.filter(
    (action) =>
      !action.invite || canInviteMembers,
  );

  const handleAction = (
    action: QuickAction,
  ) => {
    if (action.invite) {
      onInviteMember();
      return;
    }

    if (action.section) {
      onSectionChange(action.section);
    }
  };

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur-3xl sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Get started
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-default)]">
          Quick actions
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Jump directly into the most common
          BandSpace tools.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {visibleActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() =>
              handleAction(action)
            }
            className="group flex min-h-28 items-start gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--accent-ring)] hover:bg-[var(--accent-soft)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-xl font-semibold text-[var(--accent)] transition group-hover:scale-105">
              {action.icon}
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[var(--text-default)]">
                {action.title}
              </span>

              <span className="mt-1.5 block text-xs leading-5 text-[var(--text-muted)]">
                {action.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}