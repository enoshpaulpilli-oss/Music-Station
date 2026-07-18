"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type StudioPageProps = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  modules: {
    title: string;
    description: string;
  }[];
};

export default function StudioPage({
  number,
  title,
  subtitle,
  description,
  modules,
}: StudioPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-28 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-30 bg-black" />

      <motion.div
        animate={{
          x: [0, 80, -30, 0],
          y: [0, -40, 25, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none fixed left-[15%] top-[10%] -z-20 h-[650px] w-[650px] rounded-full bg-purple-600/20 blur-[190px]"
      />

      <motion.div
        animate={{
          x: [0, -60, 35, 0],
          y: [0, 40, -25, 0],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none fixed bottom-[5%] right-[8%] -z-20 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[160px]"
      />

      {/* Top navigation */}
      <nav className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-2xl">
        <Link
          href="/"
          className="text-sm font-semibold transition hover:text-purple-300"
        >
          Music Station
        </Link>

        <div className="h-4 w-px bg-white/15" />

        <Link
          href="/"
          className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition hover:text-white"
        >
          Back Home
        </Link>
      </nav>

      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <motion.section
          initial={{
            opacity: 0,
            y: 50,
            filter: "blur(14px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pt-24"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-purple-300/70">
            Studio {number}
          </p>

          <h1 className="mt-6 bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl md:text-8xl">
            {title}
          </h1>

          <p className="mt-6 text-xl text-purple-200/80">{subtitle}</p>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-neutral-400">
            {description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-full bg-purple-600 px-8 py-4 font-semibold transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] active:scale-95">
              Begin Learning
            </button>

            <button className="rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:bg-white/10 active:scale-95">
              View Practice Plan
            </button>
          </div>
        </motion.section>

        {/* Modules */}
        <section className="py-32">
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.9,
            }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-purple-300/70">
              Your learning path
            </p>

            <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
              Studio Modules
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {modules.map((module, index) => (
              <motion.article
                key={module.title}
                initial={{
                  opacity: 0,
                  y: 45,
                  filter: "blur(8px)",
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -10,
                  scale: 1.015,
                }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-2xl transition-colors hover:border-purple-300/35 hover:bg-white/[0.075]"
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-500/0 blur-[55px] transition-all duration-700 group-hover:bg-purple-500/20" />

                <p className="relative text-xs tracking-[0.35em] text-purple-300/45">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <div className="relative mt-7 h-px w-12 bg-gradient-to-r from-purple-300 to-transparent transition-all duration-500 group-hover:w-24" />

                <h3 className="relative mt-7 text-2xl font-semibold group-hover:text-purple-200">
                  {module.title}
                </h3>

                <p className="relative mt-4 leading-7 text-neutral-400">
                  {module.description}
                </p>

                <button className="relative mt-8 text-sm font-medium text-purple-300 transition group-hover:text-white">
                  Open Module →
                </button>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}