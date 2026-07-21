"use client";

type SetlistSong = {
  id: string;
  title: string;
  artist?: string | null;
  key?: string | null;
  duration?: string | null;
};

type SetlistPreviewProps = {
  name?: string | null;
  serviceName?: string | null;
  songs?: SetlistSong[];
  onOpenSetlist?: () => void;
  onCreateSetlist?: () => void;
};

export default function SetlistPreview({
  name = null,
  serviceName = null,
  songs = [],
  onOpenSetlist,
  onCreateSetlist,
}: SetlistPreviewProps) {
  const hasSetlist =
    Boolean(name) || songs.length > 0;

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur-3xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Music plan
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-default)]">
            Current setlist
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Review the songs prepared for your
            next service.
          </p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
          ≡
        </span>
      </div>

      {hasSetlist ? (
        <>
          <div className="mt-5 rounded-3xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              {serviceName || "Upcoming service"}
            </p>

            <h3 className="mt-2 truncate text-lg font-semibold text-[var(--text-default)]">
              {name || "Untitled setlist"}
            </h3>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {songs.length}{" "}
              {songs.length === 1
                ? "song"
                : "songs"}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {songs.slice(0, 5).map(
              (song, index) => (
                <article
                  key={song.id}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background-elevated)] text-xs font-semibold text-[var(--text-subtle)]">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text-default)]">
                      {song.title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-[var(--text-subtle)]">
                      {song.artist ||
                        "Artist not added"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {song.key && (
                      <span className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-2.5 py-1 text-[10px] font-semibold text-[var(--accent)]">
                        {song.key}
                      </span>
                    )}

                    {song.duration && (
                      <span className="hidden text-xs text-[var(--text-subtle)] sm:inline">
                        {song.duration}
                      </span>
                    )}
                  </div>
                </article>
              ),
            )}
          </div>

          {songs.length > 5 && (
            <p className="mt-3 text-center text-xs text-[var(--text-subtle)]">
              +{songs.length - 5} more songs
            </p>
          )}

          {onOpenSetlist && (
            <button
              type="button"
              onClick={onOpenSetlist}
              className="mt-5 flex h-11 w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--text-default)] transition hover:border-[var(--accent-ring)] hover:bg-[var(--accent-soft)]"
            >
              Open setlist
            </button>
          )}
        </>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] px-5 py-9 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
            ≡
          </div>

          <h3 className="mt-4 text-sm font-semibold text-[var(--text-default)]">
            No setlist created
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--text-muted)]">
            Create a setlist to organise songs
            for your next service.
          </p>

          {onCreateSetlist && (
            <button
              type="button"
              onClick={onCreateSetlist}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Create setlist
            </button>
          )}
        </div>
      )}
    </section>
  );
}