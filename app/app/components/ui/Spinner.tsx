"use client";

 

import {

  forwardRef,

  type HTMLAttributes,

} from "react";

 

type SpinnerSize = "xs" | "sm" | "md" | "lg";

type SpinnerTone = "accent" | "current" | "muted";

 

interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {

  size?: SpinnerSize;

  tone?: SpinnerTone;

  label?: string;

}

 

const sizeClasses: Record<SpinnerSize, string> = {

  xs: "h-3.5 w-3.5 border-[1.5px]",

  sm: "h-4 w-4 border-2",

  md: "h-5 w-5 border-2",

  lg: "h-7 w-7 border-[3px]",

};

 

const toneClasses: Record<SpinnerTone, string> = {

  accent:

    "border-[var(--accent-soft)] border-r-[var(--accent)] border-t-[var(--accent)]",

  current:

    "border-current/25 border-r-current border-t-current",

  muted:

    "border-[var(--border)] border-r-[var(--text-muted)] border-t-[var(--text-muted)]",

};

 

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(

  (

    {

      size = "md",

      tone = "accent",

      label = "Loading",

      className = "",

      ...props

    },

    ref,

  ) => {

    return (

      <span

        ref={ref}

        role="status"

        aria-live="polite"

        aria-label={label}

        className={[

          "inline-flex items-center justify-center",

          className,

        ].join(" ")}

        {...props}

      >

        <span

          aria-hidden="true"

          className={[

            "block animate-spin rounded-full",

            sizeClasses[size],

            toneClasses[tone],

          ].join(" ")}

        />

        <span className="sr-only">{label}</span>

      </span>

    );

  },

);

 

Spinner.displayName = "Spinner";

 

export default Spinner;

export type { SpinnerProps, SpinnerSize, SpinnerTone };