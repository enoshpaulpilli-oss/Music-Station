"use client";

type StorageCardProps = {
  usedBytes?: number;
  totalBytes?: number;
  fileCount?: number;
  onOpenFiles?: () => void;
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 MB";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value =
    bytes / Math.pow(1024, unitIndex);

  return `${value.toFixed(
    value >= 10 || unitIndex === 0 ? 0 : 1,
  )} ${units[unitIndex]}`;
}

export default function StorageCard({
  usedBytes = 0,
  totalBytes = 1024 * 1024 * 1024,
  fileCount = 0,
  onOpenFiles,
}: StorageCardProps) {
  const safeTotalBytes = Math.max(
    totalBytes,
    1,
  );

  const percentage = Math.min(
    100,
    Math.max(
      0,
      (usedBytes / safeTotalBytes) * 100,
    ),
  );

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur-3xl sm:p-6">
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-[80px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Band resources
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-default)]">
              File storage
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Store charts, recordings,
              documents and shared resources.
            </p>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
            ▱
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-default)]">
                {formatBytes(usedBytes)}
              </p>

              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                of {formatBytes(totalBytes)} used
              </p>
            </div>

            <p className="text-sm font-semibold text-[var(--accent)]">
              {percentage.toFixed(0)}%
            </p>
          </div>

          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--background-elevated)]"
            role="progressbar"
            aria-label="BandSpace storage used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(
              percentage,
            )}
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text-default)]">
              {fileCount}{" "}
              {fileCount === 1
                ? "shared file"
                : "shared files"}
            </p>

            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              Available to BandSpace members
            </p>
          </div>

          <span className="text-xl text-[var(--accent)]">
            ▱
          </span>
        </div>

        {onOpenFiles && (
          <button
            type="button"
            onClick={onOpenFiles}
            className="mt-5 flex h-11 w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--text-default)] transition hover:border-[var(--accent-ring)] hover:bg-[var(--accent-soft)]"
          >
            Open files
          </button>
        )}
      </div>
    </section>
  );
}