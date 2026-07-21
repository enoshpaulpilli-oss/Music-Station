
"use client";

import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: string;
  options?: readonly SelectOption[];
  placeholder?: string;
  containerClassName?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      options,
      placeholder,
      children,
      disabled,
      className = "",
      containerClassName = "",
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helperId = helperText
      ? `${selectId}-helper`
      : undefined;
    const errorId = error ? `${selectId}-error` : undefined;
    const describedBy = [
      ariaDescribedBy,
      helperId,
      errorId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-sm font-medium text-[var(--text-default)]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            {...props}
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={[
              "h-11 w-full appearance-none rounded-2xl px-4 pr-11 text-sm outline-none",
              "border bg-[var(--background-elevated)] text-[var(--text-default)]",
              "transition-[border-color,box-shadow,background-color] duration-200",
              "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]",
              "disabled:cursor-not-allowed disabled:opacity-55",
              error
                ? "border-red-500/70"
                : "border-[var(--border)]",
              className,
            ].join(" ")}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options
              ? options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))
              : children}
          </select>

          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-subtle)]"
          >
            <path
              d="m6 8 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {error ? (
          <p
            id={errorId}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="mt-2 text-xs leading-5 text-[var(--text-subtle)]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
export type { SelectOption, SelectProps };

