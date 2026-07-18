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

type InstrumentType =
  | "guitar"
  | "piano"
  | "vocal"
  | "rhythm";

type OrigamiTransitionLinkProps = {
  href: string;
  title: string;
  number: string;
  instrument: InstrumentType;
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
  | "instrument"
  | "fly"
  | "turn"
  | "expand";

type InstrumentIconProps = {
  instrument: InstrumentType;
};

function InstrumentIcon({
  instrument,
}: InstrumentIconProps) {
  if (instrument === "guitar") {
    return (
      <svg
        viewBox="0 0 120 180"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="46"
          cy="122"
          rx="31"
          ry="40"
          fill="rgba(168,85,247,0.15)"
          stroke="currentColor"
          strokeWidth="4"
        />

        <ellipse
          cx="62"
          cy="102"
          rx="23"
          ry="29"
          fill="rgba(96,165,250,0.08)"
          stroke="currentColor"
          strokeWidth="4"
        />

        <circle
          cx="53"
          cy="114"
          r="8"
          stroke="currentColor"
          strokeWidth="3"
        />

        <path
          d="M67 82L95 22"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />

        <path
          d="M91 25L108 12"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <path
          d="M73 70L101 83"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M40 146L69 128"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (instrument === "piano") {
    return (
      <svg
        viewBox="0 0 180 100"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="8"
          y="15"
          width="164"
          height="70"
          rx="10"
          fill="rgba(168,85,247,0.12)"
          stroke="currentColor"
          strokeWidth="4"
        />

        {[28, 51, 74, 97, 120, 143].map(
          (x) => (
            <path
              key={x}
              d={`M${x} 16V84`}
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.7"
            />
          )
        )}

        {[39, 62, 108, 131].map((x) => (
          <rect
            key={x}
            x={x}
            y="15"
            width="13"
            height="39"
            rx="3"
            fill="currentColor"
            opacity="0.8"
          />
        ))}
      </svg>
    );
  }

  if (instrument === "vocal") {
    return (
      <svg
        viewBox="0 0 110 180"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="31"
          y="14"
          width="48"
          height="83"
          rx="24"
          fill="rgba(168,85,247,0.14)"
          stroke="currentColor"
          strokeWidth="5"
        />

        <path
          d="M20 75C20 105 35 121 55 121C75 121 90 105 90 75"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <path
          d="M55 121V156"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M32 159H78"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />

        <path
          d="M41 38H69M41 55H69M41 72H69"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 170 150"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="85"
        cy="92"
        rx="65"
        ry="41"
        fill="rgba(168,85,247,0.13)"
        stroke="currentColor"
        strokeWidth="5"
      />

      <ellipse
        cx="85"
        cy="75"
        rx="65"
        ry="29"
        fill="rgba(96,165,250,0.08)"
        stroke="currentColor"
        strokeWidth="5"
      />

      <path
        d="M21 75V102M149 75V102"
        stroke="currentColor"
        strokeWidth="5"
      />

      <path
        d="M35 23L86 70"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M136 21L87 69"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <circle
        cx="32"
        cy="20"
        r="6"
        fill="currentColor"
      />

      <circle
        cx="139"
        cy="18"
        r="6"
        fill="currentColor"
      />
    </svg>
  );
}

export default function OrigamiTransitionLink({
  href,
  title,
  number,
  instrument,
  children,
}: OrigamiTransitionLinkProps) {
  const router = useRouter();

  const timeoutsRef = useRef<number[]>([]);
  const hiddenCardRef =
    useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);

  const [stage, setStage] =
    useState<TransitionStage>("idle");

  const [cardPosition, setCardPosition] =
    useState<CardPosition | null>(null);

  useEffect(() => {
    setMounted(true);
    if (href) {
  router.prefetch(href);
}
    return () => {
      timeoutsRef.current.forEach((timeout) => {
        window.clearTimeout(timeout);
      });

      if (hiddenCardRef.current) {
        hiddenCardRef.current.style.opacity = "1";
      }
    };
  }, [href, router]);

  const schedule = (
    callback: () => void,
    delay: number
  ) => {
    const timeout = window.setTimeout(
      callback,
      delay
    );

    timeoutsRef.current.push(timeout);
  };

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (stage !== "idle") {
      return;
    }

    const card =
      event.currentTarget.closest(
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
    }, 250);

    schedule(() => {
      setStage("instrument");
    }, 600);

    schedule(() => {
      setStage("fly");
    }, 930);

    schedule(() => {
      setStage("turn");
    }, 1280);

    schedule(() => {
      setStage("expand");
    }, 1610);

    schedule(() => {
      router.push(href);
    }, 2030);
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
            {/* Background darkening */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  stage === "expand"
                    ? 0.97
                    : stage === "turn"
                      ? 0.5
                      : stage === "fly"
                        ? 0.26
                        : 0.1,
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-black"
            />

            {/* Calm purple atmosphere */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity:
                  stage === "expand"
                    ? 0.24
                    : stage === "turn"
                      ? 0.13
                      : 0,
                scale:
                  stage === "expand"
                    ? 1.55
                    : 0.9,
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                left-1/2
                top-1/2
                h-[500px]
                w-[500px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-purple-600/20
                blur-[145px]
              "
            />

            {/* Card / instrument transition object */}

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
                          cardPosition.width * 0.28,
                        top:
                          cardPosition.top +
                          cardPosition.height * 0.27,
                        width:
                          cardPosition.width * 0.44,
                        height:
                          cardPosition.height * 0.46,
                        rotateX: 9,
                        rotateY: -14,
                        rotateZ: 7,
                        scale: 0.92,
                        borderRadius: 12,
                      }
                    : stage === "instrument"
                      ? {
                          left:
                            cardPosition.left +
                            cardPosition.width / 2 -
                            65,
                          top:
                            cardPosition.top +
                            cardPosition.height / 2 -
                            80,
                          width: 130,
                          height: 160,
                          rotateX: 0,
                          rotateY: 0,
                          rotateZ: -3,
                          scale: 1,
                          borderRadius: 26,
                        }
                      : stage === "fly"
                        ? {
                            left:
                              window.innerWidth -
                              Math.min(
                                145,
                                window.innerWidth *
                                  0.11
                              ),
                            top:
                              window.innerHeight *
                              0.34,
                            width: 78,
                            height: 105,
                            rotateX: 14,
                            rotateY: -46,
                            rotateZ: 17,
                            scale: 0.75,
                            borderRadius: 20,
                          }
                        : stage === "turn"
                          ? {
                              left:
                                window.innerWidth /
                                  2 -
                                70,
                              top:
                                window.innerHeight /
                                  2 -
                                85,
                              width: 140,
                              height: 170,
                              rotateX: 0,
                              rotateY: 0,
                              rotateZ: 0,
                              scale: 1,
                              borderRadius: 28,
                            }
                          : {
                              left: 0,
                              top: 0,
                              width:
                                window.innerWidth,
                              height:
                                window.innerHeight,
                              rotateX: 0,
                              rotateY: 0,
                              rotateZ: 0,
                              scale: 1,
                              borderRadius: 0,
                            }
              }
              transition={{
                duration:
                  stage === "expand"
                    ? 0.58
                    : 0.4,
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
                shadow-[0_25px_90px_rgba(88,28,135,0.3)]
                [transform-style:preserve-3d]
              "
            >
              {/* Original card details */}

              <motion.div
                animate={{
                  opacity:
                    stage === "lift" ? 1 : 0,
                  scale:
                    stage === "lift"
                      ? 1
                      : 0.9,
                }}
                transition={{ duration: 0.2 }}
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

              {/* Fold panels */}

              <motion.div
                initial={{
                  opacity: 0,
                  rotateY: 0,
                }}
                animate={{
                  opacity:
                    stage === "fold"
                      ? 0.65
                      : 0,
                  rotateY:
                    stage === "fold"
                      ? -28
                      : 0,
                }}
                transition={{ duration: 0.35 }}
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

              <motion.div
                initial={{
                  opacity: 0,
                  rotateX: 0,
                }}
                animate={{
                  opacity:
                    stage === "fold"
                      ? 0.55
                      : 0,
                  rotateX:
                    stage === "fold"
                      ? 32
                      : 0,
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

              {/* Instrument silhouette */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.6,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity:
                    stage === "instrument" ||
                    stage === "fly" ||
                    stage === "turn"
                      ? 1
                      : 0,
                  scale:
                    stage === "instrument"
                      ? [0.6, 1.08, 1]
                      : 1,
                  filter:
                    stage === "instrument" ||
                    stage === "fly" ||
                    stage === "turn"
                      ? "blur(0px)"
                      : "blur(8px)",
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  inset-3
                  flex
                  items-center
                  justify-center
                  text-purple-200
                  drop-shadow-[0_0_14px_rgba(216,180,254,0.7)]
                "
              >
                <InstrumentIcon
                  instrument={instrument}
                />
              </motion.div>

              {/* Final fullscreen face */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity:
                    stage === "expand" ? 1 : 0,
                  scale:
                    stage === "expand"
                      ? 1
                      : 0.95,
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