"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        setIsError(true);
        setMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/app");
        router.refresh();
        return;
      }

      setMessage(
        "Account created! Check your email and confirm your account."
      );
    } catch {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setMessage("");
    setIsError(false);
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setIsError(true);
        setMessage(error.message);
        setGoogleLoading(false);
      }
    } catch {
      setIsError(true);
      setMessage("Google sign up could not be started. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 py-24 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[170px]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:54px_54px]" />

      <section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 shadow-[0_30px_120px_rgba(0,0,0,0.7)] backdrop-blur-3xl sm:p-9">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.28em] text-neutral-500 transition hover:text-white"
        >
          ← Music Space
        </Link>

        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-purple-300/65">
          Join the space
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em]">
          Create your account
        </h1>

        <p className="mt-4 text-sm leading-6 text-neutral-400">
          Unlock Chord Explorer, Instrument Labs, Harmony Lab, Ear Training and
          Practice Suite.
        </p>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading || loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white px-6 py-3.5 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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

          {googleLoading
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />

          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Or
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Name</span>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-purple-300/40 focus:bg-white/[0.055]"
              placeholder="Enosh Paul"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Email</span>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-purple-300/40 focus:bg-white/[0.055]"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-neutral-400">
              Password
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-purple-300/40 focus:bg-white/[0.055]"
              placeholder="At least 6 characters"
            />
          </label>

          {message && (
            <p
              role={isError ? "alert" : "status"}
              className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                isError
                  ? "border-red-400/20 bg-red-500/10 text-red-200"
                  : "border-green-400/20 bg-green-500/10 text-green-200"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-full bg-purple-600 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-purple-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Creating account..." : "Create account with email"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-purple-300 transition hover:text-purple-200"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}