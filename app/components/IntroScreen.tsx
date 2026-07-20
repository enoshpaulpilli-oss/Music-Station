"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function IntroScreen() {
  const [show, setShow] = useState(true);
  const [ready, setReady] = useState(false);
  const [isTouchDevice] = useState(() =>
    typeof window !== "undefined"
      ? "ontouchstart" in window || navigator.maxTouchPoints > 0
      : false,
  );
  const [entering, setEntering] = useState(false);
  const mounted = typeof window !== "undefined";

  useEffect(() => {
    const readyTimer = window.setTimeout(() => {
      setReady(true);
    }, 2800);

    return () => window.clearTimeout(readyTimer);
  }, []);

  const handleEnter = useCallback(() => {
    if (!ready || entering) return;

    setEntering(true);

    window.setTimeout(() => {
      window.dispatchEvent(new Event("musicstation:intro-complete"));
      setShow(false);
    }, 750);
  }, [ready, entering]);

  useEffect(() => {
    if (!ready) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ready, handleEnter]);

  if (!mounted) {
    return <div className="fixed inset-0 z-[9999] bg-black" />;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            scale: entering ? 1.06 : 1,
            filter: entering ? "blur(4px)" : "blur(0px)",
          }}
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
          onClick={handleEnter}
          className={`
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-black
            ${ready ? "cursor-pointer" : ""}
          `}
        >
          <motion.div
          
            initial={{ opacity: 0 }}
            animate={{
              opacity: entering ? 0.4 : 1,
              scale: entering ? 1.15 : 1,
            }}
            transition={{
              duration: entering ? 0.7 : 1.2,
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.18),transparent_58%)]"
          />

          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0.05,
              scaleY: 0.4,
            }}
            animate={
              entering
                ? {
                    opacity: 0,
                    scaleX: 1.4,
                    scaleY: 1.4,
                  }
                : {
                    opacity: [0, 0.8, 0.45],
                    scaleX: [0.05, 0.35, 1],
                    scaleY: [0.4, 1, 1.15],
                  }
            }
            transition={{
              duration: entering ? 0.7 : 2.6,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute top-[-30%] h-[150%] w-[55%] origin-top bg-gradient-to-b from-purple-200/35 via-purple-500/10 to-transparent blur-3xl"
          />

          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0.2,
            }}
            animate={
              entering
                ? {
                    opacity: 0,
                    scaleX: 1.5,
                  }
                : {
                    opacity: [0, 0.5, 0.18],
                    scaleX: [0.2, 1.2, 1],
                  }
            }
            transition={{
              delay: entering ? 0 : 0.8,
              duration: entering ? 0.6 : 2,
              ease: "easeOut",
            }}
            className="absolute bottom-[13%] h-24 w-[70%] rounded-full bg-purple-500/25 blur-[55px]"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
            }}
            animate={{
              opacity: entering ? 0 : 1,
              scale: entering ? 1.05 : 1,
            }}
            transition={{
              delay: entering ? 0 : 0.5,
              duration: entering ? 0.4 : 1.3,
            }}
            className="absolute inset-5 rounded-[2rem] border border-purple-200/10 sm:inset-8"
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.94,
              filter: "blur(18px)",
            }}
            animate={{
              opacity: entering ? 0 : 1,
              y: entering ? -20 : 0,
              scale: entering ? 1.1 : 1,
              filter: entering ? "blur(10px)" : "blur(0px)",
            }}
            transition={{
              delay: entering ? 0 : 0.7,
              duration: entering ? 0.5 : 1.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 px-6 text-center"
          >
            <motion.p
              initial={{
                opacity: 0,
                letterSpacing: "0.1em",
              }}
              animate={{
                opacity: entering ? 0 : 0.65,
                letterSpacing: "0.45em",
              }}
              transition={{
                delay: entering ? 0 : 0.7,
                duration: entering ? 0.3 : 1.2,
              }}
              className="mb-5 text-[10px] uppercase text-purple-200 sm:text-xs"
            >
              Welcome to
            </motion.p>

            <motion.h1
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: entering ? 0 : 1,
                scale: entering ? 1.15 : 1,
              }}
              transition={{
                delay: entering ? 0 : 1,
                duration: entering ? 0.5 : 1,
              }}
              className="bg-gradient-to-b from-white via-purple-100 to-purple-400 bg-clip-text text-4xl font-black uppercase tracking-[0.14em] text-transparent sm:text-6xl md:text-7xl md:tracking-[0.25em]"
            >
              Music Station
            </motion.h1>

            <div className="relative mx-auto mt-6 h-px max-w-xl overflow-hidden bg-white/10">
              <motion.div
                initial={{ x: "-130%" }}
                animate={{ x: "130%" }}
                transition={{
                  delay: 1.3,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-purple-200 to-transparent"
              />
            </div>

            <motion.p
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: entering ? 0 : 0.75,
                y: entering ? -10 : 0,
              }}
              transition={{
                delay: entering ? 0 : 1.7,
                duration: entering ? 0.3 : 0.8,
              }}
              className="mt-6 text-xs uppercase tracking-[0.18em] text-neutral-300 sm:text-sm sm:tracking-[0.3em]"
            >
              Where Worship Meets Excellence
            </motion.p>

            <AnimatePresence>
              {ready && !entering && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="mt-12"
                >
                  <motion.p
                    animate={{
                      opacity: [0.35, 1, 0.35],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-[10px] uppercase tracking-[0.4em] text-purple-200/80 sm:text-xs"
                  >
                    {isTouchDevice
                      ? "Tap to Enter"
                      : "Press Space to Enter"}
                  </motion.p>

                  <motion.div
                    animate={{
                      scaleX: [0.4, 1, 0.4],
                      opacity: [0.2, 0.7, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-purple-300 to-transparent"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{
              delay: 0.15,
              duration: 1.8,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-y-0 left-0 z-20 w-1/2 bg-black"
          />

          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{
              delay: 0.15,
              duration: 1.8,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-y-0 right-0 z-20 w-1/2 bg-black"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{
              x: entering ? "0%" : "-100%",
            }}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="pointer-events-none absolute inset-y-0 left-0 z-50 w-1/2 bg-black"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{
              x: entering ? "0%" : "100%",
            }}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="pointer-events-none absolute inset-y-0 right-0 z-50 w-1/2 bg-black"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}