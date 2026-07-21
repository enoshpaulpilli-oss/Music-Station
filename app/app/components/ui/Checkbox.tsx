"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  containerClassName?: string;
};

const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps
>(
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

    const errorId = error
      ? `${inputId}-error`
      : undefined;

    const describedBy =
      [
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
            "group inline-flex items-start gap-3",
            disabled
              ? "cursor-not-allowed opacity-55"
              : "cursor-pointer",
          ].join(" ")}
        >
          <span className="relative mt-0.5 inline-flex shrink-0">
            <input
              {...props}
              ref={ref}
              id={inputId}
              type="checkbox"
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
                "flex h-5 w-5 items-center justify-center rounded-md",
                "border border-[var(--border)] bg-[var(--background-elevated)]",
                "text-[var(--accent-text)] transition-all duration-200",
                "peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)]",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-ring)]",
                "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)]",
                "peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100",
                error
                  ? "border-red-500/70"
                  : "",
              ].join(" ")}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-3.5 w-3.5 scale-75 opacity-0 transition duration-150"
              >
                <path
                  d="m4.5 10 3.25 3.25L15.5 5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>

          {(label || description) && (
            <span className="min-w-0">
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
export type { CheckboxProps };