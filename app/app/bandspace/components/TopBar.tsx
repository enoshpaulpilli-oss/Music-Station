"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationsDropdown from "../../components/NotificationsDropdown";

export default function TopBar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/55 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Link
            href="/app"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-blue-500/10 to-transparent opacity-80" />

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="relative h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              >
                <path
                  d="M9 18V5l10-2v13"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="6"
                  cy="18"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                BandSpace
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
                Music Space
              </p>
            </div>
          </Link>

          <div className="hidden h-7 w-px bg-white/[0.08] sm:block" />

          <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />

            <span className="text-[11px] font-medium text-white/50">
              Personal workspace
            </span>
          </div>
        </div>

        {/* Centre navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.035] p-1 md:flex">
          <Link
            href="/app/bandspace"
            className="rounded-full bg-white/[0.09] px-5 py-2 text-xs font-medium text-white"
          >
            Overview
          </Link>

          <button
            type="button"
            className="rounded-full px-5 py-2 text-xs font-medium text-white/45 transition hover:bg-white/[0.055] hover:text-white"
          >
            Songs
          </button>

          <button
            type="button"
            className="rounded-full px-5 py-2 text-xs font-medium text-white/45 transition hover:bg-white/[0.055] hover:text-white"
          >
            Setlists
          </button>

          <button
            type="button"
            className="rounded-full px-5 py-2 text-xs font-medium text-white/45 transition hover:bg-white/[0.055] hover:text-white"
          >
            Rehearsals
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/45 transition hover:border-white/[0.12] hover:bg-white/[0.07] hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="m20 20-3.7-3.7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((current) => !current)}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/45 transition hover:border-white/[0.12] hover:bg-white/[0.07] hover:text-white"
            >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 21h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
          </button>

          <NotificationsDropdown
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
              className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] p-1.5 pr-3 transition hover:border-white/[0.12] hover:bg-white/[0.07]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)]">
                EP
              </div>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                <path
                  d="m8 10 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[calc(100%+12px)] w-56 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0b0f]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl"
                >
                  <div className="border-b border-white/[0.07] px-3 py-3">
                    <p className="text-sm font-medium text-white">
                      Enosh Paul
                    </p>

                    <p className="mt-0.5 text-xs text-white/35">
                      Personal Studio
                    </p>
                  </div>

                  <Link
                    href="/app"
                    className="mt-2 block rounded-xl px-3 py-2.5 text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Back to Personal Studio
                  </Link>

                  <Link
                    href="/app/settings"
                    className="mt-2 block rounded-xl px-3 py-2.5 text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Settings
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}