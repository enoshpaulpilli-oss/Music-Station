"use client";

import { motion } from "framer-motion";

const studios = [
  {
    number: "01",
    title: "Guitar Studio",
    description:
      "Learn worship guitar techniques, chords, tones and arrangements.",
  },
  {
    number: "02",
    title: "Piano Studio",
    description:
      "Build worship piano skills, chord progressions and atmosphere.",
  },
  {
    number: "03",
    title: "Vocal Studio",
    description:
      "Develop vocal confidence, harmony and worship expression.",
  },
  {
    number: "04",
    title: "Rhythm Studio",
    description:
      "Master timing, grooves, dynamics and worship foundations.",
  },
];

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 70,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 55,
    scale: 0.96,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function WorshipStudio() {
  return (
    <section
      id="worship-studio"
      className="relative isolate overflow-hidden px-6 py-32 md:py-40"
    >
      {/* Dark section background */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-black" />

      {/* Purple atmosphere */}
      <motion.div
        animate={{
          x: [0, 70, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[5%] top-[18%] -z-20 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[160px]"
      />

      {/* Blue atmosphere */}
      <motion.div
        animate={{
          x: [0, -45, 30, 0],
          y: [0, 30, -25, 0],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-[8%] right-[4%] -z-20 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[150px]"
      />

      {/* Top divider */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="max-w-3xl"
        >
          <motion.p
            initial={{
              opacity: 0,
              letterSpacing: "0.1em",
            }}
            whileInView={{
              opacity: 1,
              letterSpacing: "0.4em",
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="text-xs uppercase text-purple-300/80"
          >
            Built for worship musicians
          </motion.p>

          <h2 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
            Worship Studio
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
            A creative space designed to help musicians grow, practise and
            serve with excellence.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.18,
          }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {studios.map((studio) => (
            <motion.article
              key={studio.title}
              variants={cardVariants}
              whileHover={{
                y: -14,
                rotateX: 2,
                rotateY: -2,
                scale: 1.025,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
              className="
                group
                relative
                min-h-[310px]
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-white/[0.045]
                p-8
                backdrop-blur-2xl
                [transform-style:preserve-3d]
                hover:border-purple-300/35
                hover:bg-white/[0.075]
                hover:shadow-[0_30px_100px_rgba(126,34,206,0.18)]
              "
            >
              {/* Card glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-48
                  w-48
                  rounded-full
                  bg-purple-500/0
                  blur-[55px]
                  transition-all
                  duration-700
                  group-hover:bg-purple-500/25
                "
              />

              {/* Moving highlight */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/[0.045]
                  to-transparent
                  transition-transform
                  duration-1000
                  group-hover:translate-x-full
                "
              />

              {/* Number */}
              <p className="relative text-xs tracking-[0.35em] text-purple-300/45">
                {studio.number}
              </p>

              {/* Accent line */}
              <div className="relative mt-8 h-px w-12 bg-gradient-to-r from-purple-300/80 to-transparent transition-all duration-500 group-hover:w-24" />

              <h3 className="relative mt-8 text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-purple-200">
                {studio.title}
              </h3>

              <p className="relative mt-5 text-sm leading-7 text-neutral-400">
                {studio.description}
              </p>

              <button
                className="
                  relative
                  mt-10
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
                "
              >
                Explore
                <span aria-hidden="true">→</span>
              </button>

              {/* Bottom edge glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  left-1/2
                  h-px
                  w-0
                  -translate-x-1/2
                  bg-gradient-to-r
                  from-transparent
                  via-purple-300
                  to-transparent
                  transition-all
                  duration-700
                  group-hover:w-[75%]
                "
              />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}