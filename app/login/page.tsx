"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace("/app")
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-black
        px-6
        py-16
        text-white
      "
    >
      {/* Background effects */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-600/15
          blur-[160px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.15]
          bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:54px_54px]
          [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]
        "
      />

      <section
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[30px]
          border
          border-white/10
          bg-white/[0.045]
          p-7
          shadow-[0_30px_100px_rgba(0,0,0,0.6)]
          backdrop-blur-2xl
          sm:p-9
        "
      >
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-neutral-400
            transition
            hover:text-white
          "
        >
          <span>←</span>
          <span>Back to Music Space</span>
        </Link>

        <div className="mt-9">
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.25em]
              text-purple-300
            "
          >
            Welcome back
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Log in
          </h1>

          <p className="mt-3 leading-7 text-neutral-400">
            Continue to your Music Space dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/40
                px-4
                py-3.5
                text-white
                outline-none
                transition
                placeholder:text-neutral-600
                focus:border-purple-400/60
                focus:ring-4
                focus:ring-purple-500/10
              "
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/40
                px-4
                py-3.5
                text-white
                outline-none
                transition
                placeholder:text-neutral-600
                focus:border-purple-400/60
                focus:ring-4
                focus:ring-purple-500/10
              "
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="
                rounded-2xl
                border
                border-red-400/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                leading-6
                text-red-200
              "
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="
              mt-2
              flex
              w-full
              items-center
              justify-center
              rounded-full
              bg-purple-600
              px-6
              py-3.5
              font-semibold
              text-white
              shadow-[0_0_35px_rgba(147,51,234,0.25)]
              transition
              hover:-translate-y-0.5
              hover:bg-purple-500
              hover:shadow-[0_0_45px_rgba(168,85,247,0.4)]
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
            "
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-7 h-px bg-white/10" />

        <p className="text-center text-sm text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-purple-300 transition hover:text-purple-200"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}