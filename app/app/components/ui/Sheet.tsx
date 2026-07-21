
"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type SheetSide = "left" | "right" | "bottom";
type SheetSize = "sm" | "md" | "lg";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  side?: SheetSide;
  size?: SheetSize;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
};

const horizontalSizeClasses: Record<SheetSize, string> = {
  sm: "w-full max-w-sm",
  md: "w-full max-w-md",
  lg: "w-full max-w-xl",
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getMotion(side: SheetSide) {
  if (side === "left") {
    return { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } };
  }
  if (side === "bottom") {
    return { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };
  }
  return { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };
}

export default function Sheet({
  open,
  onClose,
  children,
  title,
  description,
  footer,
  side = "right",
  size = "md",
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
}: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const panelMotion = getMotion(side);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>(focusableSelector) ??
        panelRef.current;
      target?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [closeOnEscape, onClose, open]);

  if (!mounted) return null;

  const placementClasses =
    side === "left"
      ? "left-0 top-0 h-full"
      : side === "right"
        ? "right-0 top-0 h-full"
        : "bottom-0 left-0 max-h-[90vh] w-full rounded-t-[2rem]";

  const sizeClasses = side === "bottom" ? "" : horizontalSizeClasses[size];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (closeOnOverlay && event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            initial={panelMotion.initial}
            animate={panelMotion.animate}
            exit={panelMotion.exit}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "absolute z-10 flex flex-col overflow-hidden border-[var(--border)]",
              "bg-[var(--background-elevated)] text-[var(--text-default)] shadow-[0_25px_120px_rgba(0,0,0,0.7)] outline-none backdrop-blur-3xl",
              side === "left"
                ? "border-r"
                : side === "right"
                  ? "border-l"
                  : "border-t",
              placementClasses,
              sizeClasses,
              className,
            ].join(" ")}
          >
            {(title || description || showCloseButton) && (
              <header className="flex items-start gap-4 border-b border-[var(--border)] px-6 py-5">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h2
                      id={titleId}
                      className="text-lg font-semibold tracking-[-0.02em]"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id={descriptionId}
                      className="mt-1 text-sm leading-6 text-[var(--text-muted)]"
                    >
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close panel"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        d="m7 7 10 10M17 7 7 17"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </header>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {children}
            </div>

            {footer && (
              <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4">
                {footer}
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export type { SheetProps, SheetSide, SheetSize };