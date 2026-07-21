import type {

  HTMLAttributes,

  ReactNode,

} from "react";

 

type DividerOrientation = "horizontal" | "vertical";

 

interface DividerProps extends HTMLAttributes<HTMLDivElement> {

  orientation?: DividerOrientation;

  label?: ReactNode;

}

 

export default function Divider({

  orientation = "horizontal",

  label,

  className = "",

  ...props

}: DividerProps) {

  if (orientation === "vertical") {

    return (

      <div

        role="separator"

        aria-orientation="vertical"

        className={[

          "h-full min-h-6 w-px shrink-0",

          "bg-[var(--border)]",

          className,

        ].join(" ")}

        {...props}

      />

    );

  }

 

  if (label) {

    return (

      <div

        role="separator"

        aria-orientation="horizontal"

        className={[

          "flex w-full items-center gap-3",

          className,

        ].join(" ")}

        {...props}

      >

        <span className="h-px flex-1 bg-[var(--border)]" />

        <span className="shrink-0 text-xs font-medium text-[var(--text-subtle)]">

          {label}

        </span>

        <span className="h-px flex-1 bg-[var(--border)]" />

      </div>

    );

  }

 

  return (

    <div

      role="separator"

      aria-orientation="horizontal"

      className={[

        "h-px w-full bg-[var(--border)]",

        className,

      ].join(" ")}

      {...props}

    />

  );

}

 

export type { DividerOrientation, DividerProps };