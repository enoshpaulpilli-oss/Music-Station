"use client";

import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
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
  borderRadius: number;
};

type TransitionStage =
  | "idle"
  | "dissolving"
  | "finishing";

type InstrumentTheme = {
  primary: string;
  secondary: string;
  glow: string;
  symbols: string[];
};

type MusicParticle = {
  id: number;
  symbol: string;
  left: number;
  size: number;
  driftX: number;
  driftY: number;
  rotation: number;
  delay: number;
  duration: number;
  opacity: number;
};

const THEMES: Record<
  InstrumentType,
  InstrumentTheme
> = {
  guitar: {
    primary: "rgba(216, 180, 254, 1)",
    secondary: "rgba(251, 191, 36, 0.9)",
    glow: "rgba(168, 85, 247, 0.75)",
    symbols: ["♪", "♫", "♩", "♬", "♯", "✦"],
  },

  piano: {
    primary: "rgba(255, 255, 255, 1)",
    secondary: "rgba(96, 165, 250, 0.95)",
    glow: "rgba(59, 130, 246, 0.7)",
    symbols: ["♩", "♫", "♬", "♭", "♪", "✧"],
  },

  vocal: {
    primary: "rgba(233, 213, 255, 1)",
    secondary: "rgba(244, 114, 182, 0.9)",
    glow: "rgba(192, 132, 252, 0.72)",
    symbols: ["𝄞", "♪", "♫", "♩", "✦", "✧"],
  },

  rhythm: {
    primary: "rgba(255, 255, 255, 1)",
    secondary: "rgba(129, 140, 248, 0.95)",
    glow: "rgba(99, 102, 241, 0.78)",
    symbols: ["♬", "♩", "♪", "♫", "✦", "✧"],
  },
};

function createParticles(
  instrument: InstrumentType,
  count: number
): MusicParticle[] {
  const symbols = THEMES[instrument].symbols;

  return Array.from({ length: count }, (_, index) => ({
    id: index,
    symbol: symbols[index % symbols.length],
    left: (index * 37.7) % 100,
    size: 9 + ((index * 11) % 18),
    driftX: ((index * 29) % 110) - 55,
    driftY: 45 + ((index * 17) % 90),
    rotation: ((index * 47) % 360) - 180,
    delay: (index % 18) * 0.032,
    duration: 0.55 + (index % 9) * 0.055,
    opacity: 0.55 + (index % 5) * 0.1,
  }));
}

export default function OrigamiTransitionLink({
  href,
  title,
  number,
  instrument,
  children,
}: OrigamiTransitionLinkProps) {
  const router = useRouter();

  const triggerRef =
    useRef<HTMLButtonElement | null>(null);

  const cardRef =
    useRef<HTMLElement | null>(null);

  const timeoutsRef =
    useRef<number[]>([]);

  const cardAnimationRef =
    useRef<Animation | null>(null);

  const activeCardRef =
    useRef<HTMLElement | null>(null);

  const stageRef =
    useRef<TransitionStage>("idle");

  const [mounted, setMounted] =
    useState(false);

  const [stage, setStageState] =
    useState<TransitionStage>("idle");

  const [cardPosition, setCardPosition] =
    useState<CardPosition | null>(null);

  const theme = THEMES[instrument];

  const particles = useMemo(
    () => createParticles(instrument, 90),
    [instrument]
  );

  const setStage = useCallback(
    (nextStage: TransitionStage) => {
      stageRef.current = nextStage;
      setStageState(nextStage);
    },
    []
  );

  const schedule = useCallback(
    (
      callback: () => void,
      delay: number
    ) => {
      const timeout =
        window.setTimeout(callback, delay);

      timeoutsRef.current.push(timeout);
    },
    []
  );

  const beginCardDissolve = useCallback(
    (
      card: HTMLElement,
      borderRadius: number
    ) => {
      const reducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      card.style.pointerEvents = "none";
      card.style.willChange =
        "clip-path, opacity, transform";

      if (reducedMotion) {
        cardAnimationRef.current =
          card.animate(
            [
              {
                opacity: 1,
                transform: "scale(1)",
              },
              {
                opacity: 0,
                transform: "scale(0.985)",
              },
            ],
            {
              duration: 450,
              easing: "ease-out",
              fill: "forwards",
            }
          );

        return;
      }

      cardAnimationRef.current =
        card.animate(
          [
            {
              clipPath: `inset(0% 0% 0% 0% round ${borderRadius}px)`,
              opacity: 1,
              transform:
                "translateY(0px) scale(1)",
            },

            {
              offset: 0.1,
              clipPath: `inset(3% 0% 0% 0% round ${borderRadius}px)`,
              opacity: 1,
              transform:
                "translateY(-2px) scale(1.003)",
            },

            {
              offset: 0.45,
              clipPath: `inset(42% 0% 0% 0% round ${borderRadius}px)`,
              opacity: 0.98,
              transform:
                "translateY(-4px) scale(0.998)",
            },

            {
              offset: 0.8,
              clipPath: `inset(83% 0% 0% 0% round ${borderRadius}px)`,
              opacity: 0.82,
              transform:
                "translateY(-6px) scale(0.992)",
            },

            {
              clipPath: `inset(100% 0% 0% 0% round ${borderRadius}px)`,
              opacity: 0,
              transform:
                "translateY(-8px) scale(0.985)",
            },
          ],
          {
            duration: 1380,
            easing:
              "cubic-bezier(0.65, 0, 0.35, 1)",
            fill: "forwards",
          }
        );
    },
    []
  );

  const startTransition = useCallback(
    (card: HTMLElement) => {
      if (
        !href ||
        stageRef.current !== "idle"
      ) {
        return;
      }

      const bounds =
        card.getBoundingClientRect();

      const computedStyles =
        window.getComputedStyle(card);

      const borderRadius =
        Number.parseFloat(
          computedStyles.borderTopLeftRadius
        ) || 32;

      activeCardRef.current = card;

      setCardPosition({
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        borderRadius,
      });

      setStage("dissolving");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          beginCardDissolve(
            card,
            borderRadius
          );
        });
      });

      schedule(() => {
        setStage("finishing");
      }, 1400);

      schedule(() => {
        router.push(href);
      }, 1740);
    },
    [
      beginCardDissolve,
      href,
      router,
      schedule,
      setStage,
    ]
  );

  useEffect(() => {
    setMounted(true);

    if (href) {
      router.prefetch(href);
    }

    const trigger = triggerRef.current;

    const card =
      trigger?.closest(
        "[data-studio-card]"
      ) as HTMLElement | null;

    if (card) {
      cardRef.current = card;
      card.style.cursor = "pointer";

      const handleCardClick = (
        event: globalThis.MouseEvent
      ) => {
        const target =
          event.target as HTMLElement | null;

        const interactiveElement =
          target?.closest(
            "a, button, input, textarea, select"
          );

        /*
         * Allow this Explore button to activate the
         * card transition, but ignore any other
         * interactive controls inside the card.
         */
        if (
          interactiveElement &&
          interactiveElement !==
            triggerRef.current
        ) {
          return;
        }

        event.preventDefault();
        startTransition(card);
      };

      card.addEventListener(
        "click",
        handleCardClick
      );

      return () => {
        card.removeEventListener(
          "click",
          handleCardClick
        );

        card.style.removeProperty("cursor");
      };
    }
  }, [href, router, startTransition]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(
        (timeout) => {
          window.clearTimeout(timeout);
        }
      );

      cardAnimationRef.current?.cancel();

      const card = activeCardRef.current;

      if (card) {
        card.style.removeProperty("opacity");
        card.style.removeProperty(
          "pointer-events"
        );
        card.style.removeProperty(
          "will-change"
        );
        card.style.removeProperty(
          "transform"
        );
        card.style.removeProperty(
          "clip-path"
        );
      }
    };
  }, []);

  const handleExploreClick = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    /*
     * The native card click listener performs the
     * transition. This prevents form submission if
     * the component is ever placed inside a form.
     */
    event.preventDefault();
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
            "
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  stage === "finishing"
                    ? 0.82
                    : 0.18,
              }}
              transition={{
                duration:
                  stage === "finishing"
                    ? 0.28
                    : 0.3,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-black"
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity:
                  stage === "finishing"
                    ? 0
                    : 0.24,
                scale:
                  stage === "finishing"
                    ? 1.12
                    : 1,
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="absolute blur-[65px]"
              style={{
                left:
                  cardPosition.left -
                  cardPosition.width * 0.1,
                top:
                  cardPosition.top -
                  cardPosition.height * 0.1,
                width:
                  cardPosition.width * 1.2,
                height:
                  cardPosition.height * 1.2,
                borderRadius:
                  cardPosition.borderRadius,
                background: theme.glow,
              }}
            />

            <div
              className="absolute"
              style={{
                left: cardPosition.left,
                top: cardPosition.top,
                width: cardPosition.width,
                height: cardPosition.height,
              }}
            >
              {particles.map((particle) => (
                <motion.span
                  key={particle.id}
                  initial={{
                    top: -8,
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.25,
                    rotate: 0,
                  }}
                  animate={{
                    top:
                      cardPosition.height - 8,

                    x: [
                      0,
                      particle.driftX * 0.25,
                      particle.driftX,
                    ],

                    y: [
                      0,
                      -particle.driftY * 0.25,
                      -particle.driftY,
                    ],

                    opacity:
                      stage === "finishing"
                        ? 0
                        : [
                            0,
                            particle.opacity,
                            particle.opacity *
                              0.75,
                            0,
                          ],

                    scale: [
                      0.25,
                      1.1,
                      0.85,
                      0.35,
                    ],

                    rotate: [
                      0,
                      particle.rotation * 0.3,
                      particle.rotation,
                    ],
                  }}
                  transition={{
                    top: {
                      duration: 1.38,
                      delay:
                        particle.delay * 0.28,
                      ease: [
                        0.65,
                        0,
                        0.35,
                        1,
                      ],
                    },

                    x: {
                      duration:
                        particle.duration,
                      delay:
                        0.55 +
                        particle.delay,
                      ease: "easeOut",
                    },

                    y: {
                      duration:
                        particle.duration,
                      delay:
                        0.55 +
                        particle.delay,
                      ease: "easeOut",
                    },

                    opacity: {
                      duration:
                        particle.duration,
                      delay:
                        0.55 +
                        particle.delay,
                      times: [
                        0,
                        0.16,
                        0.72,
                        1,
                      ],
                    },

                    scale: {
                      duration:
                        particle.duration,
                      delay:
                        0.55 +
                        particle.delay,
                      times: [
                        0,
                        0.18,
                        0.72,
                        1,
                      ],
                    },

                    rotate: {
                      duration:
                        particle.duration,
                      delay:
                        0.55 +
                        particle.delay,
                      ease: "easeOut",
                    },
                  }}
                  className="
                    absolute
                    z-40
                    select-none
                    font-serif
                    leading-none
                    text-white
                  "
                  style={{
                    left: `${particle.left}%`,
                    fontSize: `${particle.size}px`,
                    textShadow: `
                      0 0 5px ${theme.primary},
                      0 0 12px ${theme.glow},
                      0 0 20px ${theme.glow}
                    `,
                  }}
                >
                  {particle.symbol}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity:
                  stage === "finishing"
                    ? [0, 0.38, 0]
                    : 0,
                scale:
                  stage === "finishing"
                    ? [0.7, 1.3, 1.65]
                    : 0.7,
              }}
              transition={{
                duration: 0.32,
                ease: "easeOut",
              }}
              className="
                absolute
                left-1/2
                top-1/2
                h-52
                w-52
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                blur-[70px]
              "
              style={{
                background: theme.glow,
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  stage === "finishing"
                    ? [0, 0.16, 0]
                    : 0,
              }}
              transition={{
                duration: 0.24,
                ease: "easeOut",
              }}
              className="absolute inset-0 bg-white"
            />

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity:
                  stage === "finishing"
                    ? [0, 0.7, 0]
                    : 0,
                y:
                  stage === "finishing"
                    ? [8, 0, -4]
                    : 8,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-white/70">
                {number} · {title}
              </p>
            </motion.div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={() => {
          if (href) {
            router.prefetch(href);
          }
        }}
        onClick={handleExploreClick}
        disabled={stage !== "idle"}
        aria-label={`Explore ${title}`}
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