"use client";

import {
  useState,
  type FormEvent,
} from "react";

import { Button } from "../../../components/ui";

import {
  createBand,
  type BandMembership,
  type BandServiceDay,
  type BandVisibility,
} from "@/lib/bandspace";

type CreateBandFormProps = {
  onCreated: (
    membership: BandMembership,
  ) => void;
  onCancel?: () => void;
};

const serviceDays: Array<{
  value: BandServiceDay;
  label: string;
}> = [
  {
    value: "sunday",
    label: "Sunday",
  },
  {
    value: "monday",
    label: "Monday",
  },
  {
    value: "tuesday",
    label: "Tuesday",
  },
  {
    value: "wednesday",
    label: "Wednesday",
  },
  {
    value: "thursday",
    label: "Thursday",
  },
  {
    value: "friday",
    label: "Friday",
  },
  {
    value: "saturday",
    label: "Saturday",
  },
];

export default function CreateBandForm({
  onCreated,
  onCancel,
}: CreateBandFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [genre, setGenre] = useState("");
  const [location, setLocation] =
    useState("");

  const [
    defaultServiceDay,
    setDefaultServiceDay,
  ] = useState<BandServiceDay | "">("");

  const [visibility, setVisibility] =
    useState<BandVisibility>("private");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError(
        "Enter a band name containing at least two characters.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const membership = await createBand({
        name: trimmedName,
        description:
          description.trim(),
        genre: genre.trim(),
        location: location.trim(),
        timezone:
          "Australia/Melbourne",
        defaultServiceDay:
          defaultServiceDay || null,
        visibility,
      });

      onCreated(membership);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The band could not be created. Try again.",
      );

      setSubmitting(false);
    }
  };

  const inputClasses = [
    "h-12 w-full rounded-2xl border px-4",
    "border-[var(--border)]",
    "bg-[var(--background-elevated)]",
    "text-sm text-[var(--text-default)]",
    "placeholder:text-[var(--text-subtle)]",
    "outline-none transition",
    "focus:border-[var(--accent)]",
    "focus:ring-2",
    "focus:ring-[var(--accent-ring)]",
    "disabled:cursor-not-allowed",
    "disabled:opacity-60",
  ].join(" ");

  const labelClasses =
    "mb-2 block text-sm font-medium text-[var(--text-default)]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="band-name"
          className={labelClasses}
        >
          Band name
        </label>

        <input
          id="band-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="For example, Sunday Worship Team"
          autoComplete="organization"
          disabled={submitting}
          className={inputClasses}
          maxLength={80}
          required
        />

        <p className="mt-2 text-xs leading-5 text-[var(--text-subtle)]">
          This is the name members will see
          throughout BandSpace.
        </p>
      </div>

      <div>
        <label
          htmlFor="band-description"
          className={labelClasses}
        >
          Description
          <span className="ml-1 font-normal text-[var(--text-subtle)]">
            optional
          </span>
        </label>

        <textarea
          id="band-description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value,
            )
          }
          placeholder="Tell members what this band or team is for."
          disabled={submitting}
          rows={4}
          maxLength={500}
          className={[
            inputClasses,
            "h-auto min-h-28 resize-y py-3",
          ].join(" ")}
        />

        <div className="mt-2 text-right text-xs text-[var(--text-subtle)]">
          {description.length} / 500
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="band-genre"
            className={labelClasses}
          >
            Genre
            <span className="ml-1 font-normal text-[var(--text-subtle)]">
              optional
            </span>
          </label>

          <input
            id="band-genre"
            type="text"
            value={genre}
            onChange={(event) =>
              setGenre(event.target.value)
            }
            placeholder="Worship, rock, gospel..."
            disabled={submitting}
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="band-location"
            className={labelClasses}
          >
            Location
            <span className="ml-1 font-normal text-[var(--text-subtle)]">
              optional
            </span>
          </label>

          <input
            id="band-location"
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(
                event.target.value,
              )
            }
            placeholder="Melbourne, Australia"
            disabled={submitting}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="service-day"
            className={labelClasses}
          >
            Default service day
          </label>

          <select
            id="service-day"
            value={defaultServiceDay}
            onChange={(event) =>
              setDefaultServiceDay(
                event.target
                  .value as
                  | BandServiceDay
                  | "",
              )
            }
            disabled={submitting}
            className={inputClasses}
          >
            <option value="">
              No default day
            </option>

            {serviceDays.map((day) => (
              <option
                key={day.value}
                value={day.value}
              >
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="band-visibility"
            className={labelClasses}
          >
            Band visibility
          </label>

          <select
            id="band-visibility"
            value={visibility}
            onChange={(event) =>
              setVisibility(
                event.target
                  .value as BandVisibility,
              )
            }
            disabled={submitting}
            className={inputClasses}
          >
            <option value="private">
              Private
            </option>

            <option value="public">
              Public
            </option>
          </select>
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
            name.trim().length < 2
          }
        >
          {submitting
            ? "Creating band..."
            : "Create BandSpace"}
        </Button>
      </div>
    </form>
  );
}

export type { CreateBandFormProps };