"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type DropdownAlign = "left" | "right";

type DropdownItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  href?: string;
  onSelect?: () => void;
  separatorBefore?: boolean;
};

type DropdownProps = {
  trigger: ReactNode;
  items: readonly DropdownItem[];
  align?: DropdownAlign;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  ariaLabel?: string;
  className?: string;
  menuClassName?: string;
};

export default function Dropdown({
  trigger,
  items,
  align = "right",
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
  ariaLabel = "Open menu",
  className = "",
  menuClassName = "",
}: DropdownProps) {
  const [internalOpen, setInternalOpen] =
    useState(defaultOpen);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const itemRefs = useRef<
    Array<
      HTMLButtonElement |
      HTMLAnchorElement |
      null
    >
  >([]);

  const isControlled = open !== undefined;
  const isOpen = isControlled
    ? open
    : internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const focusItem = (
    startIndex: number,
    direction: 1 | -1 = 1,
  ) => {
    if (items.length === 0) {
      return;
    }

    let index = startIndex;

    for (
      let attempts = 0;
      attempts < items.length;
      attempts += 1
    ) {
      index =
        (index + items.length) %
        items.length;

      if (!items[index]?.disabled) {
        itemRefs.current[index]?.focus();
        return;
      }

      index += direction;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (
      event: MouseEvent,
    ) => {
      if (
        !rootRef.current?.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (
      event: globalThis.KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, setOpen]);

  const openAndFocusFirst = () => {
    setOpen(true);

    window.requestAnimationFrame(() => {
      focusItem(0);
    });
  };

  const handleTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openAndFocusFirst();
    }
  };

  const handleMenuKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    const currentIndex =
      itemRefs.current.findIndex(
        (item) =>
          item === document.activeElement,
      );

    if (event.key === "ArrowDown") {
      event.preventDefault();

      focusItem(
        currentIndex < 0
          ? 0
          : currentIndex + 1,
        1,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      focusItem(
        currentIndex < 0
          ? items.length - 1
          : currentIndex - 1,
        -1,
      );
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0, 1);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(items.length - 1, -1);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const handleSelect = (
    item: DropdownItem,
  ) => {
    if (item.disabled) {
      return;
    }

    item.onSelect?.();

    if (closeOnSelect) {
      setOpen(false);
    }
  };

  const itemClassName = (
    item: DropdownItem,
  ) =>
    [
      "flex w-full items-start gap-3 rounded-xl px-3 py-2.5",
      "text-left text-sm outline-none transition",
      "focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]",
      item.disabled
        ? "cursor-not-allowed opacity-40"
        : item.danger
          ? "text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
          : [
              "text-[var(--text-muted)]",
              "hover:bg-[var(--surface-hover)]",
              "hover:text-[var(--text-default)]",
              "focus:bg-[var(--surface-hover)]",
              "focus:text-[var(--text-default)]",
            ].join(" "),
    ].join(" ");

  return (
    <div
      ref={rootRef}
      className={[
        "relative inline-flex",
        className,
      ].join(" ")}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        className={[
          "inline-flex outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[var(--accent-ring)]",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--background)]",
        ].join(" ")}
      >
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label={ariaLabel}
            onKeyDown={handleMenuKeyDown}
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.97,
              filter: "blur(5px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -4,
              scale: 0.98,
              filter: "blur(4px)",
            }}
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={[
              "absolute top-[calc(100%+0.65rem)] z-[120] min-w-56",
              "overflow-hidden rounded-2xl border",
              "border-[var(--border)] bg-[var(--background-elevated)] p-2",
              "shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-3xl",
              align === "right"
                ? "right-0"
                : "left-0",
              menuClassName,
            ].join(" ")}
          >
            {items.map((item, index) => {
              const content = (
                <>
                  {item.icon && (
                    <span className="mt-0.5 shrink-0 text-current">
                      {item.icon}
                    </span>
                  )}

                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">
                      {item.label}
                    </span>

                    {item.description && (
                      <span className="mt-0.5 block text-xs leading-5 text-[var(--text-subtle)]">
                        {item.description}
                      </span>
                    )}
                  </span>
                </>
              );

              return (
                <div key={item.id}>
                  {item.separatorBefore && (
                    <div className="my-2 h-px bg-[var(--border)]" />
                  )}

                  {item.href &&
                  !item.disabled ? (
                    <a
                      ref={(node) => {
                        itemRefs.current[
                          index
                        ] = node;
                      }}
                      href={item.href}
                      role="menuitem"
                      tabIndex={-1}
                      className={itemClassName(
                        item,
                      )}
                      onClick={() =>
                        handleSelect(item)
                      }
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      ref={(node) => {
                        itemRefs.current[
                          index
                        ] = node;
                      }}
                      type="button"
                      role="menuitem"
                      tabIndex={-1}
                      disabled={item.disabled}
                      className={itemClassName(
                        item,
                      )}
                      onClick={() =>
                        handleSelect(item)
                      }
                    >
                      {content}
                    </button>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type {
  DropdownAlign,
  DropdownItem,
  DropdownProps,
};