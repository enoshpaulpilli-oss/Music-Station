"use client";

import {
  forwardRef,
  type ReactNode,
} from "react";
import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_16px_50px_var(--accent-soft)] hover:bg-[var(--accent-hover)]",

  secondary:
    "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-default)] hover:bg-[var(--surface-hover)]",

  ghost:
    "border border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-default)]",

  outline:
    "border border-[var(--accent)] bg-transparent text-[var(--accent)] hover:bg-[var(--accent-soft)]",

  destructive:
    "border border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/25",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-xl px-3 text-xs",
  md: "h-11 rounded-2xl px-5 text-sm",
  lg: "h-13 rounded-2xl px-6 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={isDisabled ? undefined : { y: -1 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          "inline-flex items-center justify-center gap-2 font-semibold outline-none",
          "transition-[background-color,border-color,color,box-shadow,opacity,transform]",
          "focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
        ) : (
          leftIcon
        )}

        <span>{loading ? "Loading..." : children}</span>

        {!loading && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;
export type { ButtonProps, ButtonSize, ButtonVariant };