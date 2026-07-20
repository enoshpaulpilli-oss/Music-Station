"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        fixed
        left-1/2
        top-5
        z-50
        flex
        w-[94%]
        max-w-7xl
        -translate-x-1/2
        items-center
        justify-between
        rounded-2xl
        border
        border-white/10
        bg-black/25
        px-4
        py-3
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        backdrop-blur-2xl
        sm:px-6
        sm:py-4
      "
    >
      {/* Logo */}
      <button
        type="button"
        onClick={() => scrollToSection("hero")}
        className="
          group
          text-left
          leading-none
          transition
          hover:scale-[1.02]
        "
        aria-label="Scroll to the top of Music Space"
      >
        <h1
          className="
            bg-gradient-to-r
            from-white
            via-purple-200
            to-blue-300
            bg-clip-text
            text-base
            font-bold
            tracking-tight
            text-transparent
            sm:text-lg
          "
        >
          Music Space
        </h1>

        <p
          className="
            mt-1
            text-[9px]
            tracking-[0.2em]
            text-neutral-500
            transition
            group-hover:text-neutral-400
            sm:text-[10px]
            sm:tracking-[0.25em]
          "
        >
          by Enosh Paul
        </p>
      </button>

      {/* Desktop Links */}
      <div className="hidden items-center gap-8 text-sm text-neutral-400 md:flex">
        <button
          type="button"
          onClick={() => scrollToSection("features")}
          className="
            relative
            transition
            hover:text-white
            after:absolute
            after:-bottom-2
            after:left-0
            after:h-px
            after:w-0
            after:bg-purple-400
            after:transition-all
            after:duration-300
            hover:after:w-full
          "
        >
          Features
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("how-it-works")}
          className="
            relative
            transition
            hover:text-white
            after:absolute
            after:-bottom-2
            after:left-0
            after:h-px
            after:w-0
            after:bg-purple-400
            after:transition-all
            after:duration-300
            hover:after:w-full
          "
        >
          How It Works
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/login"
          className="
            hidden
            rounded-full
            border
            border-white/10
            bg-white/5
            px-5
            py-2.5
            text-sm
            text-neutral-200
            backdrop-blur-xl
            transition
            duration-300
            hover:-translate-y-0.5
            hover:border-white/20
            hover:bg-white/10
            hover:text-white
            md:block
          "
        >
          Log In
        </Link>

        <Link
          href="/signup"
          className="
            rounded-full
            bg-purple-600
            px-4
            py-2.5
            text-xs
            font-semibold
            text-white
            shadow-[0_0_30px_rgba(147,51,234,0.25)]
            transition
            duration-300
            hover:-translate-y-0.5
            hover:scale-[1.03]
            hover:bg-purple-500
            hover:shadow-[0_0_40px_rgba(168,85,247,0.45)]
            active:translate-y-0
            active:scale-95
            sm:px-5
            sm:text-sm
          "
        >
          Join Music Space
        </Link>
      </div>
    </motion.nav>
  );
}