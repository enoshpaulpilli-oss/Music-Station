"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [introComplete, setIntroComplete] = useState(false);

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

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          introComplete
            ? {
                opacity: 1,
                scale: 1,
              }
            : {
                opacity: 0,
                scale: 0.8,
              }
        }
        transition={{
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[180px]" />

        <div className="absolute left-[30%] top-[40%] h-[350px] w-[350px] rounded-full bg-blue-500/15 blur-[120px]" />
      </motion.div>

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
      >
        <h1 className="bg-gradient-to-r from-white via-purple-300 to-blue-400 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent md:text-8xl">
          Music Station
        </h1>

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
        className="mt-10 max-w-2xl text-lg leading-8 text-neutral-400 md:text-xl"
      >
        A worship-centred platform where musicians learn, practise, create,
        collaborate and serve together.
      </motion.p>

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
        className="mt-12 flex flex-col gap-4 sm:flex-row"
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
          "
        >
          Explore Features
        </button>
      </motion.div>
    </section>
  );
}