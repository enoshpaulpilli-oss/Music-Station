"use client";

import type { BandSection } from "./BandSidebar";

type BandOption = {
  id: string;
  name: string;
};

type BandTopBarProps = {
  bandName: string;
  activeBandId: string;
  bands: BandOption[];
  activeSection: BandSection;
  canInviteMembers: boolean;
  onBandChange: (bandId: string) => void;
  onInviteMember: () => void;
  onOpenMenu: () => void;
};

const sectionTitles: Record<
  BandSection,
  {
    title: string;
    description: string;
  }
> = {
  overview: {
    title: "Band Home",
    description:
      "Your band’s latest activity, schedule and team status.",
  },
  songs: {
    title: "Songs",
    description:
      "Manage your shared song library and arrangements.",
  },
  setlists: {
    title: "Setlists",
    description:
      "Build and organise setlists for upcoming services.",
  },
  rehearsals: {
    title: "Rehearsals",
    description:
      "Schedule rehearsals and track team preparation.",
  },
  tasks: {
    title: "Tasks",
    description:
      "Assign responsibilities and keep everyone organised.",
  },
  files: {
    title: "Files",
    description:
      "Store charts, recordings, documents and resources.",
  },
  members: {
    title: "Members",
    description:
      "Invite members and manage roles and permissions.",
  },
  chat: {
    title: "Band Chat",
    description:
      "Keep your band communication in one shared place.",
  },
  settings: {
    title: "Band Settings",
    description:
      "Manage your BandSpace details and preferences.",
  },
};

function getBandInitial(bandName: string) {
  const initial = bandName.trim().charAt(0);

  return initial ? initial.toUpperCase() : "B";
}

export default function BandTopBar({
  bandName,
  activeBandId,
  bands,
  activeSection,
  canInviteMembers,
  onBandChange,
  onInviteMember,
  onOpenMenu,
}: BandTopBarProps) {
  const section = sectionTitles[activeSection];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open BandSpace menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-lg text-[var(--text-muted)] transition hover:border-[var(--accent-ring)] hover:text-[var(--text-default)] lg:hidden"
        >
          ☰
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
              {getBandInitial(bandName)}
            </span>

            <span className="truncate text-xs font-medium text-[var(--text-subtle)]">
              {bandName}
            </span>
          </div>

          <h1 className="truncate text-lg font-semibold tracking-[-0.025em] text-[var(--text-default)] sm:text-xl">
            {section.title}
          </h1>

          <p className="mt-0.5 hidden truncate text-xs text-[var(--text-subtle)] sm:block">
            {section.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {bands.length > 1 && (
            <div className="hidden md:block">
              <label
                htmlFor="bandspace-active-band"
                className="sr-only"
              >
                Active BandSpace
              </label>

              <select
                id="bandspace-active-band"
                value={activeBandId}
                onChange={(event) =>
                  onBandChange(event.target.value)
                }
                className="h-10 max-w-52 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-default)] outline-none transition hover:border-[var(--accent-ring)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
              >
                {bands.map((band) => (
                  <option
                    key={band.id}
                    value={band.id}
                  >
                    {band.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {canInviteMembers && (
            <button
              type="button"
              onClick={onInviteMember}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent)] px-3 text-sm font-semibold text-white shadow-[0_10px_30px_var(--accent-soft)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 sm:px-4"
            >
              <span className="text-lg leading-none">
                +
              </span>

              <span className="hidden sm:inline">
                Invite Member
              </span>

              <span className="sm:hidden">
                Invite
              </span>
            </button>
          )}

          <button
            type="button"
            aria-label="BandSpace notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-base text-[var(--text-muted)] transition hover:border-[var(--accent-ring)] hover:text-[var(--text-default)]"
          >
            ♢

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </button>
        </div>
      </div>
    </header>
  );
}