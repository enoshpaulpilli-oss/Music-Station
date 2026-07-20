"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ChatMessage = {
  name: string;
  message: string;
  time: string;
};

type Song = {
  title: string;
  key: string;
  bpm: number;
};

const chatMessages: ChatMessage[] = [
  {
    name: "Josh",
    message: "Changed the second song to D 👍",
    time: "Just now",
  },
  {
    name: "Sarah",
    message: "I'll bring the pads for rehearsal.",
    time: "1m ago",
  },
  {
    name: "Nathan",
    message: "New chord chart is uploaded.",
    time: "2m ago",
  },
];

const songRotations: Song[][] = [
  [
    {
      title: "King of Kings",
      key: "D",
      bpm: 68,
    },
    {
      title: "Living Hope",
      key: "E",
      bpm: 72,
    },
    {
      title: "Same God",
      key: "C",
      bpm: 74,
    },
  ],
  [
    {
      title: "King of Kings",
      key: "D",
      bpm: 68,
    },
    {
      title: "What A Beautiful Name",
      key: "D",
      bpm: 68,
    },
    {
      title: "Goodness of God",
      key: "A",
      bpm: 63,
    },
  ],
  [
    {
      title: "Build My Life",
      key: "G",
      bpm: 70,
    },
    {
      title: "Gratitude",
      key: "B",
      bpm: 73,
    },
    {
      title: "Holy Forever",
      key: "C",
      bpm: 72,
    },
  ],
];

const teamMembers = [
  {
    name: "Josh",
    role: "Guitar",
    initials: "J",
  },
  {
    name: "Sarah",
    role: "Vocals",
    initials: "S",
  },
  {
    name: "Nathan",
    role: "Keys",
    initials: "N",
  },
];

const smoothEase = [0.22, 1, 0.36, 1] as const;

function GlassWidget({
  children,
  className = "",
  delay = 0,
  duration = 6,
  parallaxX = 0,
  parallaxY = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  parallaxX?: number;
  parallaxY?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.94,
        filter: "blur(10px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.9,
        delay,
        ease: smoothEase,
      }}
      animate={
        reduceMotion
          ? {
              x: parallaxX,
              y: parallaxY,
            }
          : {
              x: parallaxX,
              y: [parallaxY - 5, parallaxY + 7, parallaxY - 5],
            }
      }
      style={{
        willChange: "transform",
      }}
      className={`
        absolute
        overflow-hidden
        rounded-[1.45rem]
        border
        border-white/[0.12]
        bg-white/[0.07]
        shadow-[0_24px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-2xl
        ${className}
      `}
    >
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
                x: ["-160%", "190%"],
              }
        }
        transition={{
          duration,
          delay: delay + 1,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          inset-y-0
          z-0
          w-1/3
          skew-x-[-20deg]
          bg-gradient-to-r
          from-transparent
          via-white/[0.055]
          to-transparent
        "
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function CalendarWidget({
  parallaxX,
  parallaxY,
}: {
  parallaxX: number;
  parallaxY: number;
}) {
  return (
    <GlassWidget
      delay={0.2}
      duration={7}
      parallaxX={parallaxX}
      parallaxY={parallaxY}
      className="
        left-0
        top-[10%]
        hidden
        w-[190px]
        p-5
        lg:block
        xl:left-[-3%]
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/35">
          Rehearsal
        </span>

        <span className="h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_16px_rgba(216,180,254,0.8)]" />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-4xl font-semibold tracking-tight">24</p>
          <p className="mt-1 text-sm text-white/40">Thursday</p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-white/80">7:00 PM</p>
          <p className="mt-1 text-xs text-white/35">Main hall</p>
        </div>
      </div>
    </GlassWidget>
  );
}

function ChatWidget({
  activeMessage,
  parallaxX,
  parallaxY,
}: {
  activeMessage: ChatMessage;
  parallaxX: number;
  parallaxY: number;
}) {
  return (
    <GlassWidget
      delay={0.35}
      duration={6.5}
      parallaxX={parallaxX}
      parallaxY={parallaxY}
      className="
        right-0
        top-[4%]
        hidden
        w-[245px]
        p-5
        lg:block
        xl:right-[-4%]
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
          Team chat
        </p>

        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeMessage.name + activeMessage.message}
          initial={{
            opacity: 0,
            y: 9,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -8,
            filter: "blur(4px)",
          }}
          transition={{
            duration: 0.45,
            ease: smoothEase,
          }}
          className="mt-5"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-purple-300/25 to-blue-400/10 text-xs font-semibold">
              {activeMessage.name.charAt(0)}
            </div>

            <div>
              <p className="text-sm font-medium">{activeMessage.name}</p>
              <p className="text-[11px] text-white/30">
                {activeMessage.time}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/60">
            {activeMessage.message}
          </p>
        </motion.div>
      </AnimatePresence>
    </GlassWidget>
  );
}

function PatchWidget({
  parallaxX,
  parallaxY,
}: {
  parallaxX: number;
  parallaxY: number;
}) {
  return (
    <GlassWidget
      delay={0.5}
      duration={8}
      parallaxX={parallaxX}
      parallaxY={parallaxY}
      className="
        bottom-[3%]
        left-[3%]
        hidden
        w-[225px]
        p-5
        lg:block
        xl:left-[-1%]
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
          Shared patch
        </p>

        <span className="rounded-full border border-purple-300/15 bg-purple-300/[0.08] px-2 py-1 text-[9px] text-purple-200/70">
          v3
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/25 p-4">
        <p className="text-[10px] tracking-[0.23em] text-white/30">
          HX STOMP
        </p>

        <p className="mt-2 text-sm font-medium text-white/85">
          Elevation Clean
        </p>

        <div className="mt-4 flex gap-1.5">
          {[35, 62, 45, 78, 53, 68, 40].map((height, index) => (
            <motion.span
              key={index}
              animate={{
                height: [`${height * 0.65}%`, `${height}%`, `${height * 0.65}%`],
              }}
              transition={{
                duration: 1.2 + index * 0.08,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="block w-1 rounded-full bg-purple-300/55"
              style={{
                height: `${height}%`,
                minHeight: 6,
                maxHeight: 22,
              }}
            />
          ))}
        </div>
      </div>
    </GlassWidget>
  );
}

function TasksWidget({
  checkedTask,
  parallaxX,
  parallaxY,
}: {
  checkedTask: number;
  parallaxX: number;
  parallaxY: number;
}) {
  const tasks = ["Upload charts", "Bring capo", "Check transitions"];

  return (
    <GlassWidget
      delay={0.65}
      duration={7.5}
      parallaxX={parallaxX}
      parallaxY={parallaxY}
      className="
        bottom-[7%]
        right-[2%]
        hidden
        w-[240px]
        p-5
        lg:block
        xl:right-[-2%]
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
          Rehearsal tasks
        </p>

        <p className="text-[10px] text-purple-200/60">2 of 3</p>
      </div>

      <div className="mt-5 space-y-3">
        {tasks.map((task, index) => {
          const checked = index <= checkedTask;

          return (
            <div
              key={task}
              className="flex items-center gap-3 text-sm text-white/60"
            >
              <motion.span
                animate={{
                  scale: checked ? [0.8, 1.12, 1] : 1,
                  backgroundColor: checked
                    ? "rgba(192,132,252,0.28)"
                    : "rgba(255,255,255,0.03)",
                  borderColor: checked
                    ? "rgba(216,180,254,0.45)"
                    : "rgba(255,255,255,0.12)",
                }}
                transition={{
                  duration: 0.45,
                }}
                className="grid h-5 w-5 shrink-0 place-items-center rounded-md border"
              >
                {checked && (
                  <motion.svg
                    initial={{
                      opacity: 0,
                      pathLength: 0,
                    }}
                    animate={{
                      opacity: 1,
                      pathLength: 1,
                    }}
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path d="M5 12.5 9.2 17 19 7" />
                  </motion.svg>
                )}
              </motion.span>

              <span
                className={
                  checked ? "text-white/35 line-through" : "text-white/65"
                }
              >
                {task}
              </span>
            </div>
          );
        })}
      </div>
    </GlassWidget>
  );
}

function MobileWidgetStrip({
  activeMessage,
}: {
  activeMessage: ChatMessage;
}) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
      <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-4 backdrop-blur-xl">
        <p className="text-[9px] uppercase tracking-[0.24em] text-white/30">
          Next rehearsal
        </p>

        <p className="mt-3 text-sm font-medium">Thursday · 7:00 PM</p>
        <p className="mt-1 text-xs text-white/35">Main hall</p>
      </div>

      <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-4 backdrop-blur-xl">
        <p className="text-[9px] uppercase tracking-[0.24em] text-white/30">
          Latest message
        </p>

        <p className="mt-3 text-sm font-medium">{activeMessage.name}</p>
        <p className="mt-1 truncate text-xs text-white/40">
          {activeMessage.message}
        </p>
      </div>
    </div>
  );
}

export default function BandWorkspace() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const [chatIndex, setChatIndex] = useState(0);
  const [songListIndex, setSongListIndex] = useState(0);
  const [checkedTask, setCheckedTask] = useState(0);
  const [audioProgress, setAudioProgress] = useState(38);
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const chatTimer = window.setInterval(() => {
      setChatIndex((current) => (current + 1) % chatMessages.length);
    }, 5200);

    const songTimer = window.setInterval(() => {
      setSongListIndex((current) => (current + 1) % songRotations.length);
    }, 7600);

    const taskTimer = window.setInterval(() => {
      setCheckedTask((current) => (current + 1) % 3);
    }, 3200);

    const progressTimer = window.setInterval(() => {
      setAudioProgress((current) => {
        if (current >= 92) return 18;
        return current + 2;
      });
    }, 900);

    const notificationTimer = window.setInterval(() => {
      setNotificationVisible((current) => !current);
    }, 6200);

    return () => {
      window.clearInterval(chatTimer);
      window.clearInterval(songTimer);
      window.clearInterval(taskTimer);
      window.clearInterval(progressTimer);
      window.clearInterval(notificationTimer);
    };
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    const relativeX =
      (event.clientX - bounds.left - bounds.width / 2) / bounds.width;

    const relativeY =
      (event.clientY - bounds.top - bounds.height / 2) / bounds.height;

    setMousePosition({
      x: relativeX,
      y: relativeY,
    });
  }

  function handleMouseLeave() {
    setMousePosition({
      x: 0,
      y: 0,
    });
  }

  const activeMessage = chatMessages[chatIndex];
  const activeSongs = songRotations[songListIndex];

  return (
    <section
      ref={sectionRef}
      id="band-workspace"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate overflow-hidden px-4 py-28 sm:px-6 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 -z-30 bg-black" />

      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 90, -30, 0],
                y: [0, -40, 30, 0],
                scale: [1, 1.12, 0.96, 1],
              }
        }
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          right-[-13%]
          top-[4%]
          -z-20
          h-[700px]
          w-[700px]
          rounded-full
          bg-purple-700/[0.18]
          blur-[210px]
        "
      />

      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -50, 35, 0],
                y: [0, 35, -20, 0],
              }
        }
        transition={{
          duration: 23,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          bottom-[-18%]
          left-[-5%]
          -z-20
          h-[620px]
          w-[620px]
          rounded-full
          bg-blue-500/[0.11]
          blur-[190px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[5%]
          top-[12%]
          -z-20
          select-none
          text-[25rem]
          font-black
          leading-none
          text-white/[0.012]
          blur-[1px]
        "
      >
        ♫
      </div>

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[88%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            filter: "blur(12px)",
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
            duration: 0.9,
            ease: smoothEase,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.15,
              duration: 0.7,
              ease: smoothEase,
            }}
            className="
              mx-auto
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-purple-300/[0.16]
              bg-purple-300/[0.06]
              px-4
              py-2
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-purple-200/70
              backdrop-blur-xl
            "
          >
            <motion.span
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.85, 1.15, 0.85],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-1.5 w-1.5 rounded-full bg-purple-300 shadow-[0_0_14px_rgba(216,180,254,0.9)]"
            />

            Built for worship teams
          </motion.div>

          <h2 className="mt-7 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-6xl md:text-7xl">
            Band Workspace
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
            Everything your worship team needs, all in one place. Plan
            services, organise setlists, share charts, upload patches, assign
            tasks and keep everyone in sync.
          </p>
        </motion.div>

        <div className="relative mt-16 min-h-[780px] lg:mt-24">
          <CalendarWidget
            parallaxX={mousePosition.x * -14}
            parallaxY={mousePosition.y * -10}
          />

          <ChatWidget
            activeMessage={activeMessage}
            parallaxX={mousePosition.x * 18}
            parallaxY={mousePosition.y * -12}
          />

          <PatchWidget
            parallaxX={mousePosition.x * -18}
            parallaxY={mousePosition.y * 14}
          />

          <TasksWidget
            checkedTask={checkedTask}
            parallaxX={mousePosition.x * 15}
            parallaxY={mousePosition.y * 12}
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 80,
              scale: 0.96,
              filter: "blur(16px)",
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 1.1,
              ease: smoothEase,
            }}
            style={{
              x: reduceMotion ? 0 : mousePosition.x * 7,
              y: reduceMotion ? 0 : mousePosition.y * 5,
              willChange: "transform",
            }}
            className="
              relative
              mx-auto
              max-w-5xl
              overflow-hidden
              rounded-[2rem]
              border
              border-white/[0.12]
              bg-gradient-to-br
              from-white/[0.095]
              via-white/[0.045]
              to-white/[0.015]
              p-2
              shadow-[0_60px_180px_rgba(0,0,0,0.75)]
              backdrop-blur-3xl
              sm:rounded-[2.7rem]
              sm:p-3
              lg:max-w-4xl
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/[0.07] via-transparent to-purple-300/[0.035]" />

            <motion.div
              aria-hidden="true"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: ["-140%", "170%"],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut",
              }}
              className="
                pointer-events-none
                absolute
                inset-y-0
                z-20
                w-[30%]
                skew-x-[-20deg]
                bg-gradient-to-r
                from-transparent
                via-white/[0.035]
                to-transparent
              "
            />

            <div
              className="
                relative
                overflow-hidden
                rounded-[1.55rem]
                border
                border-white/[0.08]
                bg-[#08080b]/90
                sm:rounded-[2.15rem]
              "
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                  </div>

                  <div className="hidden h-4 w-px bg-white/[0.08] sm:block" />

                  <p className="hidden text-xs text-white/30 sm:block">
                    Music Space · Band Workspace
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-green-300/[0.12] bg-green-300/[0.05] px-3 py-1.5">
                  <motion.span
                    animate={{
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-green-300"
                  />

                  <span className="text-[10px] text-green-200/65">
                    Synced
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-[220px_1fr]">
                <aside className="hidden border-r border-white/[0.07] p-5 lg:block">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-purple-300/15 bg-purple-300/[0.08] text-sm font-semibold text-purple-100">
                      MS
                    </div>

                    <div>
                      <p className="text-sm font-medium">Sunday Team</p>
                      <p className="mt-0.5 text-[11px] text-white/30">
                        8 members
                      </p>
                    </div>
                  </div>

                  <nav className="mt-8 space-y-2">
                    {[
                      "Overview",
                      "Setlists",
                      "Team chat",
                      "Files",
                      "Patches",
                      "Tasks",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-2.5
                          text-xs
                          transition-colors
                          ${
                            index === 0
                              ? "border border-white/[0.08] bg-white/[0.065] text-white/80"
                              : "text-white/30"
                          }
                        `}
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${
                              index === 0
                                ? "bg-purple-300 shadow-[0_0_12px_rgba(216,180,254,0.8)]"
                                : "bg-white/15"
                            }
                          `}
                        />

                        {item}
                      </div>
                    ))}
                  </nav>

                  <div className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">
                      Storage
                    </p>

                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                      <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-purple-400/70 to-blue-400/70" />
                    </div>

                    <p className="mt-3 text-[10px] text-white/25">
                      4.2 GB of 10 GB
                    </p>
                  </div>
                </aside>

                <main className="min-w-0 p-4 sm:p-7 lg:p-8">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-purple-200/50">
                        Upcoming service
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                        Sunday Worship
                      </h3>

                      <p className="mt-2 text-sm text-white/35">
                        27 July · 9:00 AM
                      </p>
                    </div>

                    <div className="flex items-center">
                      {teamMembers.map((member) => (
                        <motion.div
                          key={member.name}
                          whileHover={{
                            y: -4,
                            scale: 1.08,
                          }}
                          className="
                            relative
                            -ml-2
                            grid
                            h-10
                            w-10
                            place-items-center
                            rounded-full
                            border-2
                            border-[#0c0c10]
                            bg-gradient-to-br
                            from-purple-400/30
                            to-blue-400/15
                            text-[11px]
                            font-semibold
                            first:ml-0
                          "
                          title={`${member.name} · ${member.role}`}
                        >
                          {member.initials}

                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0c0c10] bg-green-300" />
                        </motion.div>
                      ))}

                      <div className="-ml-2 grid h-10 w-10 place-items-center rounded-full border-2 border-[#0c0c10] bg-white/[0.07] text-[10px] text-white/45">
                        +5
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                    <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Service setlist</p>
                          <p className="mt-1 text-xs text-white/30">
                            3 songs · 19 minutes
                          </p>
                        </div>

                        <button
                          type="button"
                          className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/40 transition hover:border-purple-300/25 hover:text-white/70"
                        >
                          View all
                        </button>
                      </div>

                      <div className="mt-5 space-y-2.5">
                        <AnimatePresence mode="popLayout">
                          {activeSongs.map((song, index) => (
                            <motion.div
                              layout
                              key={`${song.title}-${songListIndex}`}
                              initial={{
                                opacity: 0,
                                x: -14,
                                filter: "blur(5px)",
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                filter: "blur(0px)",
                              }}
                              exit={{
                                opacity: 0,
                                x: 12,
                                filter: "blur(5px)",
                              }}
                              transition={{
                                duration: 0.45,
                                delay: index * 0.08,
                                ease: smoothEase,
                              }}
                              className="
                                group
                                flex
                                items-center
                                justify-between
                                rounded-2xl
                                border
                                border-white/[0.065]
                                bg-black/20
                                p-3
                                transition
                                hover:border-purple-300/[0.16]
                                hover:bg-white/[0.04]
                              "
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-purple-300/[0.12] bg-purple-300/[0.055] text-[11px] text-purple-100/70">
                                  {index + 1}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-white/75">
                                    {song.title}
                                  </p>

                                  <p className="mt-1 text-[10px] text-white/25">
                                    Arrangement ready
                                  </p>
                                </div>
                              </div>

                              <div className="ml-3 flex items-center gap-2">
                                <span className="rounded-lg bg-white/[0.045] px-2 py-1 text-[10px] text-white/40">
                                  {song.key}
                                </span>

                                <span className="hidden rounded-lg bg-white/[0.045] px-2 py-1 text-[10px] text-white/40 sm:block">
                                  {song.bpm} BPM
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Now playing</p>

                          <motion.div
                            animate={{
                              rotate: 360,
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.08] bg-black/20"
                          >
                            <span className="text-[10px] text-purple-200/60">
                              ♪
                            </span>
                          </motion.div>
                        </div>

                        <p className="mt-5 text-sm font-medium text-white/70">
                          King of Kings
                        </p>

                        <p className="mt-1 text-[11px] text-white/30">
                          Reference track
                        </p>

                        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            animate={{
                              width: `${audioProgress}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              ease: "linear",
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                          />
                        </div>

                        <div className="mt-3 flex justify-between text-[9px] text-white/20">
                          <span>2:14</span>
                          <span>5:42</span>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-5">
                        <p className="text-sm font-medium">Team status</p>

                        <div className="mt-4 space-y-3">
                          {teamMembers.map((member, index) => (
                            <div
                              key={member.name}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.06] text-[9px]">
                                  {member.initials}
                                </div>

                                <div>
                                  <p className="text-xs text-white/60">
                                    {member.name}
                                  </p>
                                  <p className="text-[9px] text-white/25">
                                    {member.role}
                                  </p>
                                </div>
                              </div>

                              <motion.span
                                animate={{
                                  opacity: [0.45, 1, 0.45],
                                }}
                                transition={{
                                  duration: 2,
                                  delay: index * 0.4,
                                  repeat: Infinity,
                                }}
                                className="h-2 w-2 rounded-full bg-green-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <MobileWidgetStrip activeMessage={activeMessage} />
                </main>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[68%] -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-300/45 to-transparent" />
          </motion.div>

          <AnimatePresence>
            {notificationVisible && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.92,
                  filter: "blur(7px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                  filter: "blur(5px)",
                }}
                transition={{
                  duration: 0.5,
                  ease: smoothEase,
                }}
                className="
                  absolute
                  left-1/2
                  top-[82%]
                  z-30
                  hidden
                  -translate-x-1/2
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/[0.12]
                  bg-black/60
                  px-4
                  py-3
                  shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                  backdrop-blur-2xl
                  lg:flex
                "
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl border border-purple-300/15 bg-purple-300/[0.08] text-xs text-purple-100">
                  ↑
                </div>

                <div>
                  <p className="text-xs font-medium text-white/75">
                    New chart uploaded
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/30">
                    Nathan added Living Hope.pdf
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.45,
            duration: 0.8,
            ease: smoothEase,
          }}
          className="-mt-4 flex flex-col items-center text-center lg:-mt-8"
        >
          <p className="max-w-xl text-sm leading-6 text-white/35">
            No more lost chord charts, forgotten rehearsal times or twenty
            different group chats.
          </p>

          <motion.button
            type="button"
            whileHover={{
              y: -5,
              scale: 1.035,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              group
              relative
              mt-7
              overflow-hidden
              rounded-full
              border
              border-purple-300/[0.2]
              bg-purple-600
              px-7
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-[0_18px_55px_rgba(126,34,206,0.28)]
              transition
              hover:bg-purple-500
              hover:shadow-[0_22px_75px_rgba(168,85,247,0.42)]
            "
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Workspace

              <motion.span
                className="inline-block"
                animate={{
                  x: [0, 3, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </span>

            <span className="pointer-events-none absolute inset-0 translate-x-[-130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[140%]" />
          </motion.button>

          <p className="mt-3 text-[10px] tracking-[0.16em] text-white/20">
            COMING TO MUSIC SPACE
          </p>
        </motion.div>
      </div>
    </section>
  );
}