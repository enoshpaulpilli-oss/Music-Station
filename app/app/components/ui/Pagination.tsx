"use client";

import type { ReactNode } from "react";

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  disabled?: boolean;
  className?: string;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  ariaLabel?: string;
};

type PageToken =
  | number
  | "ellipsis-left"
  | "ellipsis-right";

function range(start: number, end: number) {
  return Array.from(
    {
      length: Math.max(0, end - start + 1),
    },
    (_, index) => start + index,
  );
}

function getPageTokens(
  page: number,
  totalPages: number,
  siblingCount: number,
): PageToken[] {
  const totalNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(
    page - siblingCount,
    1,
  );

  const rightSibling = Math.min(
    page + siblingCount,
    totalPages,
  );

  const showLeftEllipsis = leftSibling > 2;

  const showRightEllipsis =
    rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(
      1,
      3 + siblingCount * 2,
    );

    return [
      ...leftRange,
      "ellipsis-right",
      totalPages,
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(
      totalPages - (2 + siblingCount * 2),
      totalPages,
    );

    return [
      1,
      "ellipsis-left",
      ...rightRange,
    ];
  }

  return [
    1,
    "ellipsis-left",
    ...range(leftSibling, rightSibling),
    "ellipsis-right",
    totalPages,
  ];
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = false,
  disabled = false,
  className = "",
  previousLabel = "Previous",
  nextLabel = "Next",
  ariaLabel = "Pagination",
}: PaginationProps) {
  const safeTotalPages = Math.max(
    1,
    Math.floor(totalPages),
  );

  const safePage = Math.min(
    Math.max(1, Math.floor(page)),
    safeTotalPages,
  );

  const tokens = getPageTokens(
    safePage,
    safeTotalPages,
    Math.max(0, siblingCount),
  );

  const goToPage = (nextPage: number) => {
    if (disabled) {
      return;
    }

    const clamped = Math.min(
      Math.max(1, nextPage),
      safeTotalPages,
    );

    if (clamped !== safePage) {
      onPageChange(clamped);
    }
  };

  const navigationButtonClasses = [
    "inline-flex h-10 items-center justify-center rounded-xl border px-3",
    "border-[var(--border)] bg-[var(--surface)]",
    "text-sm font-medium text-[var(--text-muted)]",
    "transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-default)]",
    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ].join(" ");

  return (
    <nav
      aria-label={ariaLabel}
      className={[
        "flex flex-wrap items-center justify-center gap-2",
        className,
      ].join(" ")}
    >
      {showFirstLast && (
        <button
          type="button"
          onClick={() => goToPage(1)}
          disabled={disabled || safePage === 1}
          className={navigationButtonClasses}
          aria-label="Go to first page"
        >
          First
        </button>
      )}

      <button
        type="button"
        onClick={() => goToPage(safePage - 1)}
        disabled={disabled || safePage === 1}
        className={navigationButtonClasses}
        aria-label="Go to previous page"
      >
        <span aria-hidden="true">←</span>

        <span className="ml-2 hidden sm:inline">
          {previousLabel}
        </span>
      </button>

      <div
        className="flex items-center gap-1"
        aria-label="Page numbers"
      >
        {tokens.map((token) => {
          if (typeof token !== "number") {
            return (
              <span
                key={token}
                className="flex h-10 min-w-8 items-center justify-center text-sm text-[var(--text-subtle)]"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isCurrent = token === safePage;

          return (
            <button
              key={token}
              type="button"
              onClick={() => goToPage(token)}
              disabled={disabled}
              aria-current={
                isCurrent ? "page" : undefined
              }
              aria-label={`Go to page ${token}`}
              className={[
                "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3",
                "text-sm font-semibold outline-none transition",
                "focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]",
                "disabled:cursor-not-allowed disabled:opacity-40",
                isCurrent
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_10px_30px_var(--accent-soft)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-default)]",
              ].join(" ")}
            >
              {token}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => goToPage(safePage + 1)}
        disabled={
          disabled ||
          safePage === safeTotalPages
        }
        className={navigationButtonClasses}
        aria-label="Go to next page"
      >
        <span className="mr-2 hidden sm:inline">
          {nextLabel}
        </span>

        <span aria-hidden="true">→</span>
      </button>

      {showFirstLast && (
        <button
          type="button"
          onClick={() =>
            goToPage(safeTotalPages)
          }
          disabled={
            disabled ||
            safePage === safeTotalPages
          }
          className={navigationButtonClasses}
          aria-label="Go to last page"
        >
          Last
        </button>
      )}
    </nav>
  );
}