import type { HTMLAttributes } from "react";

 

type SkeletonVariant =

  | "text"

  | "rounded"

  | "circle"

  | "card";

 

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {

  variant?: SkeletonVariant;

  animated?: boolean;

}

 

const variantClasses: Record<SkeletonVariant, string> = {

  text: "h-4 rounded-lg",

  rounded: "rounded-2xl",

  circle: "aspect-square rounded-full",

  card: "min-h-32 rounded-3xl",

};

 

export default function Skeleton({

  variant = "rounded",

  animated = true,

  className = "",

  ...props

}: SkeletonProps) {

  return (

    <div

      aria-hidden="true"

      className={[

        "relative overflow-hidden",

        "border border-[var(--border)]",

        "bg-[var(--surface-strong)]",

        variantClasses[variant],

        animated

          ? "animate-pulse motion-reduce:animate-none"

          : "",

        className,

      ].join(" ")}

      {...props}

    />

  );

}

 

export type { SkeletonProps, SkeletonVariant };