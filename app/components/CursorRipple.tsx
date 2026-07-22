"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const symbols = ["𝄞", "♪", "♫", "♩", "♬", "𝄢"];

function createNativeMusicCursor(
  symbol: string,
) {
  const cursorSvg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="34"
  height="38"
  viewBox="0 0 34 38"
>
  <text
    x="1"
    y="31"
    font-family="Georgia, Times New Roman, serif"
    font-size="31"
    font-weight="400"
    fill="#e9d5ff"
    stroke="#7e22ce"
    stroke-width="0.45"
    paint-order="stroke"
  >${symbol}</text>
</svg>
`;

  return `url("data:image/svg+xml,${encodeURIComponent(
    cursorSvg,
  )}") 8 5, auto`;
}

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
  const symbolIndexRef = useRef(0);

  const timersRef = useRef<
    Set<number>
  >(new Set());

  const [
    isDesktopPointer,
    setIsDesktopPointer,
  ] = useState(false);

  const [
    cursorSymbolIndex,
    setCursorSymbolIndex,
  ] = useState(0);

  const [
    flyingSymbols,
    setFlyingSymbols,
  ] = useState<FlyingSymbol[]>([]);

  const nativeMusicCursor =
    createNativeMusicCursor(
      symbols[cursorSymbolIndex],
    );

  const addSymbols = useCallback(
    (newSymbols: FlyingSymbol[]) => {
      setFlyingSymbols((current) =>
        [...current, ...newSymbols].slice(-24),
      );

      const ids = new Set(
        newSymbols.map((item) => item.id),
      );

      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer);

        setFlyingSymbols((current) =>
          current.filter(
            (item) => !ids.has(item.id),
          ),
        );
      }, 950);

      timersRef.current.add(timer);
    },
    [],
  );

  const createClickSymbol = useCallback(
    (x: number, y: number) => {
      const index =
        symbolIndexRef.current;

      addSymbols([
        {
          id:
            performance.now() +
            Math.random(),
          symbol: symbols[index],
          x,
          y,
          driftX:
            Math.random() * 54 - 27,
          driftY:
            -(70 + Math.random() * 45),
          rotation:
            Math.random() * 80 - 40,
          scale:
            0.9 +
            Math.random() * 0.35,
        },
      ]);

      const nextIndex =
        (index + 1) % symbols.length;

      symbolIndexRef.current =
        nextIndex;

      setCursorSymbolIndex(nextIndex);
    },
    [addSymbols],
  );

  const createTouchBurst = useCallback(
    (x: number, y: number) => {
      const startIndex =
        symbolIndexRef.current;

      const burst = Array.from(
        { length: 4 },
        (_, index): FlyingSymbol => {
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
              Math.cos(angle) *
              distance,
            driftY:
              -45 -
              Math.random() * 75,
            rotation:
              Math.random() * 140 - 70,
            scale:
              0.75 +
              Math.random() * 0.55,
          };
        },
      );

      addSymbols(burst);

      const nextIndex =
        (startIndex + burst.length) %
        symbols.length;

      symbolIndexRef.current =
        nextIndex;

      setCursorSymbolIndex(nextIndex);
    },
    [addSymbols],
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

    const handleClick = (
      event: MouseEvent,
    ) => {
      createClickSymbol(
        event.clientX,
        event.clientY,
      );
    };

    window.addEventListener(
      "click",
      handleClick,
    );

    return () => {
      window.removeEventListener(
        "click",
        handleClick,
      );
    };
  }, [
    createClickSymbol,
    isDesktopPointer,
  ]);

  useEffect(() => {
    if (isDesktopPointer) {
      return;
    }

    const handleTouch = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerType !== "touch"
      ) {
        return;
      }

      createTouchBurst(
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
    createTouchBurst,
    isDesktopPointer,
  ]);

  useEffect(() => {
    const timers = timersRef.current;

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
        <style>
          {`
            html,
            body,
            body * {
              cursor: ${nativeMusicCursor} !important;
            }
          `}
        </style>
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
