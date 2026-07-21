"use client";

import {
  useEffect,
  useState,
} from "react";

type InviteMemberModalProps = {
  open: boolean;
  bandName: string;
  joinCode: string;
  onClose: () => void;
};

export default function InviteMemberModal({
  open,
  bandName,
  joinCode,
  onClose,
}: InviteMemberModalProps) {
  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const copyJoinCode = async () => {
    try {
      await navigator.clipboard.writeText(
        joinCode,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const copyInvitation = async () => {
    const message = [
      `Join ${bandName} on Music Station.`,
      `BandSpace join code: ${joinCode}`,
      "Open BandSpace, choose “Join a band”, and enter this code.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(
        message,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-member-title"
    >
      <button
        type="button"
        aria-label="Close invite member window"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <section className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--background-elevated)] shadow-[0_40px_140px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              BandSpace invitation
            </p>

            <h2
              id="invite-member-title"
              className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-default)]"
            >
              Invite a member
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Share the private join code for{" "}
              <span className="font-medium text-[var(--text-default)]">
                {bandName}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xl text-[var(--text-muted)] transition hover:border-[var(--accent-ring)] hover:text-[var(--text-default)]"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-3xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-subtle)]">
              Private join code
            </p>

            <div className="mt-3 flex items-center gap-3">
              <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-center text-xl font-bold tracking-[0.25em] text-[var(--accent)] sm:text-2xl">
                {joinCode}
              </code>

              <button
                type="button"
                onClick={() =>
                  void copyJoinCode()
                }
                className="h-12 shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text-default)] transition hover:border-[var(--accent-ring)] hover:bg-[var(--surface-strong)]"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-sm font-semibold text-[var(--text-default)]">
              How members join
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              They open BandSpace, select{" "}
              <span className="font-medium text-[var(--text-default)]">
                Join a band
              </span>
              , and enter this code. Do not post
              the code publicly.
            </p>
          </div>

          {copied && (
            <div
              role="status"
              className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            >
              Invitation copied to your
              clipboard.
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--text-default)] transition hover:bg-[var(--surface-strong)]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() =>
              void copyInvitation()
            }
            className="h-11 rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Copy invitation
          </button>
        </div>
      </section>
    </div>
  );
}