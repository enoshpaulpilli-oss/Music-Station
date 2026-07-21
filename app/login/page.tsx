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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

      router.replace("/app");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsGoogleLoading(false);
      }
    } catch {
      setErrorMessage("Google login could not be started. Please try again.");
      setIsGoogleLoading(false);
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
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-purple-300">
            Welcome back
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">Log in</h1>

          <p className="mt-3 leading-7 text-neutral-400">
            Continue to your Music Space dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="
            mt-8
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-full
            border
            border-white/15
            bg-white
            px-6
            py-3.5
            font-semibold
            text-black
            transition
            hover:-translate-y-0.5
            hover:bg-neutral-200
            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:hover:translate-y-0
          "
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5Z"
            />
            <path
              fill="#FF3D00"
              d="m6.3 14.7 6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7Z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.8-3.3-11.5-8l-6.5 5C9.3 39.5 16.1 44 24 44Z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.7 7.3l6.2 5.2C39.6 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5Z"
            />
          </svg>

          {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
            disabled={isLoading || isGoogleLoading}
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
            {isLoading ? "Logging in..." : "Log in with email"}
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