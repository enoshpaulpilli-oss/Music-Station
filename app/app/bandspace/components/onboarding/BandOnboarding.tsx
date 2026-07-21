"use client";

import { useState } from "react";

import type { BandMembership } from "@/lib/bandspace";

import { Button } from "../../../components/ui";
import CreateBandForm from "./CreateBandForm";
import JoinBandForm from "./JoinBandForm";

type OnboardingMode =
  | "chooser"
  | "create"
  | "join";

type BandOnboardingProps = {
  onComplete: (
    membership: BandMembership,
  ) => void;
};

export default function BandOnboarding({
  onComplete,
}: BandOnboardingProps) {
  const [mode, setMode] =
    useState<OnboardingMode>("chooser");

  if (mode === "create") {
    return (
      <OnboardingPanel
        eyebrow="Create BandSpace"
        title="Build a home for your band"
        description="Create a shared workspace for your members, songs, setlists, rehearsals, files and future projects."
        onBack={() => setMode("chooser")}
      >
        <CreateBandForm
          onCreated={onComplete}
          onCancel={() =>
            setMode("chooser")
          }
        />
      </OnboardingPanel>
    );
  }

  if (mode === "join") {
    return (
      <OnboardingPanel
        eyebrow="Join BandSpace"
        title="Join your existing team"
        description="Enter the private code provided by a band owner or administrator."
        onBack={() => setMode("chooser")}
      >
        <JoinBandForm
          onJoined={onComplete}
          onCancel={() =>
            setMode("chooser")
          }
        />
      </OnboardingPanel>
    );
  }

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-[110px]" />

        <div className="absolute bottom-[10%] right-[4%] h-80 w-80 rounded-full bg-[var(--accent-soft)] opacity-70 blur-[130px]" />
      </div>

      <div className="relative w-full">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-[var(--accent-ring)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            BandSpace
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-[var(--text-default)] sm:text-5xl lg:text-6xl">
            Your band’s shared workspace
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            Organise your team, prepare
            services, share music and keep
            everyone connected in one place.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          <ChoiceCard
            icon="＋"
            title="Create a band"
            description="Start a new BandSpace and become its owner. You can invite members after it is created."
            actionLabel="Create BandSpace"
            onSelect={() =>
              setMode("create")
            }
            featured
          />

          <ChoiceCard
            icon="→"
            title="Join a band"
            description="Use a private join code to become a member of an existing BandSpace."
            actionLabel="Enter join code"
            onSelect={() =>
              setMode("join")
            }
          />
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[var(--text-subtle)]">
          <FeatureLabel>
            Secure memberships
          </FeatureLabel>

          <FeatureLabel>
            Owner and team roles
          </FeatureLabel>

          <FeatureLabel>
            Private collaboration
          </FeatureLabel>
        </div>
      </div>
    </section>
  );
}

type ChoiceCardProps = {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onSelect: () => void;
  featured?: boolean;
};

function ChoiceCard({
  icon,
  title,
  description,
  actionLabel,
  onSelect,
  featured = false,
}: ChoiceCardProps) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[2rem] border p-6",
        "bg-[var(--surface)] backdrop-blur-3xl",
        "shadow-[0_24px_80px_rgba(0,0,0,0.25)]",
        "transition duration-300",
        "hover:-translate-y-1",
        featured
          ? "border-[var(--accent-ring)]"
          : "border-[var(--border)]",
      ].join(" ")}
    >
      {featured && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      )}

      <div className="relative flex h-full flex-col">
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-2xl border",
            "text-xl font-medium",
            featured
              ? "border-[var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-muted)]",
          ].join(" ")}
          aria-hidden="true"
        >
          {icon}
        </div>

        <h2 className="mt-6 text-xl font-semibold tracking-[-0.025em] text-[var(--text-default)]">
          {title}
        </h2>

        <p className="mt-3 flex-1 text-sm leading-6 text-[var(--text-muted)]">
          {description}
        </p>

        <Button
          type="button"
          variant={
            featured
              ? "primary"
              : "secondary"
          }
          className="mt-7 w-full"
          onClick={onSelect}
        >
          {actionLabel}
        </Button>
      </div>
    </article>
  );
}

type OnboardingPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  onBack: () => void;
  children: React.ReactNode;
};

function OnboardingPanel({
  eyebrow,
  title,
  description,
  onBack,
  children,
}: OnboardingPanelProps) {
  return (
    <section className="relative mx-auto min-h-[calc(100vh-5rem)] w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--accent-soft)] blur-[120px]" />

      <div className="relative">
        <button
          type="button"
          onClick={onBack}
          className={[
            "mb-6 inline-flex items-center gap-2 rounded-xl px-2 py-1",
            "text-sm font-medium text-[var(--text-muted)]",
            "outline-none transition",
            "hover:text-[var(--text-default)]",
            "focus-visible:ring-2",
            "focus-visible:ring-[var(--accent-ring)]",
          ].join(" ")}
        >
          <span aria-hidden="true">
            ←
          </span>

          Back
        </button>

        <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
          <header className="border-b border-[var(--border)] px-6 py-7 sm:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              {eyebrow}
            </span>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[var(--text-default)]">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              {description}
            </p>
          </header>

          <div className="px-6 py-7 sm:px-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
      />

      {children}
    </span>
  );
}

export type {
  BandOnboardingProps,
  OnboardingMode,
};