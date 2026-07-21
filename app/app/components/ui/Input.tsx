"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  allowPasswordToggle?: boolean;
  containerClassName?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      allowPasswordToggle = true,
      containerClassName = "",
      className = "",
      type = "text",
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && passwordVisible ? "text" : type;
    const descriptionId = `${inputId}-description`;

    return (
      <div className={["w-full", containerClassName].join(" ")}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-[var(--text-muted)]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--text-subtle)]">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={helperText || error ? descriptionId : undefined}
            className={[
              "h-12 w-full rounded-2xl border bg-[var(--background-elevated)]",
              "px-4 text-sm text-[var(--text-default)] outline-none",
              "placeholder:text-[var(--text-subtle)]",
              "transition-[border-color,box-shadow,background-color]",
              "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]",
              "disabled:cursor-not-allowed disabled:opacity-55",
              error ? "border-red-500/60" : "border-[var(--border)]",
              leftIcon ? "pl-11" : "",
              rightIcon || isPassword ? "pr-11" : "",
              className,
            ].join(" ")}
            {...props}
          />

          {isPassword && allowPasswordToggle ? (
            <button
              type="button"
              onClick={() => setPasswordVisible((current) => !current)}
              className="absolute inset-y-0 right-3 flex items-center rounded-lg px-2 text-xs font-medium text-[var(--text-muted)] outline-none hover:text-[var(--text-default)] focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              aria-pressed={passwordVisible}
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          ) : rightIcon ? (
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--text-subtle)]">
              {rightIcon}
            </span>
          ) : null}
        </div>

        {(error || helperText) && (
          <p
            id={descriptionId}
            className={`mt-2 text-xs ${
              error ? "text-red-300" : "text-[var(--text-subtle)]"
            }`}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
export type { InputProps };