"use client";

 

import { motion } from "framer-motion";

import type { ReactNode } from "react";

 

interface EmptyStateProps {

  title: string;

  description?: string;

  icon?: ReactNode;

  action?: ReactNode;

  secondaryAction?: ReactNode;

  compact?: boolean;

  className?: string;

}

 

function DefaultEmptyIcon() {

  return (

    <svg

      viewBox="0 0 24 24"

      fill="none"

      className="h-6 w-6"

      aria-hidden="true"

    >

      <path

        d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 16.5v-9Z"

        stroke="currentColor"

        strokeWidth="1.6"

      />

      <path

        d="M8.5 12h7M12 8.5v7"

        stroke="currentColor"

        strokeWidth="1.6"

        strokeLinecap="round"

      />

    </svg>

  );

}

 

export default function EmptyState({

  title,

  description,

  icon,

  action,

  secondaryAction,

  compact = false,

  className = "",

}: EmptyStateProps) {

  return (

    <motion.section

      initial={{ opacity: 0, y: 10 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}

      className={[

        "flex w-full flex-col items-center justify-center text-center",

        "rounded-3xl border border-dashed border-[var(--border)]",

        "bg-[var(--surface)] backdrop-blur-xl",

        compact ? "px-5 py-8" : "px-6 py-14",

        className,

      ].join(" ")}

    >

      <div

        className={[

          "flex items-center justify-center rounded-2xl",

          "border border-[var(--accent-ring)]",

          "bg-[var(--accent-soft)] text-[var(--accent)]",

          compact ? "h-11 w-11" : "h-14 w-14",

        ].join(" ")}

      >

        {icon ?? <DefaultEmptyIcon />}

      </div>

 

      <h3

        className={[

          "font-semibold tracking-[-0.025em] text-[var(--text-default)]",

          compact ? "mt-4 text-base" : "mt-5 text-xl",

        ].join(" ")}

      >

        {title}

      </h3>

 

      {description && (

        <p

          className={[

            "max-w-md leading-6 text-[var(--text-muted)]",

            compact ? "mt-2 text-xs" : "mt-2 text-sm",

          ].join(" ")}

        >

          {description}

        </p>

      )}

 

      {(action || secondaryAction) && (

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

          {action}

          {secondaryAction}

        </div>

      )}

    </motion.section>

  );

}

 

export type { EmptyStateProps };