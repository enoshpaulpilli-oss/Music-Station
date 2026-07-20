"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const COMMANDS = [
  {
    title: "Home",
    description: "Return to your personal studio.",
    href: "/app",
  },
  {
    title: "BandSpace",
    description: "Open your band workspace.",
    href: "/app/bandspace",
  },
  {
    title: "Settings",
    description: "Open your personal studio settings.",
    href: "/app/settings",
  },
  {
    title: "Songs",
    description: "Jump to your songs section in BandSpace.",
    href: "/app/bandspace#songs",
  },
  {
    title: "Tasks",
    description: "Open rehearsal task management.",
    href: "/app/bandspace#tasks",
  },
  {
    title: "Rehearsals",
    description: "View upcoming rehearsals.",
    href: "/app/bandspace#rehearsals",
  },
  {
    title: "Files",
    description: "Browse the shared file library.",
    href: "/app/bandspace#files",
  },
  {
    title: "Search",
    description: "Search across your band workspace.",
    href: "/app/bandspace#search",
  },
  {
    title: "Create Song",
    description: "Start a new song entry.",
    href: "/app/bandspace#create-song",
  },
  {
    title: "Create Task",
    description: "Add a new rehearsal task.",
    href: "/app/bandspace#create-task",
  },
  {
    title: "Invite Member",
    description: "Invite a team member to your band.",
    href: "/app/bandspace#invite-member",
  },
  {
    title: "Schedule Rehearsal",
    description: "Plan your next rehearsal.",
    href: "/app/bandspace#schedule-rehearsal",
  },
];

export default function CommandPalette() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return COMMANDS;

    return COMMANDS.filter((command) => {
      const label = `${command.title} ${command.description}`.toLowerCase();
      return label.includes(query.trim().toLowerCase());
    });
  }, [query]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-5 backdrop-blur-sm sm:p-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#05060c]/95 shadow-[0_35px_80px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
        <div className="border-b border-white/10 p-4 sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.32em] text-purple-300/70">
            Command palette
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            Quick navigation
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Open routes and settings with Cmd+K or Ctrl+K.
          </p>

          <div className="mt-5 rounded-3xl border border-white/10 bg-black/60 p-3 shadow-[inset_0_0_0_rgba(255,255,255,0.03)] sm:p-4">
            <label className="sr-only" htmlFor="command-search">
              Search commands
            </label>
            <input
              id="command-search"
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search commands..."
              className="w-full rounded-3xl border border-white/10 bg-black/80 px-4 py-3 text-white outline-none transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="max-h-[58vh] overflow-y-auto p-4 sm:p-6">
          {filteredCommands.length === 0 ? (
            <p className="text-sm text-neutral-500">No matching commands found.</p>
          ) : (
            <div className="grid gap-3">
              {filteredCommands.map((command) => (
                <button
                  key={command.title}
                  type="button"
                  onClick={() => handleSelect(command.href)}
                  className="group flex w-full flex-col items-start gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-purple-400/25 hover:bg-white/[0.06]"
                >
                  <span className="text-sm font-semibold text-white">
                    {command.title}
                  </span>
                  <span className="text-sm leading-6 text-neutral-400">
                    {command.description}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
