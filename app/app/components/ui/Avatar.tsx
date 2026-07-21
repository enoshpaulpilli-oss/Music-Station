
"use client";

import { useMemo, useState } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type PresenceStatus = "online" | "away" | "busy" | "offline";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  status?: PresenceStatus;
  showStatus?: boolean;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-7 w-7 text-[9px]",
  sm: "h-9 w-9 text-[10px]",
  md: "h-11 w-11 text-xs",
  lg: "h-14 w-14 text-sm",
  xl: "h-20 w-20 text-lg",
};

const statusClasses: Record<PresenceStatus, string> = {
  online: "bg-emerald-400",
  away: "bg-amber-400",
  busy: "bg-red-400",
  offline: "bg-slate-500",
};

export default function Avatar({
  src,
  alt,
  name = "",
  initials,
  size = "md",
  status = "offline",
  showStatus = false,
  className = "",
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const fallback = useMemo(() => {
    if (initials?.trim()) return initials.trim().slice(0, 2).toUpperCase();

    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MS";
  }, [initials, name]);

  const shouldShowImage = Boolean(src) && !imageFailed;

  return (
    <span
      className={[
        "relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-full",
        sizeClasses[size],
        className,
      ].join(" ")}
      aria-label={alt ?? name ?? "User avatar"}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full border border-[var(--border)] bg-gradient-to-br from-[var(--accent-soft)] to-[var(--surface-strong)] shadow-[0_10px_35px_var(--accent-soft)]">
        {shouldShowImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src ?? undefined}
            alt={alt ?? name}
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-semibold text-[var(--accent)]">
            {fallback}
          </span>
        )}
      </span>

      {showStatus && (
        <span
          className={[
            "absolute bottom-0 right-0 h-[28%] w-[28%] rounded-full border-2 border-[var(--background-elevated)]",
            statusClasses[status],
          ].join(" ")}
          aria-label={status}
          title={status}
        />
      )}
    </span>
  );
}

export type { AvatarProps, AvatarSize, PresenceStatus };