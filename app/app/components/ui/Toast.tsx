"use client";
 
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
 
type ToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "accent";
 
type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
 
type ToastAction = {
  label: string;
  onClick: () => void;
};
 
type ToastOptions = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
};
 
type ToastItem = ToastOptions & {
  id: string;
  variant: ToastVariant;
  duration: number;
};
 
type ToastContextValue = {
  toast: (options: ToastOptions | string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};
 
interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  limit?: number;
}
 
const ToastContext = createContext<ToastContextValue | null>(null);
 
const positionClasses: Record<ToastPosition, string> = {
  "top-left": "left-4 top-4 items-start sm:left-6 sm:top-6",
  "top-center": "left-1/2 top-4 -translate-x-1/2 items-center sm:top-6",
  "top-right": "right-4 top-4 items-end sm:right-6 sm:top-6",
  "bottom-left": "bottom-4 left-4 items-start sm:bottom-6 sm:left-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center sm:bottom-6",
  "bottom-right": "bottom-4 right-4 items-end sm:bottom-6 sm:right-6",
};
 
const variantClasses: Record<ToastVariant, string> = {
  success:
    "border-emerald-400/25 text-emerald-300",
  error:
    "border-red-400/25 text-red-300",
  warning:
    "border-amber-400/25 text-amber-300",
  info:
    "border-sky-400/25 text-sky-300",
  accent:
    "border-[var(--accent-ring)] text-[var(--accent)]",
};
 
function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") {
    return (
      <path
        d="m7.5 12.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
 
  if (variant === "error") {
    return (
      <>
        <path
          d="m8 8 8 8M16 8l-8 8"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </>
    );
  }
 
  if (variant === "warning") {
    return (
      <>
        <path
          d="M12 8v5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.3" r="1" fill="currentColor" />
      </>
    );
  }
 
  return (
    <>
      <path
        d="M12 11v5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7.7" r="1" fill="currentColor" />
    </>
  );
}
 
function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [paused, setPaused] = useState(false);
 
  useEffect(() => {
    if (item.duration <= 0 || paused) return;
 
    const timer = window.setTimeout(() => {
      onDismiss(item.id);
    }, item.duration);
 
    return () => window.clearTimeout(timer);
  }, [item.duration, item.id, onDismiss, paused]);
 
  const handleAction = () => {
    item.action?.onClick();
    onDismiss(item.id);
  };
 
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      role={item.variant === "error" ? "alert" : "status"}
      aria-live={item.variant === "error" ? "assertive" : "polite"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={[
        "pointer-events-auto relative flex w-[min(92vw,390px)] gap-3",
        "overflow-hidden rounded-2xl border p-4",
        "bg-[var(--background-elevated)]",
        "shadow-[0_22px_80px_rgba(0,0,0,0.38)]",
        "backdrop-blur-2xl",
        variantClasses[item.variant],
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center",
          "rounded-xl border border-current/20 bg-current/10",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <ToastIcon variant={item.variant} />
        </svg>
      </span>
 
      <div className="min-w-0 flex-1">
        {item.title && (
          <p className="text-sm font-semibold text-[var(--text-default)]">
            {item.title}
          </p>
        )}
 
        <p
          className={[
            "text-sm leading-6 text-[var(--text-muted)]",
            item.title ? "mt-0.5" : "",
          ].join(" ")}
        >
          {item.message}
        </p>
 
        {item.action && (
          <button
            type="button"
            onClick={handleAction}
            className={[
              "mt-2 text-xs font-semibold text-current",
              "underline decoration-current/40 underline-offset-4",
              "outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--accent-ring)]",
            ].join(" ")}
          >
            {item.action.label}
          </button>
        )}
      </div>
 
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          "text-[var(--text-subtle)] transition",
          "hover:bg-[var(--surface-hover)] hover:text-[var(--text-default)]",
          "outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="m6 6 8 8M14 6l-8 8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </motion.div>
  );
}
 
export default function ToastProvider({
  children,
  position = "bottom-right",
  limit = 4,
}: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);
 
  const dismiss = useCallback((id: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== id),
    );
  }, []);
 
  const dismissAll = useCallback(() => {
    setItems([]);
  }, []);
 
  const toast = useCallback(
    (input: ToastOptions | string) => {
      const options: ToastOptions =
        typeof input === "string"
          ? { message: input }
          : input;
 
      const id = `${Date.now()}-${idCounter.current++}`;
 
      const nextItem: ToastItem = {
        id,
        title: options.title,
        message: options.message,
        variant: options.variant ?? "accent",
        duration: options.duration ?? 4500,
        action: options.action,
      };
 
      setItems((current) =>
        [...current, nextItem].slice(-Math.max(1, limit)),
      );
 
      return id;
    },
    [limit],
  );
 
  const value = useMemo<ToastContextValue>(
    () => ({ toast, dismiss, dismissAll }),
    [dismiss, dismissAll, toast],
  );
 
  return (
    <ToastContext.Provider value={value}>
      {children}
 
      <div
        className={[
          "pointer-events-none fixed z-[200] flex max-w-full flex-col gap-3",
          positionClasses[position],
        ].join(" ")}
        aria-label="Notifications"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <ToastCard
              key={item.id}
              item={item}
              onDismiss={dismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
 
export function useToast() {
  const context = useContext(ToastContext);
 
  if (!context) {
    throw new Error(
      "useToast must be used inside a ToastProvider.",
    );
  }
 
  return context;
}
 
export type {
  ToastAction,
  ToastOptions,
  ToastPosition,
  ToastProviderProps,
  ToastVariant,
};