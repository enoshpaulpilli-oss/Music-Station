"use client";

import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Create Your Band",
    description:
      "Build a private worship workspace and give your team one shared home.",
  },
  {
    number: "02",
    title: "Invite Members",
    description:
      "Share an invite link and bring musicians, vocalists and leaders together.",
  },
  {
    number: "03",
    title: "Prepare Worship Sets",
    description:
      "Organise songs, keys, arrangements, notes and rehearsal plans.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -55,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function BandWorkspace() {
  return (
    <section
      id="band-workspace"
      className="relative isolate overflow-hidden px-6 py-32 md:py-40"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-black" />

      {/* Royal atmospheric glow */}
      <motion.div
        animate={{
          x: [0, 80, -30, 0],
          y: [0, -35, 20, 0],
          scale: [1, 1.1, 0.96, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[-8%] top-[5%] -z-20 h-[650px] w-[650px] rounded-full bg-purple-700/15 blur-[190px]"
      />

      <motion.div
        animate={{
          x: [0, -45, 25, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-[-10%] left-[3%] -z-20 h-[460px] w-[460px] rounded-full bg-blue-500/10 blur-[160px]"
      />

      {/* Divider */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 70,
            filter: "blur(14px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/10
            bg-gradient-to-br
            from-white/[0.085]
            via-white/[0.04]
            to-transparent
            p-8
            backdrop-blur-2xl
            sm:p-12
            md:p-16
          "
        >
          {/* Large inner spotlight */}
          <motion.div
            animate={{
              x: ["-20%", "45%", "-20%"],
              y: ["-10%", "20%", "-10%"],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-purple-500/15 blur-[120px]"
          />

          {/* Moving glass highlight */}
          <motion.div
            animate={{
              x: ["-130%", "160%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-y-0 w-[35%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.035] to-transparent"
          />

          <div className="relative z-10 max-w-3xl">
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
              Built for teams
            </motion.p>

            <h2 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
              Band Workspace
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
              A connected home where worship teams can collaborate, communicate
              and prepare together.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="relative z-10 mt-14 grid gap-6 md:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -12,
                  scale: 1.025,
                  rotateX: 2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 230,
                  damping: 19,
                }}
                className="
                  group
                  relative
                  min-h-[250px]
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-white/10
                  bg-black/25
                  p-7
                  backdrop-blur-xl
                  [transform-style:preserve-3d]
                  hover:border-purple-300/35
                  hover:bg-white/[0.055]
                  hover:shadow-[0_28px_90px_rgba(126,34,206,0.17)]
                "
              >
                {/* Hover glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-purple-500/0
                    blur-[50px]
                    transition-all
                    duration-700
                    group-hover:bg-purple-500/25
                  "
                />

                <p className="relative text-xs tracking-[0.35em] text-purple-300/45">
                  {feature.number}
                </p>

                <div className="relative mt-7 h-px w-10 bg-gradient-to-r from-purple-300/80 to-transparent transition-all duration-500 group-hover:w-20" />

                <h3 className="relative mt-7 text-xl font-semibold transition-colors duration-300 group-hover:text-purple-200">
                  {feature.title}
                </h3>

                <p className="relative mt-4 text-sm leading-7 text-neutral-400">
                  {feature.description}
                </p>

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

          <motion.button
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.75,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -6,
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="
              relative
              z-10
              mt-12
              rounded-full
              bg-purple-600
              px-8
              py-4
              font-semibold
              transition-shadow
              duration-300
              hover:bg-purple-500
              hover:shadow-[0_0_65px_rgba(168,85,247,0.5)]
            "
          >
            Invite Your Band
          </motion.button>

          {/* Bottom edge glow */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[65%] -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-400/45 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}