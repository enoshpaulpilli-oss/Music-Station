"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { supabase } from "@/lib/supabase/client";

type ToolType =
  | "chords"
  | "instruments"
  | "harmony"
  | "ear"
  | "practice";

type Tool = {
  number: string;
  title: string;
  description: string;
  href: string;
  type: ToolType;
  status: string;
};

const tools: Tool[] = [
  {
    number: "01",
    title: "Chord Explorer",
    description:
      "Search chords, understand their notes and formulas, explore fingerings and discover chords that work well together.",
    href: "/chords",
    type: "chords",
    status: "Explore",
  },
  {
    number: "02",
    title: "Instrument Labs",
    description:
      "Choose an instrument, learn the useful foundations and practise through focused interactive tools.",
    href: "/instruments",
    type: "instruments",
    status: "Enter lab",
  },
  {
    number: "03",
    title: "Harmony Lab",
    description:
      "Experiment with chord progressions, develop musical ideas and discover where your songs could go next.",
    href: "/harmony",
    type: "harmony",
    status: "Create",
  },
  {
    number: "04",
    title: "Ear Training",
    description:
      "Train yourself to recognise intervals, notes, chords and rhythms through focused listening exercises.",
    href: "/ear-training",
    type: "ear",
    status: "Start training",
  },
  {
    number: "05",
    title: "Practice Suite",
    description:
      "Build routines, use practice tools, track progress and stay consistent with small achievable goals.",
    href: "/practice",
    type: "practice",
    status: "Open suite",
  },
];

const particles = [
  { left: "7%", top: "18%", size: 2, delay: 0.2, duration: 8 },
  { left: "14%", top: "74%", size: 3, delay: 1.1, duration: 10 },
  { left: "28%", top: "29%", size: 2, delay: 0.7, duration: 9 },
  { left: "38%", top: "84%", size: 2, delay: 1.6, duration: 11 },
  { left: "53%", top: "17%", size: 3, delay: 0.9, duration: 9 },
  { left: "65%", top: "69%", size: 2, delay: 1.4, duration: 10 },
  { left: "78%", top: "25%", size: 2, delay: 0.4, duration: 8 },
  { left: "88%", top: "78%", size: 3, delay: 1.8, duration: 11 },
  { left: "94%", top: "42%", size: 2, delay: 0.6, duration: 9 },
];

function MusicLogo() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.055] shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute h-6 w-6 rounded-full border border-purple-300/30 border-r-blue-300/80"
      />

      <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M10 5H6.8A1.8 1.8 0 0 0 5 6.8v10.4A1.8 1.8 0 0 0 6.8 19H10M14 8l4 4-4 4M18 12H9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChordAnimation() {
  const notes = ["C", "E", "G"];

  return (
    <div className="relative flex h-36 items-center justify-center overflow-hidden">
      <motion.div
        animate={{ opacity: [0.25, 0.7, 0.25], scaleX: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-px w-[75%] bg-gradient-to-r from-transparent via-purple-300/60 to-transparent"
      />

      {notes.map((note, index) => (
        <motion.div
          key={note}
          animate={{
            y: [0, -10, 0],
            rotate: [0, index % 2 === 0 ? 4 : -4, 0],
            boxShadow: [
              "0 0 0 rgba(192,132,252,0)",
              "0 0 28px rgba(192,132,252,0.34)",
              "0 0 0 rgba(192,132,252,0)",
            ],
          }}
          transition={{
            duration: 2.6,
            delay: index * 0.28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-300/20 bg-purple-400/10 text-sm font-semibold text-purple-100 backdrop-blur-xl"
          style={{ left: `${18 + index * 31}%` }}
        >
          {note}
        </motion.div>
      ))}
    </div>
  );
}

function InstrumentAnimation() {
  return (
    <div className="relative flex h-36 items-center justify-center">
      <div className="relative flex h-[82px] w-[82%] items-end overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((key) => (
          <motion.div
            key={key}
            animate={{
              y: [0, key % 3 === 0 ? 8 : 2, 0],
              backgroundColor: [
                "rgba(255,255,255,0.88)",
                key % 3 === 0
                  ? "rgba(216,180,254,0.95)"
                  : "rgba(255,255,255,0.88)",
                "rgba(255,255,255,0.88)",
              ],
            }}
            transition={{
              duration: 2,
              delay: key * 0.12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mx-[2px] h-16 flex-1 rounded-b-md border border-black/30"
          />
        ))}
      </div>

      <motion.div
        animate={{ opacity: [0.2, 0.8, 0.2], scaleX: [0.55, 1, 0.55] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-3 h-px w-[68%] bg-blue-300/70 blur-[1px]"
      />
    </div>
  );
}

function HarmonyAnimation() {
  const points = [
    { left: "12%", top: "58%" },
    { left: "38%", top: "26%" },
    { left: "64%", top: "65%" },
    { left: "87%", top: "31%" },
  ];

  return (
    <div className="relative h-36 w-full">
      <svg
        viewBox="0 0 300 140"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <motion.path
          d="M35 81 L114 37 L192 91 L261 44"
          fill="none"
          stroke="rgba(192,132,252,0.58)"
          strokeWidth="2"
          strokeDasharray="6 7"
          animate={{ strokeDashoffset: [0, -26], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {points.map((point, index) => (
        <motion.div
          key={`${point.left}-${point.top}`}
          animate={{
            scale: [1, 1.35, 1],
            boxShadow: [
              "0 0 0 rgba(192,132,252,0)",
              "0 0 25px rgba(192,132,252,0.75)",
              "0 0 0 rgba(192,132,252,0)",
            ],
          }}
          transition={{
            duration: 2.4,
            delay: index * 0.34,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-3 w-3 rounded-full border border-purple-100 bg-purple-300"
          style={point}
        />
      ))}
    </div>
  );
}

function EarAnimation() {
  const bars = [20, 42, 68, 38, 76, 48, 30, 64, 34];

  return (
    <div className="relative flex h-36 items-center justify-center gap-2">
      {bars.map((height, index) => (
        <motion.div
          key={`${height}-${index}`}
          animate={{
            height: [`${Math.max(height - 15, 12)}%`, `${height}%`, "18%"],
            opacity: [0.45, 1, 0.45],
          }}
          transition={{
            duration: 1.4 + (index % 3) * 0.25,
            delay: index * 0.08,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="w-1.5 rounded-full bg-gradient-to-t from-blue-500/30 via-blue-300 to-purple-200 shadow-[0_0_14px_rgba(147,197,253,0.25)]"
        />
      ))}

      <div className="absolute h-px w-[78%] bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />
    </div>
  );
}

function PracticeAnimation() {
  return (
    <div className="relative flex h-36 items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute h-24 w-24 rounded-full border border-dashed border-purple-300/15"
      />

      <div className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white/[0.03]">
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
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="7"
          />

          <motion.circle
            cx="50"
            cy="50"
            r="43"
            fill="none"
            stroke="rgba(192,132,252,0.92)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="270"
            animate={{ strokeDashoffset: [270, 72, 270] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        <motion.span
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.97, 1.05, 0.97] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs font-semibold text-purple-100"
        >
          72%
        </motion.span>
      </div>
    </div>
  );
}

function ToolAnimation({ type }: { type: ToolType }) {
  if (type === "chords") return <ChordAnimation />;
  if (type === "instruments") return <InstrumentAnimation />;
  if (type === "harmony") return <HarmonyAnimation />;
  if (type === "ear") return <EarAnimation />;

  return <PracticeAnimation />;
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const smoothRotateX = useSpring(rotateX, {
    stiffness: 180,
    damping: 24,
  });

  const smoothRotateY = useSpring(rotateY, {
    stiffness: 180,
    damping: 24,
  });

  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x}% ${y}%, rgba(168,85,247,0.16), transparent 48%)`,
  );

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    const percentX = (x / bounds.width) * 100;
    const percentY = (y / bounds.height) * 100;

    glowX.set(percentX);
    glowY.set(percentY);

    rotateY.set(((x / bounds.width) - 0.5) * 5);
    rotateX.set(-((y / bounds.height) - 0.5) * 5);
  };

  const resetCard = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{
        opacity: 0,
        y: 55,
        scale: 0.96,
        filter: "blur(12px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.8,
        delay: 0.18 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetCard}
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformPerspective: 1000,
      }}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] backdrop-blur-2xl transition-[border-color,background-color,box-shadow] duration-500 hover:border-purple-300/30 hover:bg-white/[0.07] hover:shadow-[0_35px_120px_rgba(126,34,206,0.18)] ${
        index < 3 ? "lg:col-span-2" : "lg:col-span-3"
      }`}
    >
      <motion.div
        style={{ background: glowBackground }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.045] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-500/0 blur-[80px] transition-colors duration-700 group-hover:bg-purple-500/20" />

      <Link
        href={tool.href}
        className="relative block min-h-[400px] p-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 sm:p-8"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.35em] text-purple-300/50">
            {tool.number}
          </span>

          <motion.span
            initial={{ x: -4, y: 4 }}
            whileHover={{ x: 2, y: -2 }}
            className="text-neutral-500 transition-colors group-hover:text-purple-200"
          >
            <ArrowIcon />
          </motion.span>
        </div>

        <div className="mt-2">
          <ToolAnimation type={tool.type} />
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-white transition-colors group-hover:text-purple-50">
            {tool.title}
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-neutral-400">
            {tool.description}
          </p>

          <div className="mt-7 flex items-center gap-2 text-xs font-medium text-neutral-500 transition-colors group-hover:text-purple-200">
            <span>{tool.status}</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.span>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-300 to-transparent transition-all duration-700 group-hover:w-[75%]" />
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setUser(session.user);
      setCheckingSession(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
        return;
      }

      setUser(session.user);
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = page.getBoundingClientRect();

      const relativeX =
        (event.clientX - bounds.left) / bounds.width - 0.5;
      const relativeY =
        (event.clientY - bounds.top) / bounds.height - 0.5;

      mouseX.set(relativeX * 45);
      mouseY.set(relativeY * 30);
    };

    const reset = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    page.addEventListener("mousemove", handleMouseMove);
    page.addEventListener("mouseleave", reset);

    return () => {
      page.removeEventListener("mousemove", handleMouseMove);
      page.removeEventListener("mouseleave", reset);
    };
  }, [mouseX, mouseY]);

  const handleLogout = async () => {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoggingOut(false);
      alert(error.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  };

  const displayName = useMemo(() => {
    return (
      user?.user_metadata?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "Musician"
    );
  }, [user]);

  const firstName = displayName.split(" ")[0];

  const initials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (checkingSession) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[150px]"
        />

        <div className="relative text-center">
          <MusicLogo />

          <motion.p
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="mt-5 text-sm text-neutral-400"
          >
            Preparing your space
          </motion.p>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={pageRef}
      className="relative isolate min-h-screen overflow-hidden bg-black text-white"
    >
      <div className="pointer-events-none fixed inset-0 -z-50 bg-black" />

      <div className="pointer-events-none fixed inset-0 -z-30 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

      <motion.div
        style={{ x: smoothX, y: smoothY }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed left-[35%] top-[20%] -z-40 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-purple-600/18 blur-[180px]"
      />

      <motion.div
        animate={{
          x: [60, -40, 60],
          y: [-30, 50, -30],
          scale: [0.95, 1.1, 0.95],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed right-[-8%] top-[10%] -z-40 h-[430px] w-[430px] rounded-full bg-blue-500/12 blur-[150px]"
      />

      <motion.div
        animate={{
          x: [-50, 30, -50],
          y: [20, -45, 20],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed bottom-[-15%] left-[10%] -z-40 h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-[170px]"
      />

      <div className="pointer-events-none fixed inset-0 -z-20">
        {particles.map((particle, index) => (
          <motion.span
            key={`${particle.left}-${particle.top}`}
            animate={{
              opacity: [0, 0.75, 0],
              y: [30, -25, -75],
              x: [0, index % 2 === 0 ? 12 : -12, 0],
              scale: [0.7, 1.15, 0.8],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-purple-100 shadow-[0_0_16px_rgba(216,180,254,0.9)]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-black/35 backdrop-blur-3xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/app" className="group flex items-center gap-3">
            <MusicLogo />

            <div>
              <p className="text-sm font-semibold tracking-[-0.02em]">
                Music Space
              </p>
              <p className="text-[9px] tracking-[0.18em] text-neutral-600">
                PERSONAL STUDIO
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.035] p-1 backdrop-blur-xl md:flex">
  <Link
    href="/app"
    className="rounded-full bg-white/[0.08] px-5 py-2 text-xs font-medium text-white"
  >
    Home
  </Link>

  <Link
    href="/app/bandspace"
    className="rounded-full px-5 py-2 text-xs font-medium text-neutral-500 transition hover:bg-white/[0.055] hover:text-white"
  >
    BandSpace
  </Link>
</nav>

<div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              className="group flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] py-1.5 pl-2 pr-3 backdrop-blur-xl transition hover:border-purple-300/25 hover:bg-white/[0.065]"
              aria-expanded={profileOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-300/20 bg-gradient-to-br from-purple-500/30 to-blue-500/20 text-[10px] font-semibold text-purple-100">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[130px] truncate text-xs font-medium">
                  {displayName}
                </p>
                <p className="max-w-[130px] truncate text-[10px] text-neutral-600">
                  {user?.email}
                </p>
              </div>

              <motion.svg
                animate={{ rotate: profileOpen ? 180 : 0 }}
                viewBox="0 0 20 20"
                fill="none"
                className="h-3.5 w-3.5 text-neutral-500"
              >
                <path
                  d="m6 8 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.96,
                      filter: "blur(8px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.96,
                      filter: "blur(8px)",
                    }}
                    transition={{
                      duration: 0.24,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/85 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl"
                  >
                    <div className="border-b border-white/[0.07] p-3">
                      <p className="truncate text-sm font-medium">
                        {displayName}
                      </p>
                      <p className="mt-1 truncate text-xs text-neutral-500">
                        {user?.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-neutral-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogoutIcon />
                      {loggingOut ? "Logging out..." : "Log out"}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.4rem] border border-white/[0.08] bg-white/[0.035] px-7 py-12 shadow-[0_35px_130px_rgba(0,0,0,0.38)] backdrop-blur-3xl sm:px-10 sm:py-16 lg:px-14"
        >
          <motion.div
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -20, 18, 0],
              scale: [1, 1.1, 0.96, 1],
            }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-purple-500/20 blur-[100px]"
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.035)_50%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_9s_linear_infinite]" />

          <div className="relative max-w-4xl">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.32em" }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-[10px] uppercase text-purple-300/65 sm:text-xs"
            >
              your music space
            </motion.p>

            <h1 className="mt-6 text-4xl font-bold tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Welcome back,{" "}
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-purple-200 via-blue-300 to-purple-300 bg-[length:200%_200%] bg-clip-text text-transparent"
              >
                {firstName}.
              </motion.span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-400 sm:text-lg">
              Everything you need to explore chords, develop your ears,
              practise consistently and turn small musical ideas into something
              real.
            </p>

            <motion.a
              href="/app/bandspace"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group relative mt-9 inline-flex items-center gap-3 overflow-hidden rounded-full bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(126,34,206,0.28)] transition hover:bg-purple-500 hover:shadow-[0_18px_65px_rgba(168,85,247,0.4)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Explore BandSpace</span>
             <motion.svg
  animate={{ x: [0, 4, 0] }}
  transition={{ duration: 1.7, repeat: Infinity }}
  viewBox="0 0 24 24"
  fill="none"
  className="relative h-5 w-5"
>
  <path
    d="M7 12h10M13 6l6 6-6 6"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</motion.svg>
            </motion.a>
          </div>
        </motion.section>

        <section id="tools" className="scroll-mt-28 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-purple-300/60 sm:text-xs">
                built for making progress
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Pick up where you left off.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-neutral-500">
              Each space is designed to stay focused, useful and easy to return
              to.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {tools.map((tool, index) => (
              <ToolCard key={tool.title} tool={tool} index={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}