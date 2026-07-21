
"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
type PopoverAlign = "left" | "center" | "right";
type PopoverSide = "top" | "bottom";
type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopoverAlign;
  side?: PopoverSide;
  closeOnOutsideClick?: boolean;
  ariaLabel?: string;
  className?: string;
  contentClassName?: string;
};
export default function Popover({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  align = "center",
  side = "bottom",
  closeOnOutsideClick = true,
  ariaLabel = "Open popover",
  className = "",
  contentClassName = "",
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        !rootRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnOutsideClick, isOpen, setOpen]);

  const alignmentClass =
    align === "left"
      ? "left-0"
      : align === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  const sideClass =
    side === "bottom"
      ? "top-[calc(100%+0.65rem)]"
      : "bottom-[calc(100%+0.65rem)]";
  const initialY = side === "bottom" ? -6 : 6;

  return (
    <div
      ref={rootRef}
      className={["relative inline-flex", className].join(" ")}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setOpen(!isOpen)}
        className="inline-flex outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label={ariaLabel}
            initial={{
              opacity: 0,
              y: initialY,
              scale: 0.97,
              filter: "blur(5px)",
            }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: initialY, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "absolute z-[110] min-w-64 rounded-2xl border border-[var(--border)]",
              "bg-[var(--background-elevated)] p-4 text-[var(--text-default)]",
              "shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-3xl",
              alignmentClass,
              sideClass,
              contentClassName,
            ].join(" ")}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { PopoverAlign, PopoverProps, PopoverSide };