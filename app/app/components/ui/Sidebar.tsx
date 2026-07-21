"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

export type SidebarItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  exact?: boolean;
};

export type SidebarSection = {
  label?: string;
  items: SidebarItem[];
};

export type SidebarProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  logo?: ReactNode;
  sections: SidebarSection[];
  footer?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (
    collapsed: boolean,
  ) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (
    open: boolean,
  ) => void;
  className?: string;
  widthClassName?: string;
  collapsedWidthClassName?: string;
  ariaLabel?: string;
};

function isItemActive(
  pathname: string,
  item: SidebarItem,
) {
  if (item.exact) {
    return pathname === item.href;
  }

  return (
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`)
  );
}

export default function Sidebar({
  title,
  subtitle,
  logo,
  sections,
  footer,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  mobileOpen = false,
  onMobileOpenChange,
  className = "",
  widthClassName = "w-72",
  collapsedWidthClassName = "w-[88px]",
  ariaLabel = "Primary navigation",
}: SidebarProps) {
  const pathname = usePathname();
  const generatedId = useId();

  const [
    internalCollapsed,
    setInternalCollapsed,
  ] = useState(defaultCollapsed);

  const isCollapsed =
    collapsed ?? internalCollapsed;

  const setCollapsed = (
    nextValue: boolean,
  ) => {
    if (collapsed === undefined) {
      setInternalCollapsed(nextValue);
    }

    onCollapsedChange?.(nextValue);
  };

  useEffect(() => {
    onMobileOpenChange?.(false);

    // Close mobile navigation whenever the route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileOpen]);

  const content = (
    <div className="flex h-full flex-col">
      <div
        className={[
          "flex min-h-20 items-center border-b border-[var(--border)]",
          isCollapsed
            ? "justify-center px-3"
            : "gap-3 px-5",
        ].join(" ")}
      >
        {logo && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent)]">
            {logo}
          </div>
        )}

        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--text-default)]">
              {title}
            </p>

            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-[var(--text-subtle)]">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <nav
        aria-label={ariaLabel}
        className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-5"
      >
        {sections.map(
          (section, sectionIndex) => (
            <div
              key={`${generatedId}-section-${sectionIndex}`}
            >
              {section.label &&
                !isCollapsed && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                    {section.label}
                  </p>
                )}

              <div className="space-y-1">
                {section.items.map(
                  (item) => {
                    const active =
                      isItemActive(
                        pathname,
                        item,
                      );

                    const commonClasses = [
                      "group relative flex min-h-11 items-center rounded-2xl",
                      "outline-none transition",
                      "focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]",
                      isCollapsed
                        ? "justify-center px-3"
                        : "gap-3 px-3.5",
                      item.disabled
                        ? "cursor-not-allowed opacity-40"
                        : active
                          ? "bg-[var(--accent-soft)] text-[var(--text-default)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-default)]",
                    ].join(" ");

                    const inner = (
                      <>
                        {active && (
                          <motion.span
                            layoutId={`${generatedId}-active-item`}
                            className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[var(--accent)]"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 34,
                            }}
                          />
                        )}

                        {item.icon && (
                          <span
                            className={[
                              "flex h-5 w-5 shrink-0 items-center justify-center",
                              active
                                ? "text-[var(--accent)]"
                                : "",
                            ].join(" ")}
                          >
                            {item.icon}
                          </span>
                        )}

                        {!isCollapsed && (
                          <>
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">
                              {item.label}
                            </span>

                            {item.badge && (
                              <span className="shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}

                        {isCollapsed && (
                          <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 z-[90] hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-xs font-medium text-[var(--text-default)] shadow-[0_16px_50px_rgba(0,0,0,0.38)] group-hover:block group-focus-visible:block">
                            {item.label}
                          </span>
                        )}
                      </>
                    );

                    if (item.disabled) {
                      return (
                        <div
                          key={item.href}
                          aria-disabled="true"
                          className={
                            commonClasses
                          }
                        >
                          {inner}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={
                          commonClasses
                        }
                      >
                        {inner}
                      </Link>
                    );
                  },
                )}
              </div>
            </div>
          ),
        )}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        {footer && !isCollapsed && (
          <div className="mb-3">
            {footer}
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            setCollapsed(!isCollapsed)
          }
          className={[
            "hidden min-h-10 w-full items-center rounded-xl border border-[var(--border)]",
            "bg-[var(--surface)] text-sm font-medium text-[var(--text-muted)]",
            "transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-default)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]",
            "lg:flex",
            isCollapsed
              ? "justify-center px-3"
              : "justify-between px-3.5",
          ].join(" ")}
          aria-label={
            isCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {!isCollapsed && (
            <span>
              Collapse sidebar
            </span>
          )}

          <motion.span
            animate={{
              rotate: isCollapsed
                ? 180
                : 0,
            }}
            transition={{
              duration: 0.2,
            }}
            aria-hidden="true"
          >
            ←
          </motion.span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={[
          "sticky top-0 hidden h-screen shrink-0 border-r border-[var(--border)]",
          "bg-[var(--background-elevated)]/95 backdrop-blur-3xl",
          "transition-[width] duration-300 lg:block",
          isCollapsed
            ? collapsedWidthClassName
            : widthClassName,
          className,
        ].join(" ")}
      >
        {content}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                onMobileOpenChange?.(
                  false,
                )
              }
              className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className={[
                "fixed inset-y-0 left-0 z-[120] border-r border-[var(--border)]",
                "bg-[var(--background-elevated)] shadow-[30px_0_100px_rgba(0,0,0,0.45)]",
                widthClassName,
                "max-w-[88vw] lg:hidden",
              ].join(" ")}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}