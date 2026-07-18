"use client";

import {
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type OrigamiTransitionLinkProps = {
  href: string;
  title: string;
  number: string;
  children: ReactNode;
};

type CardPosition = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type TransitionStage =
  | "idle"
  | "lift"
  | "fold"
  | "fly"
  | "turn"
  | "expand";

export default function OrigamiTransitionLink({
  href,
  title,
  number,
  children,
}: OrigamiTransitionLinkProps) {
  const router = useRouter();

  const timeoutsRef = useRef<number[]>([]);
  const hiddenCardRef = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<TransitionStage>("idle");
  const [cardPosition, setCardPosition] =
    useState<CardPosition | null>(null);

  useEffect(() => {
    setMounted(true);
    router.prefetch(href);

    return () => {
      timeoutsRef.current.forEach((timeout) => {
        window.clearTimeout(timeout);
      });

      if (hiddenCardRef.current) {
        hiddenCardRef.current.style.opacity = "1";
      }
    };
  }, [href, router]);

  const schedule = (callback: () => void, delay: number) => {
    const timeout = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
  };

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (stage !== "idle") {
      return;
    }

    const card = event.currentTarget.closest(
      "[data-studio-card]"
    ) as HTMLElement | null;

    if (!card) {
      router.push(href);
      return;
    }

    const bounds = card.getBoundingClientRect();

    hiddenCardRef.current = card;

    setCardPosition({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    });

    schedule(() => {
      card.style.opacity = "0";
    }, 40);

    setStage("lift");

    schedule(() => {
      setStage("fold");
    }, 260);

    schedule(() => {
      setStage("fly");
    }, 650);

    schedule(() => {
      setStage("turn");
    }, 1030);

    schedule(() => {
      setStage("expand");
    }, 1380);

    schedule(() => {
      router.push(href);
    }, 1830);
  };

  const overlay =
    mounted &&
    cardPosition &&
    stage !== "idle"
      ? createPortal(
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              fixed
              inset-0
              z-[200000]
              overflow-hidden
              [perspective:1600px]
            "
          >
            {/* Gentle darkening */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  stage === "expand"
                    ? 0.96
                    : stage === "turn"
                      ? 0.48
                      : 0.1,
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-black"
            />

            {/* Small atmospheric glow */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.6,
              }}
              animate={{
                opacity:
                  stage === "expand"
                    ? 0.22
                    : stage === "turn"
                      ? 0.12
                      : 0,
                scale:
                  stage === "expand"
                    ? 1.4
                    : 0.8,
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                left-1/2
                top-1/2
                h-[480px]
                w-[480px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-purple-600/20
                blur-[140px]
              "
            />

            {/* Origami copy */}
            <motion.div
              initial={{
                left: cardPosition.left,
                top: cardPosition.top,
                width: cardPosition.width,
                height: cardPosition.height,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                borderRadius: 32,
              }}
              animate={
                stage === "lift"
                  ? {
                      left: cardPosition.left,
                      top: cardPosition.top - 14,
                      width: cardPosition.width,
                      height: cardPosition.height,
                      rotateX: -2,
                      rotateY: 3,
                      rotateZ: -0.5,
                      scale: 1.015,
                      borderRadius: 32,
                    }
                  : stage === "fold"
                    ? {
                        left:
                          cardPosition.left +
                          cardPosition.width * 0.27,
                        top:
                          cardPosition.top +
                          cardPosition.height * 0.27,
                        width: cardPosition.width * 0.46,
                        height:
                          cardPosition.height * 0.46,
                        rotateX: 10,
                        rotateY: -15,
                        rotateZ: 7,
                        scale: 0.94,
                        borderRadius: 10,
                      }
                    : stage === "fly"
                      ? {
                          left:
                            window.innerWidth -
                            Math.min(
                              140,
                              window.innerWidth * 0.1
                            ),
                          top:
                            window.innerHeight * 0.36,
                          width: 70,
                          height: 96,
                          rotateX: 18,
                          rotateY: -48,
                          rotateZ: 18,
                          scale: 0.72,
                          borderRadius: 7,
                        }
                      : stage === "turn"
                        ? {
                            left:
                              window.innerWidth / 2 -
                              55,
                            top:
                              window.innerHeight / 2 -
                              76,
                            width: 110,
                            height: 152,
                            rotateX: 0,
                            rotateY: 0,
                            rotateZ: -1,
                            scale: 1,
                            borderRadius: 10,
                          }
                        : {
                            left: 0,
                            top: 0,
                            width: window.innerWidth,
                            height: window.innerHeight,
                            rotateX: 0,
                            rotateY: 0,
                            rotateZ: 0,
                            scale: 1,
                            borderRadius: 0,
                          }
              }
              transition={{
                duration:
                  stage === "expand" ? 0.55 : 0.42,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="
                fixed
                overflow-hidden
                border
                border-purple-200/15
                bg-gradient-to-br
                from-[#120a1c]
                via-black
                to-[#07101c]
                shadow-[0_25px_90px_rgba(88,28,135,0.32)]
                [transform-style:preserve-3d]
              "
            >
              {/* Original card details */}
              <motion.div
                animate={{
                  opacity:
                    stage === "lift" ? 1 : 0,
                  scale:
                    stage === "lift" ? 1 : 0.9,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="absolute inset-0 p-8"
              >
                <p className="text-xs tracking-[0.35em] text-purple-300/50">
                  {number}
                </p>

                <div className="mt-8 h-px w-14 bg-gradient-to-r from-purple-300/70 to-transparent" />

                <p className="mt-8 text-2xl font-semibold text-white">
                  {title}
                </p>
              </motion.div>

              {/* Subtle left fold */}
              <motion.div
                initial={{
                  opacity: 0,
                  rotateY: 0,
                }}
                animate={{
                  opacity:
                    stage === "fold" ? 0.65 : 0,
                  rotateY:
                    stage === "fold" ? -28 : 0,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="
                  absolute
                  inset-0
                  origin-left
                  border-r
                  border-purple-100/20
                  bg-purple-500/[0.06]
                  [clip-path:polygon(0_0,50%_0,50%_100%,0_100%)]
                "
              />

              {/* Subtle top fold */}
              <motion.div
                initial={{
                  opacity: 0,
                  rotateX: 0,
                }}
                animate={{
                  opacity:
                    stage === "fold" ? 0.55 : 0,
                  rotateX:
                    stage === "fold" ? 32 : 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.04,
                }}
                className="
                  absolute
                  inset-0
                  origin-top
                  border-b
                  border-white/15
                  bg-blue-400/[0.045]
                  [clip-path:polygon(0_0,100%_0,100%_50%,0_50%)]
                "
              />

              {/* Diagonal fold */}
              <motion.div
                initial={{
                  opacity: 0,
                  rotateZ: 0,
                }}
                animate={{
                  opacity:
                    stage === "fold" ||
                    stage === "fly"
                      ? 0.55
                      : 0,
                  rotateZ:
                    stage === "fold" ? -8 : 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.05,
                }}
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-purple-300/15
                  via-transparent
                  to-blue-300/10
                  [clip-path:polygon(0_0,100%_50%,0_100%)]
                "
              />

              {/* Final transition face */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity:
                    stage === "expand" ? 1 : 0,
                  scale:
                    stage === "expand" ? 1 : 0.94,
                  filter:
                    stage === "expand"
                      ? "blur(0px)"
                      : "blur(8px)",
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.08,
                }}
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                "
              >
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.45em] text-purple-300/55">
                    Entering
                  </p>

                  <p className="mt-5 bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-4xl font-black text-transparent sm:text-6xl">
                    {title}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onMouseEnter={() => {
          router.prefetch(href);
        }}
        onClick={handleClick}
        disabled={stage !== "idle"}
        className="
          relative
          flex
          items-center
          gap-3
          text-sm
          font-medium
          text-purple-300
          transition-all
          duration-300
          group-hover:gap-5
          group-hover:text-white
          disabled:pointer-events-none
        "
      >
        {children}
      </button>

      {overlay}
    </>
  );
}