"use client";

export default function Navbar() {
  return (
    <nav
      className="
      fixed
      top-6
      left-1/2
      -translate-x-1/2
      z-50

      flex
      items-center
      gap-10

      rounded-full
      border
      border-white/10

      bg-white/5
      backdrop-blur-2xl

      px-8
      py-4

      shadow-2xl
      "
    >
      <h1 className="font-bold tracking-wide">
        Music Station
      </h1>

      <div className="hidden md:flex gap-8 text-sm text-neutral-400">

        <button className="hover:text-white transition">
          Worship
        </button>

        <button className="hover:text-white transition">
          Studio
        </button>

        <button className="hover:text-white transition">
          Band
        </button>

        <button className="hover:text-white transition">
          Library
        </button>

      </div>
    </nav>
  );
}