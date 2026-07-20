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
          emailRedirectTo: `${window.location.origin}/app`,
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
        "Account created! Check your email and confirm your account. After confirmation, you will be taken to your dashboard."
      );
    } catch {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
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
            disabled={loading}
            className="w-full rounded-full bg-purple-600 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-purple-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Creating account..." : "Create account"}
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