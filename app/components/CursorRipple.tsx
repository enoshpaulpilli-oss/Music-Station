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

  const mousePosition = useRef({
    x: -100,
    y: -100,
  });

  const [symbolIndex, setSymbolIndex] = useState(0);
  const [flyingSymbols, setFlyingSymbols] = useState<FlyingSymbol[]>([]);

  const currentSymbol = symbols[symbolIndex];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

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
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const launchedSymbol = symbols[symbolIndex];

      const newFlyingSymbol: FlyingSymbol = {
        id: Date.now() + Math.random(),
        symbol: launchedSymbol,
        x: event.clientX,
        y: event.clientY,
        driftX: Math.random() * 60 - 30,
        rotation: Math.random() * 70 - 35,
      };

      setFlyingSymbols((previousSymbols) => [
        ...previousSymbols,
        newFlyingSymbol,
      ]);

      setSymbolIndex((previousIndex) => {
        return (previousIndex + 1) % symbols.length;
      });

      window.setTimeout(() => {
        setFlyingSymbols((previousSymbols) =>
          previousSymbols.filter(
            (symbol) => symbol.id !== newFlyingSymbol.id
          )
        );
      }, 1300);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [symbolIndex]);

  return (
    <>
      {/* Musical symbol cursor */}

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

      {/* Symbols launched by clicks */}

      {flyingSymbols.map((item) => (
        <span
          key={item.id}
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            z-[99998]
            text-2xl
            text-purple-200
            drop-shadow-[0_0_10px_rgba(216,180,254,0.85)]
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