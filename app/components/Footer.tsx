"use client";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07]">
      {/* Very subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 max-w-3xl bg-purple-500/[0.04] blur-[100px]"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-12 text-center sm:px-8 sm:py-14">
        <p className="text-xs leading-relaxed text-white/40 sm:text-sm">
          Built with prayer, passion, and a lot of late nights.
        </p>

        <p className="mt-2 text-xs font-medium leading-relaxed tracking-wide text-white/70 sm:text-sm">
          All glory and honour belong to Jesus Christ.
        </p>

        <div className="mt-7 h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <p className="mt-7 text-[10px] tracking-[0.16em] text-white/25 sm:text-xs">
          © {new Date().getFullYear()} MUSIC SPACE · MADE BY ENOSH PAUL
        </p>
      </div>
    </footer>
  );
}