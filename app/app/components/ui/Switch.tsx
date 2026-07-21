
"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  containerClassName?: string;
};

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      label,
      description,
      error,
      disabled,
      className = "",
      containerClassName = "",
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description
      ? `${inputId}-description`
      : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [
      ariaDescribedBy,
      descriptionId,
      errorId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={containerClassName}>
        <label
          htmlFor={inputId}
          className={[
            "flex items-start justify-between gap-4",
            disabled
              ? "cursor-not-allowed opacity-55"
              : "cursor-pointer",
          ].join(" ")}
        >
          {(label || description) && (
            <span className="min-w-0 flex-1">
              {label && (
                <span className="block text-sm font-medium text-[var(--text-default)]">
                  {label}
                </span>
              )}

              {description && (
                <span
                  id={descriptionId}
                  className="mt-1 block text-xs leading-5 text-[var(--text-subtle)]"
                >
                  {description}
                </span>
              )}
            </span>
          )}

          <span className="relative mt-0.5 inline-flex shrink-0">
            <input
              {...props}
              ref={ref}
              id={inputId}
              type="checkbox"
              role="switch"
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
              className={[
                "peer sr-only",
                className,
              ].join(" ")}
            />

            <span
              aria-hidden="true"
              className={[
                "relative h-6 w-11 rounded-full",
                "border border-[var(--border)] bg-[var(--surface-strong)]",
                "transition-colors duration-200",
                "peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)]",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-ring)]",
                "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)]",
                "after:absolute after:left-0.5 after:top-0.5 after:h-4.5 after:w-4.5",
                "after:rounded-full after:bg-white after:shadow-md after:transition-transform after:duration-200",
                "peer-checked:after:translate-x-5",
                error ? "border-red-500/70" : "",
              ].join(" ")}
            />
          </span>
        </label>

        {error && (
          <p
            id={errorId}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
export type { SwitchProps };