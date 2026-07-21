
"use client";

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

type SearchBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  loading?: boolean;
  shortcut?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
};

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      id,
      value,
      defaultValue,
      onChange,
      onValueChange,
      onClear,
      loading = false,
      shortcut,
      disabled,
      className = "",
      containerClassName = "",
      placeholder = "Search...",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(
      String(defaultValue ?? ""),
    );
    const currentValue = isControlled
      ? String(value ?? "")
      : internalValue;

    const handleChange = (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      onValueChange?.("");
      onClear?.();
    };

    return (
      <div
        className={[
          "relative flex h-11 items-center rounded-2xl",
          "border border-[var(--border)] bg-[var(--background-elevated)]",
          "transition-[border-color,box-shadow,background-color] duration-200",
          "focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-ring)]",
          disabled ? "opacity-55" : "",
          containerClassName,
        ].join(" ")}
      >
        <span className="pointer-events-none absolute left-4 text-[var(--text-subtle)]">
          {loading ? (
            <span
              aria-hidden="true"
              className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>

        <input
          {...props}
          ref={ref}
          id={inputId}
          type="search"
          disabled={disabled}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          className={[
            "h-full w-full bg-transparent pl-11 pr-20 text-sm outline-none",
            "text-[var(--text-default)] placeholder:text-[var(--text-subtle)]",
            "disabled:cursor-not-allowed",
            "[&::-webkit-search-cancel-button]:hidden",
            className,
          ].join(" ")}
        />

        <div className="absolute right-3 flex items-center gap-2">
          {currentValue && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-subtle)] transition hover:bg-[var(--surface)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5"
              >
                <path
                  d="m5 5 10 10M15 5 5 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : shortcut ? (
            <kbd className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[10px] font-medium text-[var(--text-subtle)]">
              {shortcut}
            </kbd>
          ) : null}
        </div>
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
export type { SearchBarProps };