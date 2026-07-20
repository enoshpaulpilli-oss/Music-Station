"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type FeatureType =
  | "chords"
  | "instruments"
  | "harmony"
  | "ear"
  | "practice";

type Feature = {
  number: string;
  title: string;
  description: string;
  href: string;
  type: FeatureType;
};

const features: Feature[] = [
  {
    number: "01",
    title: "Chord Explorer",
    description:
      "Forgot a chord? Just search it. You’ll get the notes, fingerings, formulas and a few chords that sound good with it too.",
    href: "/chords",
    type: "chords",
  },
  {
    number: "02",
    title: "Instrument Labs",
    description:
      "Think of this as your little practice room. Pick an instrument, learn the useful stuff and mess around until it starts sounding good.",
    href: "/instruments",
    type: "instruments",
  },
  {
    number: "03",
    title: "Harmony Lab",
    description:
      "Got a random idea at 2am? Throw it in here, try different chords and figure out where the song could go next.",
    href: "/harmony",
    type: "harmony",
  },
  {
    number: "04",
    title: "Ear Training",
    description:
      "If your ears aren’t cooperating yet, this will help. Practise recognising notes, intervals, chords and rhythms without making it miserable.",
    href: "/ear-training",
    type: "ear",
  },
  {
    number: "05",
    title: "Practice Suite",
    description:
      "The boring stuff that actually makes you better. Metronomes, routines, progress tracking and small goals you might genuinely finish.",
    href: "/practice",
    type: "practice",
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
      staggerChildren: 0.13,
      delayChildren: 0.15,
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

function ChordAnimation() {
  const notes = ["C", "E", "G"];

  return (
    <div className="relative h-28 w-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />

      {notes.map((note, index) => (
        <motion.span
          key={note}
          animate={{
            y: [0, -12, 0],
            rotate: [0, index % 2 === 0 ? 5 : -5, 0],
            boxShadow: [
              "0 0 0 rgba(192,132,252,0)",
              "0 0 25px rgba(192,132,252,0.35)",
              "0 0 0 rgba(192,132,252,0)",
            ],
          }}
          transition={{
            duration: 2.4,
            delay: index * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            top-1/2
            flex
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-xl
            border
            border-purple-300/20
            bg-purple-400/10
            text-sm
            font-semibold
            text-purple-200
            backdrop-blur-xl
          "
          style={{
            left: `${17 + index * 31}%`,
          }}
        >
          {note}
        </motion.span>
      ))}
    </div>
  );
}

function InstrumentAnimation() {
  return (
    <div className="relative flex h-28 items-center justify-center">
      <div className="flex h-[74px] w-[78%] items-end justify-center overflow-hidden rounded-xl border border-white/10 bg-black/25 p-2">
        {[0, 1, 2, 3, 4, 5, 6].map((key) => (
          <motion.div
            key={key}
            animate={{
              y: [0, key % 3 === 0 ? 7 : 2, 0],
              backgroundColor: [
                "rgba(255,255,255,0.85)",
                key % 3 === 0
                  ? "rgba(216,180,254,0.95)"
                  : "rgba(255,255,255,0.85)",
                "rgba(255,255,255,0.85)",
              ],
            }}
            transition={{
              duration: 1.8,
              delay: key * 0.14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              mx-[2px]
              h-14
              flex-1
              rounded-b-md
              border
              border-black/30
              bg-white/90
            "
          />
        ))}
      </div>

      <motion.div
        animate={{
          opacity: [0.2, 0.7, 0.2],
          scaleX: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1 h-px w-[70%] bg-purple-300/70 blur-[1px]"
      />
    </div>
  );
}

function HarmonyAnimation() {
  const points = [
    { left: "12%", top: "52%" },
    { left: "39%", top: "23%" },
    { left: "64%", top: "62%" },
    { left: "86%", top: "30%" },
  ];

  return (
    <div className="relative h-28 w-full">
      <svg
        viewBox="0 0 300 110"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <motion.path
          d="M36 59 L117 28 L192 68 L258 34"
          fill="none"
          stroke="rgba(192,132,252,0.55)"
          strokeWidth="2"
          strokeDasharray="6 7"
          animate={{
            strokeDashoffset: [0, -26],
            opacity: [0.35, 0.9, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>

      {points.map((point, index) => (
        <motion.div
          key={`${point.left}-${point.top}`}
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              "0 0 0 rgba(192,132,252,0)",
              "0 0 24px rgba(192,132,252,0.7)",
              "0 0 0 rgba(192,132,252,0)",
            ],
          }}
          transition={{
            duration: 2.2,
            delay: index * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            h-3
            w-3
            rounded-full
            border
            border-purple-200
            bg-purple-300
          "
          style={point}
        />
      ))}
    </div>
  );
}

function EarAnimation() {
  return (
    <div className="relative flex h-28 items-center justify-center">
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          initial={{
            opacity: 0,
            scale: 0.4,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.4, 1.4, 1.9],
          }}
          transition={{
            duration: 2.7,
            delay: ring * 0.55,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="
            absolute
            h-14
            w-14
            rounded-full
            border
            border-blue-300/40
          "
        />
      ))}

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          boxShadow: [
            "0 0 15px rgba(96,165,250,0.15)",
            "0 0 35px rgba(96,165,250,0.5)",
            "0 0 15px rgba(96,165,250,0.15)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          relative
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          border
          border-blue-300/25
          bg-blue-400/10
          text-xl
          text-blue-200
        "
      >
        ♪
      </motion.div>
    </div>
  );
}

function PracticeAnimation() {
  return (
    <div className="relative flex h-28 items-center justify-center">
      <div className="relative flex h-[82px] w-[82px] items-center justify-center rounded-full bg-white/[0.035]">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="43"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="7"
          />

          <motion.circle
            cx="50"
            cy="50"
            r="43"
            fill="none"
            stroke="rgba(192,132,252,0.9)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="270"
            animate={{
              strokeDashoffset: [270, 70, 270],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        <motion.span
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.96, 1.04, 0.96],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-xs font-semibold text-purple-200"
        >
          72%
        </motion.span>
      </div>
    </div>
  );
}

function FeatureAnimation({ type }: { type: FeatureType }) {
  if (type === "chords") return <ChordAnimation />;
  if (type === "instruments") return <InstrumentAnimation />;
  if (type === "harmony") return <HarmonyAnimation />;
  if (type === "ear") return <EarAnimation />;

  return <PracticeAnimation />;
}

function AboutPopup() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mosesOpen, setMosesOpen] = useState(false);
  const [fairPoint, setFairPoint] = useState(false);

  useEffect(() => {
  if (!fairPoint) return;

  const timeout = window.setTimeout(() => {
    setMosesOpen(false);   // Close the popup
    setFairPoint(false);   // Reset for next time
  }, 2000);

  return () => {
    window.clearTimeout(timeout);
  };
}, [fairPoint]);

  const closeEverything = () => {
    setAboutOpen(false);
    setMosesOpen(false);
    setFairPoint(false);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          setAboutOpen((current) => !current);
          setMosesOpen(false);
          setFairPoint(false);
        }}
        initial={{
          opacity: 0,
          x: -20,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{ once: true }}
        whileHover={{
          x: 4,
        }}
        whileTap={{
          scale: 0.96,
        }}
        className="
          fixed
          bottom-5
          left-4
          z-[60]
          flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-black/45
          px-4
          py-3
          text-xs
          font-medium
          text-neutral-300
          shadow-[0_20px_80px_rgba(0,0,0,0.5)]
          backdrop-blur-2xl
          transition-colors
          hover:border-purple-300/25
          hover:bg-white/[0.08]
          hover:text-white
          sm:bottom-7
          sm:left-6
        "
        aria-expanded={aboutOpen}
        aria-label="Open information about Music Space"
      >
        <motion.span
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-1.5 w-1.5 rounded-full bg-purple-300"
        />

        <span>about this thing</span>

        <motion.span
          animate={{
            rotate: aboutOpen ? 45 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 22,
          }}
          className="text-purple-300"
        >
          +
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {aboutOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close about popup"
              onClick={closeEverything}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed
                inset-0
                z-[54]
                hidden
                cursor-default
                bg-black/10
                backdrop-blur-[1px]
                sm:block
              "
            />

            <motion.div
              initial={{
                opacity: 0,
                x: -24,
                y: 18,
                scale: 0.94,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                x: -18,
                y: 14,
                scale: 0.96,
                filter: "blur(8px)",
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                bottom-[78px]
                left-4
                right-4
                z-[65]
                overflow-hidden
                rounded-[1.75rem]
                border
                border-white/10
                bg-neutral-950/75
                p-6
                shadow-[0_30px_120px_rgba(0,0,0,0.7)]
                backdrop-blur-3xl
                sm:bottom-[92px]
                sm:left-6
                sm:right-auto
                sm:w-[390px]
              "
            >
              <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-purple-500/20 blur-[70px]" />

              <div className="pointer-events-none absolute -bottom-24 -right-16 h-48 w-48 rounded-full bg-blue-500/10 blur-[70px]" />

              <div className="relative">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-purple-300/60">
                      okay so
                    </p>

                    <h3 className="mt-3 text-xl font-semibold tracking-tight">
                      About Music Space
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={closeEverything}
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      text-sm
                      text-neutral-400
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                    aria-label="Close popup"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-6 text-sm leading-7 text-neutral-300">
                  Nothing much to say about it, bro. I originally built this
                  just for myself because I wanted all my music stuff in one
                  place. Then the GOAT{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMosesOpen(true);
                      setFairPoint(false);
                    }}
                    className="
                      group
                      inline-flex
                      cursor-pointer
                      items-start
                      font-semibold
                    "
                  >
                    <motion.span
                      animate={{
                        backgroundPosition: [
                          "0% 50%",
                          "100% 50%",
                          "0% 50%",
                        ],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="
                        bg-gradient-to-r
                        from-purple-300
                        via-blue-300
                        to-pink-300
                        bg-[length:200%_200%]
                        bg-clip-text
                        text-transparent
                      "
                    >
                      Moses Andrew
                    </motion.span>

                    <motion.span
                      whileHover={{
                        x: 2,
                        y: -2,
                        filter:
                          "drop-shadow(0 0 6px rgba(216,180,254,0.9))",
                      }}
                      className="
                        ml-0.5
                        -translate-y-[3px]
                        bg-gradient-to-r
                        from-purple-300
                        via-blue-300
                        to-pink-300
                        bg-clip-text
                        text-[11px]
                        text-transparent
                      "
                    >
                      ↗
                    </motion.span>
                  </button>{" "}
                  convinced me other people might actually enjoy using it too...
                  so here we are.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mosesOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close Moses popup"
              onClick={() => {
                setMosesOpen(false);
                setFairPoint(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed
                inset-0
                z-[69]
                cursor-default
                bg-black/45
                backdrop-blur-sm
              "
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.82,
                y: 24,
                filter: "blur(12px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 15,
                filter: "blur(8px)",
              }}
              transition={{
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                left-1/2
                top-1/2
                z-[70]
                w-[calc(100%-2rem)]
                max-w-sm
                -translate-x-1/2
                -translate-y-1/2
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-neutral-950/85
                p-7
                shadow-[0_40px_140px_rgba(0,0,0,0.8)]
                backdrop-blur-3xl
              "
            >
              <motion.div
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -15, 12, 0],
                  scale: [1, 1.15, 0.95, 1],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-500/20 blur-[80px]"
              />

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    About Moses
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      setMosesOpen(false);
                      setFairPoint(false);
                    }}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      text-neutral-400
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                    aria-label="Close About Moses popup"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-7 min-h-[76px]">
                  <AnimatePresence mode="wait">
                    {fairPoint ? (
                      <motion.p
                        key="fair-point"
                        initial={{
                          opacity: 0,
                          y: 8,
                          filter: "blur(5px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                          filter: "blur(5px)",
                        }}
                        className="text-base leading-8 text-neutral-300"
                      >
                        Yeah... fair point 😭
                      </motion.p>
                    ) : (
                      <motion.div
                        key="normal-body"
                        initial={{
                          opacity: 0,
                          y: 8,
                          filter: "blur(5px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                          filter: "blur(5px)",
                        }}
                        className="text-base leading-8 text-neutral-300"
                      >
                        <p>He&apos;s nothing huge 😂</p>
                        <p>Just my homie.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
  type="button"
  onClick={() => {
    if (fairPoint) return;
    setFairPoint(true);
  }}
                    className="
                      flex-1
                      rounded-full
                      border
                      border-purple-300/20
                      bg-purple-400/10
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-purple-100
                      transition-all
                      hover:-translate-y-1
                      hover:border-purple-300/40
                      hover:bg-purple-400/15
                      hover:shadow-[0_15px_40px_rgba(168,85,247,0.18)]
                      active:translate-y-0
                      active:scale-95
                    "
                  >
                    Who doesn&apos;t know him?
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMosesOpen(false);
                      setFairPoint(false);
                    }}
                    className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-neutral-300
                      transition-all
                      hover:-translate-y-1
                      hover:bg-white/10
                      hover:text-white
                      active:translate-y-0
                      active:scale-95
                    "
                  >
                    Alrightyyy
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function WorshipStudio() {
  return (
    <>
      <section
        id="features"
        className="
          relative
          isolate
          scroll-mt-28
          overflow-hidden
          px-5
          py-28
          sm:px-6
          md:py-40
        "
      >
        <div className="pointer-events-none absolute inset-0 -z-30 bg-black" />

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
          className="
            pointer-events-none
            absolute
            left-[2%]
            top-[10%]
            -z-20
            h-[380px]
            w-[380px]
            rounded-full
            bg-purple-600/15
            blur-[140px]
            md:left-[5%]
            md:h-[500px]
            md:w-[500px]
            md:blur-[160px]
          "
        />

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
          className="
            pointer-events-none
            absolute
            bottom-[8%]
            right-[2%]
            -z-20
            h-[350px]
            w-[350px]
            rounded-full
            bg-blue-500/10
            blur-[135px]
            md:right-[4%]
            md:h-[420px]
            md:w-[420px]
            md:blur-[150px]
          "
        />

        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />

        <div className="mx-auto max-w-7xl">
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
                letterSpacing: "0.35em",
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="text-[10px] uppercase text-purple-300/70 sm:text-xs"
            >
              here&apos;s the useful stuff
            </motion.p>

            <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl md:text-6xl">
              Everything in one little{" "}
              <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                music space.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-400 sm:text-lg">
              No giant complicated dashboard. Just a few genuinely useful
              places to learn something, practise properly or mess around with
              an idea.
            </p>
          </motion.div>

          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            className="
              mt-14
              grid
              gap-5
              md:grid-cols-2
              lg:grid-cols-6
            "
          >
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -12,
                  scale: 1.018,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                }}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/[0.04]
                  backdrop-blur-2xl
                  [transform-style:preserve-3d]
                  hover:border-purple-300/30
                  hover:bg-white/[0.07]
                  hover:shadow-[0_30px_110px_rgba(126,34,206,0.16)]
                  ${
                    index < 3
                      ? "lg:col-span-2"
                      : "lg:col-span-3"
                  }
                `}
              >
                <Link
                  href="/login"
                  className="
                    relative
                    block
                    min-h-[390px]
                    p-7
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-purple-300
                    sm:p-8
                  "
                  aria-label={`Open ${feature.title}`}
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-20
                      -top-20
                      h-56
                      w-56
                      rounded-full
                      bg-purple-500/0
                      blur-[60px]
                      transition-all
                      duration-700
                      group-hover:bg-purple-500/20
                    "
                  />

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

                  <div className="relative flex items-center justify-between">
                    <p className="text-xs tracking-[0.35em] text-purple-300/45">
                      {feature.number}
                    </p>

                    <motion.span
                      initial={{
                        x: -4,
                        y: 4,
                        opacity: 0.45,
                      }}
                      whileHover={{
                        x: 2,
                        y: -2,
                      }}
                      className="
                        text-lg
                        text-neutral-500
                        transition-colors
                        duration-300
                        group-hover:text-purple-200
                      "
                      aria-hidden="true"
                    >
                      ↗
                    </motion.span>
                  </div>

                  <div className="relative mt-4">
                    <FeatureAnimation type={feature.type} />
                  </div>

                  <div className="relative mt-5">
                    <h3 className="text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-purple-100">
                      {feature.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-neutral-400">
                      {feature.description}
                    </p>
                  </div>

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
                </Link>
              </motion.article>
            ))}
          </motion.div>

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="
              mx-auto
              mt-12
              max-w-xl
              text-center
              text-sm
              leading-7
              text-neutral-600
            "
          >
            Some of these are still being built, by the way. I&apos;m working
            on it 😭
          </motion.p>
        </div>
      </section>

      <AboutPopup />
    </>
  );
}