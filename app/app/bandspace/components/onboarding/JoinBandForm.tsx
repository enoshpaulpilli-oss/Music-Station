"use client";

import {
  useState,
  type FormEvent,
} from "react";

import { Button } from "../../../components/ui";

import {
  requestBandJoinByCode,
  type BandJoinRequestResult,
  type BandMembership,
} from "@/lib/bandspace";

type JoinBandFormProps = {
  onJoined: (
    membership: BandMembership,
  ) => void;
  onCancel?: () => void;
};

export default function JoinBandForm({
  onCancel,
}: JoinBandFormProps) {
  const [joinCode, setJoinCode] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [request, setRequest] =
    useState<BandJoinRequestResult | null>(
      null,
    );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submitting || request) {
      return;
    }

    const normalizedCode =
      joinCode.trim();

    if (!normalizedCode) {
      setError(
        "Enter the BandSpace join code.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const createdRequest =
        await requestBandJoinByCode(
          normalizedCode,
        );

      setRequest(createdRequest);
      setJoinCode("");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The join request could not be sent. Check the code and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (request) {
    return (
      <div className="space-y-5">
        <div className="rounded-[2rem] border border-[var(--accent-ring)] bg-[var(--accent-soft)] px-6 py-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--surface)] text-2xl text-[var(--accent)]">
            ✓
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Request sent
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[var(--text-default)]">
            Waiting for approval
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
            Your request to join{" "}
            <span className="font-semibold text-[var(--text-default)]">
              {request.band_name}
            </span>{" "}
            was sent to the band owner and
            administrators.
          </p>

          <p className="mt-3 text-xs leading-5 text-[var(--text-subtle)]">
            You will receive a notification
            after they approve or decline it.
          </p>
        </div>

        {onCancel && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="band-join-code"
          className="mb-2 block text-sm font-medium text-[var(--text-default)]"
        >
          BandSpace join code
        </label>

        <input
          id="band-join-code"
          type="text"
          value={joinCode}
          onChange={(event) => {
            setJoinCode(
              event.target.value,
            );

            if (error) {
              setError(null);
            }
          }}
          placeholder="Enter the code shared by your band"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          disabled={submitting}
          required
          className={[
            "h-12 w-full rounded-2xl border px-4",
            "border-[var(--border)]",
            "bg-[var(--background-elevated)]",
            "font-mono text-sm tracking-[0.12em]",
            "text-[var(--text-default)]",
            "placeholder:font-sans",
            "placeholder:tracking-normal",
            "placeholder:text-[var(--text-subtle)]",
            "outline-none transition",
            "focus:border-[var(--accent)]",
            "focus:ring-2",
            "focus:ring-[var(--accent-ring)]",
            "disabled:cursor-not-allowed",
            "disabled:opacity-60",
          ].join(" ")}
        />

        <p className="mt-2 text-xs leading-5 text-[var(--text-subtle)]">
          Ask a band owner or administrator
          to share their private join code
          with you.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={[
              "mt-0.5 flex h-7 w-7 shrink-0",
              "items-center justify-center",
              "rounded-lg",
              "bg-[var(--accent-soft)]",
              "text-sm text-[var(--accent)]",
            ].join(" ")}
          >
            🔒
          </span>

          <div>
            <p className="text-sm font-medium text-[var(--text-default)]">
              Approval is required
            </p>

            <p className="mt-1 text-xs leading-5 text-[var(--text-subtle)]">
              Entering a valid code sends a
              request. You will not enter the
              BandSpace until an owner or
              administrator approves it.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className={[
            "rounded-2xl border px-4 py-3",
            "border-red-500/25",
            "bg-red-500/10",
            "text-sm text-red-300",
          ].join(" ")}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          loading={submitting}
          disabled={
            submitting ||
            !joinCode.trim()
          }
        >
          {submitting
            ? "Sending request..."
            : "Request to join"}
        </Button>
      </div>
    </form>
  );
}

export type { JoinBandFormProps };