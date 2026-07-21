"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import Card from "./Card";
import Skeleton from "./Skeleton";

export type StatTrendDirection =
  | "up"
  | "down"
  | "neutral";

export type StatTrend = {
  value: string;
  direction?: StatTrendDirection;
  label?: string;
};

export type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  trend?: StatTrend;
  action?: ReactNode;
  loading?: boolean;
  accent?: boolean;
  hover?: boolean;
  className?: string;
};

const trendClasses: Record<
  StatTrendDirection,
  string
> = {
  up: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  down: "border-red-500/20 bg-red-500/10 text-red-500",
  neutral:
    "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-muted)]",
};

export default function StatCard({
  label,
  value,
  description,
  icon,
  trend,
  action,
  loading = false,
  accent = false,
  hover = true,
  className = "",
}: StatCardProps) {
  const trendDirection =
    trend?.direction ?? "neutral";

  return (
    <Card
      hover={hover}
      className={[
        "relative overflow-hidden p-5 sm:p-6",
        accent
          ? "border-[var(--accent-ring)] shadow-[0_20px_70px_var(--accent-soft)]"
          : "",
        className,
      ].join(" ")}
    >
      {accent && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {icon && (
              <span
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                  accent
                    ? "border-[var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-muted)]",
                ].join(" ")}
              >
                {icon}
              </span>
            )}

            <p className="truncate text-sm font-medium text-[var(--text-muted)]">
              {label}
            </p>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-4 w-44" />
            </div>
          ) : (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-default)] sm:text-4xl"
              >
                {value}
              </motion.div>

              {(description || trend) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {trend && (
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1",
                        "text-xs font-semibold",
                        trendClasses[
                          trendDirection
                        ],
                      ].join(" ")}
                    >
                      {trendDirection ===
                        "up" && (
                        <span aria-hidden="true">
                          ↗
                        </span>
                      )}

                      {trendDirection ===
                        "down" && (
                        <span aria-hidden="true">
                          ↘
                        </span>
                      )}

                      {trendDirection ===
                        "neutral" && (
                        <span aria-hidden="true">
                          →
                        </span>
                      )}

                      {trend.value}
                    </span>
                  )}

                  {trend?.label && (
                    <span className="text-xs text-[var(--text-subtle)]">
                      {trend.label}
                    </span>
                  )}

                  {description && (
                    <span className="text-sm text-[var(--text-muted)]">
                      {description}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {action && (
          <div className="relative shrink-0">
            {action}
          </div>
        )}
      </div>
    </Card>
  );
}