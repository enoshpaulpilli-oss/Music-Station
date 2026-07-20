"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const cleanupTimersRef = useRef<number[]>([]);

  const mousePosition = useRef({
    x: -100,
    y: -100,
  });

  const [isDesktopPointer, setIsDesktopPointer] = useState(false);
  const [symbolIndex, setSymbolIndex] = useState(0);
  const [flyingSymbols, setFlyingSymbols] = useState<FlyingSymbol[]>([]);

  const currentSymbol = symbols[symbolIndex];

  useEffect(() => {
    symbolIndexRef.current = symbolIndex;
  }, [symbolIndex]);

  useEffect(() => {
    const desktopPointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const updatePointerMode = () => {
      setIsDesktopPointer(desktopPointerQuery.matches);
    };

    updatePointerMode();

    desktopPointerQuery.addEventListener("change", updatePointerMode);

    return () => {
      desktopPointerQuery.removeEventListener("change", updatePointerMode);
    };
  }, []);

  const removeSymbolAfterAnimation = useCallback((id: number) => {
    const timer = window.setTimeout(() => {
      setFlyingSymbols((currentSymbols) =>
        currentSymbols.filter((symbol) => symbol.id !== id)
      );
    }, 950);

    cleanupTimersRef.current.push(timer);
  }, []);

  const createSingleSymbol = useCallback(
    (x: number, y: number) => {
      const currentIndex = symbolIndexRef.current;
      const id = Date.now() + Math.random();

      const newSymbol: FlyingSymbol = {
        id,
        symbol: symbols[currentIndex],
        x,
        y,
        driftX: Math.random() * 54 - 27,
        driftY: -(70 + Math.random() * 45),
        rotation: Math.random() * 80 - 40,
        scale: 0.9 + Math.random() * 0.35,
      };

      setFlyingSymbols((currentSymbols) => [
        ...currentSymbols,
        newSymbol,
      ]);

      const nextIndex = (currentIndex + 1) % symbols.length;

      symbolIndexRef.current = nextIndex;
      setSymbolIndex(nextIndex);

      removeSymbolAfterAnimation(id);
    },
    [removeSymbolAfterAnimation]
  );

  const createTapBurst = useCallback(
    (x: number, y: number) => {
      const burstAmount = 4;

      for (let index = 0; index < burstAmount; index += 1) {
        const symbolPosition =
          (symbolIndexRef.current + index) % symbols.length;

        const id =
          Date.now() +
          Math.random() +
          index;

        const angle =
          -Math.PI +
          Math.random() * Math.PI;

        const distance =
          35 + Math.random() * 55;

        const burstSymbol: FlyingSymbol = {
          id,
          symbol: symbols[symbolPosition],
          x,
          y,
          driftX: Math.cos(angle) * distance,
          driftY: -45 - Math.random() * 75,
          rotation: Math.random() * 140 - 70,
          scale: 0.75 + Math.random() * 0.55,
        };

        setFlyingSymbols((currentSymbols) => [
          ...currentSymbols,
          burstSymbol,
        ]);

        removeSymbolAfterAnimation(id);
      }

      const nextIndex =
        (symbolIndexRef.current + burstAmount) % symbols.length;

      symbolIndexRef.current = nextIndex;
      setSymbolIndex(nextIndex);
    },
    [removeSymbolAfterAnimation]
  );

  useEffect(() => {
    if (!isDesktopPointer) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseClick = (event: MouseEvent) => {
      createSingleSymbol(event.clientX, event.clientY);
    };

    let animationFrame = 0;

    const animateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(
          ${mousePosition.current.x - 12}px,
          ${mousePosition.current.y - 14}px,
          0
        )`;
      }

      animationFrame = window.requestAnimationFrame(animateCursor);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleMouseClick);

    animateCursor();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [createSingleSymbol, isDesktopPointer]);

  useEffect(() => {
    if (isDesktopPointer) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        return;
      }

      createTapBurst(event.clientX, event.clientY);
    };

    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [createTapBurst, isDesktopPointer]);

  useEffect(() => {
    const cleanupTimers = cleanupTimersRef.current.slice();
    return () => {
      cleanupTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  return (
    <>
      {/* Permanent cursor exists only on real mouse/trackpad devices */}
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
            drop-shadow-[0_0_8px_rgba(216,180,254,0.9)]
            will-change-transform
          "
        >
          <span
            key={currentSymbol}
            className="animate-cursor-symbol-enter"
          >
            {currentSymbol}
          </span>
        </div>
      )}

      {/* Temporary desktop clicks and mobile tap bursts */}
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
           drop-shadow-[0_0_5px_rgba(216,180,254,0.7)]
            animate-musical-tap-burst
          "
          style={
            {
              left: item.x,
              top: item.y,
              "--symbol-drift-x": `${item.driftX}px`,
              "--symbol-drift-y": `${item.driftY}px`,
              "--symbol-rotation": `${item.rotation}deg`,
              "--symbol-scale": item.scale,
            } as React.CSSProperties
          }
        >
          {item.symbol}
        </span>
      ))}
    </>
  );
}