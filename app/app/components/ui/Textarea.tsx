"use client";

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: ReactNode;
    helperText?: ReactNode;
    error?: string;
    showCount?: boolean;
    containerClassName?: string;
  };

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      id,
      label,
      helperText,
      error,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      disabled,
      className = "",
      containerClassName = "",
      rows = 5,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    const helperId = helperText
      ? `${textareaId}-helper`
      : undefined;

    const errorId = error
      ? `${textareaId}-error`
      : undefined;

    const countId = showCount
      ? `${textareaId}-count`
      : undefined;

    const describedBy =
      [
        ariaDescribedBy,
        helperId,
        errorId,
        countId,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const isControlled = value !== undefined;

    const initialValue = isControlled
      ? value
      : defaultValue;

    const [internalLength, setInternalLength] =
      useState(() =>
        String(initialValue ?? "").length,
      );

    const currentLength = isControlled
      ? String(value ?? "").length
      : internalLength;

    const handleChange = (
      event: ChangeEvent<HTMLTextAreaElement>,
    ) => {
      if (!isControlled) {
        setInternalLength(
          event.target.value.length,
        );
      }

      onChange?.(event);
    };

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-[var(--text-default)]"
          >
            {label}
          </label>
        )}

        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={handleChange}
          {...(isControlled
            ? {
                value: value ?? "",
              }
            : {
                defaultValue,
              })}
          className={[
            "min-h-28 w-full resize-y rounded-2xl px-4 py-3 text-sm outline-none",
            "border bg-[var(--background-elevated)] text-[var(--text-default)]",
            "placeholder:text-[var(--text-subtle)]",
            "transition-[border-color,box-shadow,background-color] duration-200",
            "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]",
            "disabled:cursor-not-allowed disabled:opacity-55",
            error
              ? "border-red-500/70"
              : "border-[var(--border)]",
            className,
          ].join(" ")}
        />

        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {error ? (
              <p
                id={errorId}
                className="text-xs text-red-400"
              >
                {error}
              </p>
            ) : helperText ? (
              <p
                id={helperId}
                className="text-xs leading-5 text-[var(--text-subtle)]"
              >
                {helperText}
              </p>
            ) : null}
          </div>

          {showCount && (
            <span
              id={countId}
              className="shrink-0 text-xs tabular-nums text-[var(--text-subtle)]"
            >
              {currentLength}

              {typeof maxLength === "number"
                ? ` / ${maxLength}`
                : ""}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
export type { TextareaProps };