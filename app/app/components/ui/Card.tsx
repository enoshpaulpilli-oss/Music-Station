
"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type CardPadding = "none" | "sm" | "md" | "lg";

type CardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  hover?: boolean;
  interactive?: boolean;
  padding?: CardPadding;
};

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      hover = false,
      interactive = false,
      padding = "md",
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -3 } : undefined}
        whileTap={interactive ? { scale: 0.995 } : undefined}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "rounded-3xl border border-[var(--border)]",
          "bg-[var(--surface)] text-[var(--text-default)]",
          "shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl",
          "transition-[background-color,border-color,box-shadow,transform]",
          interactive
            ? "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
            : "",
          paddingClasses[padding],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={["mb-5", className].join(" ")}>{children}</div>;
}

function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={["text-lg font-semibold tracking-[-0.02em]", className].join(" ")}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={["mt-1 text-sm leading-6 text-[var(--text-muted)]", className].join(" ")}>
      {children}
    </p>
  );
}

function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={["mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5", className].join(" ")}>
      {children}
    </div>
  );
}

export default Card;
export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
export type { CardPadding, CardProps };