
"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TooltipSide = "top" | "right" | "bottom" | "left";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  delay?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
};

const positionClasses: Record<TooltipSide, string> = {
  top: "bottom-[calc(100%+0.55rem)] left-1/2 -translate-x-1/2",
  right: "left-[calc(100%+0.55rem)] top-1/2 -translate-y-1/2",
  bottom: "left-1/2 top-[calc(100%+0.55rem)] -translate-x-1/2",
  left: "right-[calc(100%+0.55rem)] top-1/2 -translate-y-1/2",
};

const motionOffset: Record<TooltipSide, { x: number; y: number }> = {
  top: { x: 0, y: 4 },
  right: { x: -4, y: 0 },
  bottom: { x: 0, y: -4 },
  left: { x: 4, y: 0 },
};

export default function Tooltip({
  content,
  children,
  side = "top",
  delay = 250,
  disabled = false,
  className = "",
  contentClassName = "",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(() => {
    if (disabled) return;
    clearTimer();
    timerRef.current = setTimeout(() => setOpen(true), delay);
  }, [clearTimer, delay, disabled]);

  const close = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const offset = motionOffset[side];

  return (
    <span
      className={["relative inline-flex", className].join(" ")}
      aria-describedby={open ? tooltipId : undefined}
      onMouseEnter={scheduleOpen}
      onMouseLeave={close}
      onFocusCapture={scheduleOpen}
      onBlurCapture={close}
    >
      {children}

      <AnimatePresence>
        {open && !disabled && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className={[
              "pointer-events-none absolute z-[130] w-max max-w-64 rounded-xl",
              "border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2",
              "text-xs leading-5 text-[var(--text-default)] shadow-[0_14px_50px_rgba(0,0,0,0.5)]",
              positionClasses[side],
              contentClassName,
            ].join(" ")}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export type { TooltipProps, TooltipSide };