"use client";

export type BandSection =
  | "overview"
  | "songs"
  | "setlists"
  | "rehearsals"
  | "tasks"
  | "files"
  | "members"
  | "chat"
  | "settings";

type BandSidebarProps = {
  bandName: string;
  role: string;
  activeSection: BandSection;
  onSectionChange: (section: BandSection) => void;
  onAddBand: () => void;
  onClose?: () => void;
};

type NavigationItem = {
  id: BandSection;
  label: string;
  icon: string;
};

const mainNavigation: NavigationItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "⌂",
  },
  {
    id: "songs",
    label: "Songs",
    icon: "♫",
  },
  {
    id: "setlists",
    label: "Setlists",
    icon: "≡",
  },
  {
    id: "rehearsals",
    label: "Rehearsals",
    icon: "◷",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: "✓",
  },
  {
    id: "files",
    label: "Files",
    icon: "▱",
  },
  {
    id: "members",
    label: "Members",
    icon: "◎",
  },
  {
    id: "chat",
    label: "Chat",
    icon: "◌",
  },
];

function formatRole(role: string) {
  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getBandInitial(bandName: string) {
  const initial = bandName.trim().charAt(0);

  return initial ? initial.toUpperCase() : "B";
}

export default function BandSidebar({
  bandName,
  role,
  activeSection,
  onSectionChange,
  onAddBand,
  onClose,
}: BandSidebarProps) {
  const handleNavigation = (
    section: BandSection,
  ) => {
    onSectionChange(section);
    onClose?.();
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--border)] bg-[var(--surface)] backdrop-blur-3xl">
      <div className="flex min-h-20 items-center justify-between border-b border-[var(--border)] px-5">
        <button
          type="button"
          onClick={() =>
            handleNavigation("overview")
          }
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-base font-bold text-[var(--accent)]">
            {getBandInitial(bandName)}
          </span>

          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[var(--text-default)]">
              {bandName}
            </span>

            <span className="mt-0.5 block text-xs text-[var(--text-subtle)]">
              {formatRole(role)}
            </span>
          </span>
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close BandSpace menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--text-default)] lg:hidden"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
          BandSpace
        </p>

        <nav
          aria-label="BandSpace navigation"
          className="mt-3 space-y-1"
        >
          {mainNavigation.map((item) => {
            const isActive =
              activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-current={
                  isActive ? "page" : undefined
                }
                onClick={() =>
                  handleNavigation(item.id)
                }
                className={[
                  "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition",
                  isActive
                    ? "border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border border-transparent text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-default)]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-base transition",
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "bg-[var(--surface-strong)] text-[var(--text-subtle)] group-hover:text-[var(--text-default)]",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="my-5 border-t border-[var(--border)]" />

        <button
          type="button"
          onClick={() =>
            handleNavigation("settings")
          }
          className={[
            "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition",
            activeSection === "settings"
              ? "border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border border-transparent text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-default)]",
          ].join(" ")}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-base text-[var(--text-subtle)]">
            ⚙
          </span>

          <span>Band Settings</span>
        </button>
      </div>

      <div className="border-t border-[var(--border)] p-3">
        <button
          type="button"
          onClick={onAddBand}
          className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-3 text-left transition hover:border-[var(--accent-ring)] hover:bg-[var(--accent-soft)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
            +
          </span>

          <span>
            <span className="block text-sm font-medium text-[var(--text-default)]">
              Add or join a band
            </span>

            <span className="mt-0.5 block text-xs text-[var(--text-subtle)]">
              Switch your BandSpace
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
}