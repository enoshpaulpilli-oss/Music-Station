"use client";
import { playSound } from "./SoundEffects";
export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">

      {/* Background Glow */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[180px] animate-slow-pulse" />

        <div className="absolute left-[30%] top-[40%] h-[350px] w-[350px] rounded-full bg-blue-500/15 blur-[120px] animate-slow-pulse" />

      </div>

      {/* Hero */}

      <div className="animate-fade-up">

        <h1 className="bg-gradient-to-r from-white via-purple-300 to-blue-400 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent md:text-8xl">
          Music Station
        </h1>

        <p className="mt-3 text-xs tracking-[0.45em] uppercase text-neutral-500">
          — Enosh Paul
        </p>

      </div>

      <p className="mt-10 max-w-2xl animate-fade-up text-lg leading-8 text-neutral-400 md:text-xl">
        A worship-centred platform where musicians learn,
        practise, create, collaborate and serve together.
      </p>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">

        <button
          className="
          rounded-full
          bg-purple-600
          px-8
          py-4
          font-semibold
          transition-all
          duration-300
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

  hover:bg-white/10

  hover:border-white/30

  hover:shadow-[0_20px_50px_rgba(255,255,255,0.15)]
  "
>
  Explore Features
</button>

      </div>

    </section>
  );
}