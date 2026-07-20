"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const particles = [
  { left: "8%", top: "18%", size: 3, delay: 0.2, duration: 7 },
  { left: "17%", top: "72%", size: 4, delay: 1.1, duration: 9 },
  { left: "28%", top: "31%", size: 3, delay: 0.6, duration: 8 },
  { left: "39%", top: "81%", size: 3, delay: 1.7, duration: 10 },
  { left: "54%", top: "19%", size: 4, delay: 0.9, duration: 8 },
  { left: "66%", top: "67%", size: 3, delay: 1.4, duration: 9 },
  { left: "78%", top: "28%", size: 3, delay: 0.4, duration: 7 },
  { left: "89%", top: "74%", size: 4, delay: 1.9, duration: 10 },
  { left: "11%", top: "45%", size: 2, delay: 1.3, duration: 8 },
  { left: "48%", top: "58%", size: 2, delay: 0.8, duration: 9 },
  { left: "72%", top: "84%", size: 2, delay: 1.6, duration: 8 },
  { left: "94%", top: "38%", size: 3, delay: 0.5, duration: 10 },
];

export default function Hero() {
  const [introComplete, setIntroComplete] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 45,
    damping: 25,
    mass: 0.8,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 45,
    damping: 25,
    mass: 0.8,
  });

  useEffect(() => {
    const handleIntroComplete = () => {
      setIntroComplete(true);
    };

    window.addEventListener(
      "musicstation:intro-complete",
      handleIntroComplete
    );

    return () => {
      window.removeEventListener(
        "musicstation:intro-complete",
        handleIntroComplete
      );
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = section.getBoundingClientRect();

      const relativeX =
        (event.clientX - bounds.left) / bounds.width - 0.5;

      const relativeY =
        (event.clientY - bounds.top) / bounds.height - 0.5;

      mouseX.set(relativeX * 35);
      mouseY.set(relativeY * 25);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  const scrollToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      className="
        relative
        isolate
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        overflow-hidden
        px-6
        pb-24
        pt-28
        text-center
      "
    >
      {/* Deep background */}
      <div className="pointer-events-none absolute inset-0 -z-40 bg-black" />

      {/* Subtle grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 0.18 : 0 }}
        transition={{ duration: 2 }}
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]
          bg-[size:54px_54px]
          [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]
        "
      />

      {/* Main moving purple light */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={
          introComplete
            ? {
                opacity: 1,
                scale: [1, 1.08, 1],
              }
            : {
                opacity: 0,
                scale: 0.8,
              }
        }
        transition={{
          opacity: {
            duration: 1.8,
          },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-20
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-600/20
          blur-[150px]
          sm:h-[650px]
          sm:w-[650px]
          md:h-[720px]
          md:w-[720px]
          md:blur-[180px]
        "
      />

      {/* Secondary blue light */}
      <motion.div
        initial={{
          opacity: 0,
          x: 80,
          y: -30,
        }}
        animate={
          introComplete
            ? {
                opacity: 0.55,
                x: [80, -30, 80],
                y: [-30, 40, -30],
              }
            : {
                opacity: 0,
              }
        }
        transition={{
          opacity: {
            duration: 2,
          },
          x: {
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          pointer-events-none
          absolute
          right-[2%]
          top-[18%]
          -z-20
          h-[280px]
          w-[280px]
          rounded-full
          bg-blue-500/15
          blur-[120px]
          md:right-[10%]
          md:h-[380px]
          md:w-[380px]
          md:blur-[140px]
        "
      />

      {/* Soft violet floor glow */}
      <motion.div
        initial={{
          opacity: 0,
          scaleX: 0.5,
        }}
        animate={
          introComplete
            ? {
                opacity: [0.12, 0.3, 0.12],
                scaleX: [0.8, 1.1, 0.8],
              }
            : {
                opacity: 0,
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          bottom-[12%]
          -z-10
          h-32
          w-[80%]
          rounded-full
          bg-purple-500/20
          blur-[70px]
          md:w-[70%]
        "
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {particles.map((particle, index) => (
          <motion.span
            key={`${particle.left}-${particle.top}`}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={
              introComplete
                ? {
                    opacity: [0, 0.8, 0],
                    y: [20, -35, -80],
                    x: [0, index % 2 === 0 ? 14 : -14, 0],
                    scale: [0.7, 1.2, 0.8],
                  }
                : {
                    opacity: 0,
                  }
            }
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              rounded-full
              bg-purple-100
              shadow-[0_0_18px_rgba(216,180,254,1)]
            "
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      {/* Small casual badge */}
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
          filter: "blur(8px)",
        }}
        animate={
          introComplete
            ? {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }
            : {
                opacity: 0,
                y: 15,
                filter: "blur(8px)",
              }
        }
        transition={{
          duration: 0.8,
          delay: 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-20
          mb-6
          rounded-full
          border
          border-white/10
          bg-white/[0.045]
          px-4
          py-2
          text-xs
          text-neutral-400
          shadow-[0_12px_50px_rgba(0,0,0,0.3)]
          backdrop-blur-xl
        "
      >
        made for musicians who just wanna make stuff
      </motion.div>

      {/* Main title */}
      <motion.div
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.97,
          filter: "blur(12px)",
        }}
        animate={
          introComplete
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }
            : {
                opacity: 0,
                y: 35,
                scale: 0.97,
                filter: "blur(12px)",
              }
        }
        transition={{
          duration: 1.15,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-20"
      >
        <motion.h1
          animate={
            introComplete
              ? {
                  backgroundPosition: [
                    "0% 50%",
                    "100% 50%",
                    "0% 50%",
                  ],
                }
              : undefined
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            bg-gradient-to-r
            from-white
            via-purple-300
            to-blue-400
            bg-[length:200%_200%]
            bg-clip-text
            text-5xl
            font-extrabold
            tracking-[-0.05em]
            text-transparent
            sm:text-6xl
            md:text-8xl
          "
        >
          Music Space
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            x: -8,
          }}
          animate={{
            opacity: introComplete ? 1 : 0,
            x: introComplete ? 0 : -8,
          }}
          transition={{
            delay: 0.65,
            duration: 0.8,
          }}
          className="
            mt-3
            text-[11px]
            font-medium
            tracking-[0.2em]
            text-neutral-500
            sm:text-xs
          "
        >
          by Enosh Paul
        </motion.p>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{
          opacity: 0,
          y: 25,
          filter: "blur(8px)",
        }}
        animate={
          introComplete
            ? {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }
            : {
                opacity: 0,
                y: 25,
                filter: "blur(8px)",
              }
        }
        transition={{
          duration: 1,
          delay: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-20
          mt-9
          max-w-2xl
          text-base
          leading-8
          text-neutral-400
          sm:text-lg
          md:text-xl
        "
      >
        All the little music tools I kept wishing were in one place.
        Chords, practice stuff, ear training and a space to mess around
        with ideas.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={
          introComplete
            ? {
                opacity: 1,
                y: 0,
              }
            : {
                opacity: 0,
                y: 25,
              }
        }
        transition={{
          duration: 0.9,
          delay: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-20
          mt-11
          flex
          w-full
          max-w-md
          flex-col
          gap-4
          sm:w-auto
          sm:max-w-none
          sm:flex-row
        "
      >
        <Link
          href="/login"
          className="
            group
            relative
            inline-flex
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-purple-600
            px-8
            py-4
            font-semibold
            text-white
            transition-all
            duration-300
            hover:-translate-y-1.5
            hover:scale-[1.03]
            hover:bg-purple-500
            hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]
            active:translate-y-0
            active:scale-95
          "
        >
          <span
            className="
              absolute
              inset-0
              -translate-x-full
              bg-gradient-to-r
              from-transparent
              via-white/20
              to-transparent
              transition-transform
              duration-700
              group-hover:translate-x-full
            "
          />

          <span className="relative">Join Music Space</span>
        </Link>

        <button
          type="button"
          onClick={scrollToFeatures}
          className="
            group
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/5
            px-8
            py-4
            font-semibold
            text-neutral-200
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1.5
            hover:scale-[1.03]
            hover:border-white/25
            hover:bg-white/10
            hover:text-white
            hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)]
            active:translate-y-0
            active:scale-95
          "
        >
          <span>Take a look</span>

          <motion.span
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              text-purple-300
              transition-transform
              duration-300
              group-hover:translate-y-1
            "
          >
            ↓
          </motion.span>
        </button>
      </motion.div>

      {/* Tiny bottom hint */}
      <motion.button
        type="button"
        onClick={scrollToFeatures}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: introComplete ? 1 : 0,
        }}
        transition={{
          delay: 1.4,
          duration: 1,
        }}
        className="
          absolute
          bottom-7
          left-1/2
          z-20
          hidden
          -translate-x-1/2
          flex-col
          items-center
          md:flex
        "
        aria-label="Scroll to features"
      >
        <motion.span
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            text-[9px]
            uppercase
            tracking-[0.4em]
            text-neutral-600
          "
        >
          have a look around
        </motion.span>

        <motion.span
          animate={{
            y: [0, 7, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            mt-3
            h-8
            w-px
            bg-gradient-to-b
            from-purple-300/70
            to-transparent
          "
        />
      </motion.button>
    </section>
  );
}