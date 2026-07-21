import {
  type HTMLAttributes,
  type ReactNode,
} from "react";

type BadgeVariant =
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "outline";

type BadgeSize = "sm" | "md";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  accent:
    "border-[var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent)]",
  success:
    "border-emerald-400/25 bg-emerald-500/12 text-emerald-300",
  warning:
    "border-amber-400/25 bg-amber-500/12 text-amber-300",
  error:
    "border-red-400/25 bg-red-500/12 text-red-300",
  neutral:
    "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]",
  outline:
    "border-[var(--border)] bg-transparent text-[var(--text-muted)]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "min-h-6 rounded-lg px-2 py-0.5 text-[10px]",
  md: "min-h-7 rounded-xl px-2.5 py-1 text-xs",
};

export default function Badge({
  variant = "neutral",
  size = "md",
  dot = false,
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex w-fit items-center justify-center gap-1.5 border font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      {icon}
      {children}
    </span>
  );
}

export type {
  BadgeProps,
  BadgeSize,
  BadgeVariant,
};