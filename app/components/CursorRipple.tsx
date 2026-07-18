"use client";

import { useEffect, useRef, useState } from "react";

const symbols = ["𝄞", "♪", "♫", "♩", "♬", "𝄢"];

type FlyingSymbol = {
  id: number;
  symbol: string;
  x: number;
  y: number;
  driftX: number;
  rotation: number;
};

export default function CursorRipple() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const symbolIndexRef = useRef(0);

  const mousePosition = useRef({
    x: -100,
    y: -100,
  });

  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [symbolIndex, setSymbolIndex] = useState(0);
  const [flyingSymbols, setFlyingSymbols] = useState<FlyingSymbol[]>([]);

  const currentSymbol = symbols[symbolIndex];

  useEffect(() => {
    symbolIndexRef.current = symbolIndex;
  }, [symbolIndex]);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");

    const updatePointerType = () => {
      setHasFinePointer(pointerQuery.matches);
    };

    updatePointerType();

    pointerQuery.addEventListener("change", updatePointerType);

    return () => {
      pointerQuery.removeEventListener("change", updatePointerType);
    };
  }, []);

  const createFlyingSymbol = (x: number, y: number) => {
    const currentIndex = symbolIndexRef.current;
    const launchedSymbol = symbols[currentIndex];

    const newFlyingSymbol: FlyingSymbol = {
      id: Date.now() + Math.random(),
      symbol: launchedSymbol,
      x,
      y,
      driftX: Math.random() * 50 - 25,
      rotation: Math.random() * 60 - 30,
    };

    setFlyingSymbols((previousSymbols) => [
      ...previousSymbols,
      newFlyingSymbol,
    ]);

    const nextIndex = (currentIndex + 1) % symbols.length;

    symbolIndexRef.current = nextIndex;
    setSymbolIndex(nextIndex);

    window.setTimeout(() => {
      setFlyingSymbols((previousSymbols) =>
        previousSymbols.filter(
          (symbol) => symbol.id !== newFlyingSymbol.id
        )
      );
    }, 1200);
  };

  useEffect(() => {
    if (!hasFinePointer) return;

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleClick = (event: MouseEvent) => {
      createFlyingSymbol(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    let animationFrame: number;

    const animateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `
          translate3d(
            ${mousePosition.current.x - 12}px,
            ${mousePosition.current.y - 14}px,
            0
          )
        `;
      }

      animationFrame = window.requestAnimationFrame(animateCursor);
    };

    animateCursor();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [hasFinePointer]);

  useEffect(() => {
    if (hasFinePointer) return;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (!touch) return;

      createFlyingSymbol(touch.clientX, touch.clientY);
    };

    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [hasFinePointer]);

  return (
    <>
      {/* Desktop cursor only */}
      {hasFinePointer && (
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

      {/* Desktop clicks and mobile taps */}
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
            drop-shadow-[0_0_10px_rgba(216,180,254,0.8)]
            animate-musical-cursor-launch
          "
          style={
            {
              left: item.x,
              top: item.y,
              "--symbol-drift-x": `${item.driftX}px`,
              "--symbol-rotation": `${item.rotation}deg`,
            } as React.CSSProperties
          }
        >
          {item.symbol}
        </span>
      ))}
    </>
  );
}