"use client";

 

import {

  useEffect,

  useId,

  useMemo,

  useState,

  type KeyboardEvent,

  type ReactNode,

} from "react";

import { AnimatePresence, motion } from "framer-motion";

 

export type TabsOrientation = "horizontal" | "vertical";

export type TabsVariant = "underline" | "pills";

 

export type TabItem = {

  value: string;

  label: ReactNode;

  content: ReactNode;

  icon?: ReactNode;

  badge?: ReactNode;

  disabled?: boolean;

};

 

export type TabsProps = {

  items: TabItem[];

  value?: string;

  defaultValue?: string;

  onValueChange?: (value: string) => void;

  orientation?: TabsOrientation;

  variant?: TabsVariant;

  className?: string;

  listClassName?: string;

  panelClassName?: string;

  ariaLabel?: string;

  keepMounted?: boolean;

};

 

export default function Tabs({

  items,

  value,

  defaultValue,

  onValueChange,

  orientation = "horizontal",

  variant = "underline",

  className = "",

  listClassName = "",

  panelClassName = "",

  ariaLabel = "Tabs",

  keepMounted = false,

}: TabsProps) {

  const generatedId = useId();

  const enabledItems = useMemo(

    () => items.filter((item) => !item.disabled),

    [items],

  );

 

  const initialValue =

    defaultValue ?? enabledItems[0]?.value ?? items[0]?.value ?? "";

  const [internalValue, setInternalValue] = useState(initialValue);

  const selectedValue = value ?? internalValue;

 

  useEffect(() => {

    if (!items.some((item) => item.value === selectedValue && !item.disabled)) {

      const fallback = enabledItems[0]?.value;

      if (fallback && value === undefined) {

        setInternalValue(fallback);

      }

    }

  }, [enabledItems, items, selectedValue, value]);

 

  const selectTab = (nextValue: string) => {

    const nextItem = items.find((item) => item.value === nextValue);

    if (!nextItem || nextItem.disabled) return;

 

    if (value === undefined) {

      setInternalValue(nextValue);

    }

    onValueChange?.(nextValue);

  };

 

  const handleKeyDown = (

    event: KeyboardEvent<HTMLButtonElement>,

    currentIndex: number,

  ) => {

    const previousKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";

    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";

 

    if (![previousKey, nextKey, "Home", "End"].includes(event.key)) return;

    event.preventDefault();

 

    if (enabledItems.length === 0) return;

 

    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;

    if (event.key === "End") nextIndex = enabledItems.length - 1;

    if (event.key === previousKey) {

      nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;

    }

    if (event.key === nextKey) {

      nextIndex = (currentIndex + 1) % enabledItems.length;

    }

 

    const nextItem = enabledItems[nextIndex];

    if (!nextItem) return;

 

    selectTab(nextItem.value);

    document

      .getElementById(`${generatedId}-tab-${nextItem.value}`)

      ?.focus();

  };

 

  const selectedItem =

    items.find((item) => item.value === selectedValue && !item.disabled) ??

    enabledItems[0];

 

  return (

    <div

      className={[

        orientation === "vertical" ? "flex items-start gap-5" : "",

        className,

      ].join(" ")}

    >

      <div

        role="tablist"

        aria-label={ariaLabel}

        aria-orientation={orientation}

        className={[

          orientation === "vertical"

            ? "flex min-w-44 flex-col gap-1"

            : "flex max-w-full items-center gap-1 overflow-x-auto",

          variant === "pills"

            ? "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1"

            : "border-b border-[var(--border)]",

          listClassName,

        ].join(" ")}

      >

        {items.map((item) => {

          const isSelected = item.value === selectedItem?.value;

          const enabledIndex = enabledItems.findIndex(

            (enabled) => enabled.value === item.value,

          );

 

          return (

            <button

              key={item.value}

              id={`${generatedId}-tab-${item.value}`}

              type="button"

              role="tab"

              aria-selected={isSelected}

              aria-controls={`${generatedId}-panel-${item.value}`}

              tabIndex={isSelected ? 0 : -1}

              disabled={item.disabled}

              onClick={() => selectTab(item.value)}

              onKeyDown={(event) => handleKeyDown(event, enabledIndex)}

              className={[

                "relative inline-flex shrink-0 items-center justify-center gap-2",

                "outline-none transition-colors",

                "focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]",

                "disabled:cursor-not-allowed disabled:opacity-40",

                variant === "pills"

                  ? "min-h-10 rounded-xl px-4 text-sm font-semibold"

                  : "min-h-11 px-4 text-sm font-medium",

                isSelected

                  ? variant === "pills"

                    ? "text-[var(--accent-text)]"

                    : "text-[var(--text-default)]"

                  : "text-[var(--text-muted)] hover:text-[var(--text-default)]",

              ].join(" ")}

            >

              {isSelected && variant === "pills" && (

                <motion.span

                  layoutId={`${generatedId}-pill`}

                  className="absolute inset-0 rounded-xl bg-[var(--accent)] shadow-[0_12px_34px_var(--accent-soft)]"

                  transition={{ type: "spring", stiffness: 420, damping: 34 }}

                />

              )}

 

              <span className="relative inline-flex items-center gap-2">

                {item.icon && (

                  <span className="flex h-4 w-4 items-center justify-center">

                    {item.icon}

                  </span>

                )}

                <span>{item.label}</span>

                {item.badge && <span>{item.badge}</span>}

              </span>

 

              {isSelected && variant === "underline" && (

                <motion.span

                  layoutId={`${generatedId}-underline`}

                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--accent)]"

                  transition={{ type: "spring", stiffness: 420, damping: 34 }}

                />

              )}

            </button>

          );

        })}

      </div>

 

      <div className={orientation === "vertical" ? "min-w-0 flex-1" : "mt-5"}>

        {keepMounted ? (

          items.map((item) => {

            const isSelected = item.value === selectedItem?.value;

            return (

              <div

                key={item.value}

                id={`${generatedId}-panel-${item.value}`}

                role="tabpanel"

                aria-labelledby={`${generatedId}-tab-${item.value}`}

                hidden={!isSelected}

                tabIndex={0}

                className={panelClassName}

              >

                {item.content}

              </div>

            );

          })

        ) : (

          <AnimatePresence mode="wait" initial={false}>

            {selectedItem && (

              <motion.div

                key={selectedItem.value}

                id={`${generatedId}-panel-${selectedItem.value}`}

                role="tabpanel"

                aria-labelledby={`${generatedId}-tab-${selectedItem.value}`}

                tabIndex={0}

                initial={{ opacity: 0, y: 6 }}

                animate={{ opacity: 1, y: 0 }}

                exit={{ opacity: 0, y: -4 }}

                transition={{ duration: 0.18 }}

                className={panelClassName}

              >

                {selectedItem.content}

              </motion.div>

            )}

          </AnimatePresence>

        )}

      </div>

    </div>

  );

}