"use client";

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

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
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
          h-[720px]
          w-[720px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-600/20
          blur-[180px]
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
          right-[10%]
          top-[18%]
          -z-20
          h-[380px]
          w-[380px]
          rounded-full
          bg-blue-500/15
          blur-[140px]
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
          w-[70%]
          rounded-full
          bg-purple-500/20
          blur-[70px]
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
            text-6xl
            font-extrabold
            tracking-tight
            text-transparent
            md:text-8xl
          "
        >
          Music Station
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: introComplete ? 1 : 0,
          }}
          transition={{
            delay: 0.65,
            duration: 0.8,
          }}
          className="mt-3 text-xs uppercase tracking-[0.45em] text-neutral-500"
        >
          — Enosh Paul
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
          mt-10
          max-w-2xl
          text-lg
          leading-8
          text-neutral-400
          md:text-xl
        "
      >
        A worship-centred platform where musicians learn, practise, create,
        collaborate and serve together.
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
        className="relative z-20 mt-12 flex flex-col gap-4 sm:flex-row"
      >
        <button
          className="
            rounded-full
            bg-purple-600
            px-8
            py-4
            font-semibold
            transition-all
            duration-300
            hover:-translate-y-2
            hover:scale-105
            hover:bg-purple-500
            hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]
            active:scale-95
          "
        >
          Enter Worship Studio
        </button>

        <button
          className="
            rounded-full
            border
            border-white/10
            bg-white/5
            px-8
            py-4
            font-semibold
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-2
            hover:scale-105
            hover:border-white/30
            hover:bg-white/10
            hover:shadow-[0_20px_50px_rgba(255,255,255,0.15)]
            active:scale-95
          "
        >
          Explore Features
        </button>
      </motion.div>

      {/* Bottom scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: introComplete ? 1 : 0,
        }}
        transition={{
          delay: 1.4,
          duration: 1,
        }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.p
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-[10px] uppercase tracking-[0.45em] text-neutral-600"
        >
          Scroll to Explore
        </motion.p>

        <motion.div
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
            mx-auto
            mt-3
            h-8
            w-px
            bg-gradient-to-b
            from-purple-300/70
            to-transparent
          "
        />
      </motion.div>
    </section>
  );
}