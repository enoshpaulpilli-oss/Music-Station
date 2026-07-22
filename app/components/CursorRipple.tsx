"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const symbols = ["𝄞", "♪", "♫", "♩", "♬", "𝄢"];

type FlyingSymbol = {
  id: number;
  symbol: string;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  rotation: number;
  scale: number;
};

export default function CursorRipple() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const symbolIndexRef = useRef(0);
  const timerRefs = useRef<Set<number>>(new Set());

  const [isDesktopPointer, setIsDesktopPointer] =
    useState(false);

  const [symbolIndex, setSymbolIndex] =
    useState(0);

  const [flyingSymbols, setFlyingSymbols] =
    useState<FlyingSymbol[]>([]);

  const addFlyingSymbols = useCallback(
    (newSymbols: FlyingSymbol[]) => {
      setFlyingSymbols((current) =>
        [...current, ...newSymbols].slice(-24),
      );

      const idsToRemove = new Set(
        newSymbols.map((item) => item.id),
      );

      const timer = window.setTimeout(() => {
        timerRefs.current.delete(timer);

        setFlyingSymbols((current) =>
          current.filter(
            (item) => !idsToRemove.has(item.id),
          ),
        );
      }, 950);

      timerRefs.current.add(timer);
    },
    [],
  );

  const moveToNextSymbol = useCallback(
    (amount = 1) => {
      const nextIndex =
        (symbolIndexRef.current + amount) %
        symbols.length;

      symbolIndexRef.current = nextIndex;
      setSymbolIndex(nextIndex);
    },
    [],
  );

  const createSingleSymbol = useCallback(
    (x: number, y: number) => {
      const currentIndex =
        symbolIndexRef.current;

      const item: FlyingSymbol = {
        id: performance.now() + Math.random(),
        symbol: symbols[currentIndex],
        x,
        y,
        driftX: Math.random() * 54 - 27,
        driftY: -(70 + Math.random() * 45),
        rotation: Math.random() * 80 - 40,
        scale: 0.9 + Math.random() * 0.35,
      };

      addFlyingSymbols([item]);
      moveToNextSymbol();
    },
    [addFlyingSymbols, moveToNextSymbol],
  );

  const createTapBurst = useCallback(
    (x: number, y: number) => {
      const burstAmount = 4;
      const startIndex =
        symbolIndexRef.current;

      const burst: FlyingSymbol[] =
        Array.from(
          { length: burstAmount },
          (_, index) => {
            const angle =
              -Math.PI +
              Math.random() * Math.PI;

            const distance =
              35 + Math.random() * 55;

            return {
              id:
                performance.now() +
                Math.random() +
                index,
              symbol:
                symbols[
                  (startIndex + index) %
                    symbols.length
                ],
              x,
              y,
              driftX:
                Math.cos(angle) * distance,
              driftY:
                -45 - Math.random() * 75,
              rotation:
                Math.random() * 140 - 70,
              scale:
                0.75 +
                Math.random() * 0.55,
            };
          },
        );

      addFlyingSymbols(burst);
      moveToNextSymbol(burstAmount);
    },
    [addFlyingSymbols, moveToNextSymbol],
  );

  useEffect(() => {
    const pointerQuery =
      window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      );

    const updatePointerMode = () => {
      setIsDesktopPointer(
        pointerQuery.matches,
      );
    };

    updatePointerMode();

    pointerQuery.addEventListener(
      "change",
      updatePointerMode,
    );

    return () => {
      pointerQuery.removeEventListener(
        "change",
        updatePointerMode,
      );
    };
  }, []);

  useEffect(() => {
    if (!isDesktopPointer) {
      return;
    }

    const moveCursor = (
      event: PointerEvent,
    ) => {
      if (event.pointerType === "touch") {
        return;
      }

      const cursor = cursorRef.current;

      if (!cursor) {
        return;
      }

      cursor.style.transform =
        `translate3d(${event.clientX - 12}px, ${
          event.clientY - 14
        }px, 0)`;

      cursor.style.opacity = "1";
    };

    const handleClick = (
      event: MouseEvent,
    ) => {
      createSingleSymbol(
        event.clientX,
        event.clientY,
      );
    };

    const hideCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity =
          "0";
      }
    };

    window.addEventListener(
      "pointermove",
      moveCursor,
      { passive: true },
    );

    window.addEventListener(
      "click",
      handleClick,
    );

    window.addEventListener(
      "blur",
      hideCursor,
    );

    document.documentElement.addEventListener(
      "mouseleave",
      hideCursor,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        moveCursor,
      );

      window.removeEventListener(
        "click",
        handleClick,
      );

      window.removeEventListener(
        "blur",
        hideCursor,
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        hideCursor,
      );
    };
  }, [
    createSingleSymbol,
    isDesktopPointer,
  ]);

  useEffect(() => {
    if (isDesktopPointer) {
      return;
    }

    const handleTouch = (
      event: PointerEvent,
    ) => {
      if (event.pointerType !== "touch") {
        return;
      }

      createTapBurst(
        event.clientX,
        event.clientY,
      );
    };

    window.addEventListener(
      "pointerdown",
      handleTouch,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        handleTouch,
      );
    };
  }, [
    createTapBurst,
    isDesktopPointer,
  ]);

  useEffect(() => {
    const timers = timerRefs.current;

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timers.clear();
    };
  }, []);

  return (
    <>
      {isDesktopPointer && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            left-0
            top-0
            z-[99999]
            flex
            h-7
            w-7
            items-center
            justify-center
            text-2xl
            text-purple-200
            opacity-0
            will-change-transform
          "
          style={{
            textShadow:
              "0 0 6px rgba(216, 180, 254, 0.75)",
          }}
        >
          <span
            key={symbolIndex}
            className="animate-cursor-symbol-enter"
          >
            {symbols[symbolIndex]}
          </span>
        </div>
      )}

      {flyingSymbols.map((item) => (
        <span
          key={item.id}
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            z-[99998]
            text-xl
            text-purple-200
            animate-musical-tap-burst
          "
          style={
            {
              left: item.x,
              top: item.y,
              textShadow:
                "0 0 5px rgba(216, 180, 254, 0.65)",
              "--symbol-drift-x":
                `${item.driftX}px`,
              "--symbol-drift-y":
                `${item.driftY}px`,
              "--symbol-rotation":
                `${item.rotation}deg`,
              "--symbol-scale":
                item.scale,
            } as CSSProperties
          }
        >
          {item.symbol}
        </span>
      ))}
    </>
  );
}
