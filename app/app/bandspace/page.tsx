"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Skeleton,
} from "../components/ui";

import BandOnboarding from "./components/onboarding/BandOnboarding";

import BandShell from "./components/layout/BandShell";

import type { BandSection } from "./components/layout/BandSidebar";

import InviteMemberModal from "./components/members/InviteMemberModal";

import PendingJoinRequests from "./components/members/PendingJoinRequests";

import MembersList, {
  type BandMemberListItem,
  type BandMemberRole,
} from "./components/members/MembersList";

import QuickActions from "./components/overview/QuickActions";
import UpcomingService from "./components/overview/UpcomingService";
import TeamStatus from "./components/overview/TeamStatus";
import SetlistPreview from "./components/overview/SetlistPreview";
import RecentActivity from "./components/overview/RecentActivity";
import StorageCard from "./components/overview/StorageCard";

import {
  listBandMembers,
  listMyBands,
  type BandMembership,
} from "@/lib/bandspace";
import { supabase } from "@/lib/supabase/client";

type PageMode =
  | "workspace"
  | "onboarding";

const validSections: BandSection[] = [
  "overview",
  "songs",
  "setlists",
  "rehearsals",
  "tasks",
  "files",
  "members",
  "chat",
  "settings",
];

function getBandIdFromUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(
    window.location.search,
  ).get("band");
}

function getSectionFromUrl(): BandSection {
  if (typeof window === "undefined") {
    return "overview";
  }

  const requestedSection =
    new URLSearchParams(
      window.location.search,
    ).get("section");

  if (
    requestedSection &&
    validSections.includes(
      requestedSection as BandSection,
    )
  ) {
    return requestedSection as BandSection;
  }

  return "overview";
}

function createBandspaceUrl(
  bandId: string,
  section: BandSection = "overview",
) {
  const parameters =
    new URLSearchParams();

  parameters.set("band", bandId);

  if (section !== "overview") {
    parameters.set("section", section);
  }

  return `/app/bandspace?${parameters.toString()}`;
}

function formatValue(
  value: string | null | undefined,
  fallback: string,
) {
  if (!value) {
    return fallback;
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function normalizeMemberRole(
  role: string,
): BandMemberRole {
  if (
    role === "owner" ||
    role === "admin" ||
    role === "leader" ||
    role === "member"
  ) {
    return role;
  }

  return "member";
}

function canInviteMembers(role: string) {
  return (
    role === "owner" ||
    role === "admin"
  );
}

export default function BandSpacePage() {
  const [
    memberships,
    setMemberships,
  ] = useState<BandMembership[]>([]);

  const [
    activeMembership,
    setActiveMembership,
  ] = useState<BandMembership | null>(
    null,
  );

  const [mode, setMode] =
    useState<PageMode>("workspace");

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<BandSection>("overview");

  const [
    inviteModalOpen,
    setInviteModalOpen,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const [
    members,
    setMembers,
  ] = useState<BandMemberListItem[]>([]);

  const [
    membersLoading,
    setMembersLoading,
  ] = useState(false);

  const [
    membersError,
    setMembersError,
  ] = useState<string | null>(null);

  const loadBands = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const data =
          await listMyBands();

        setMemberships(data);

        if (data.length === 0) {
          setActiveMembership(null);
          setMode("onboarding");
          return;
        }

        const requestedBandId =
          getBandIdFromUrl();

        const selectedMembership =
          data.find(
            (membership) =>
              membership.band_id ===
              requestedBandId,
          ) ??
          data[0] ??
          null;

        setActiveMembership(
          selectedMembership,
        );

        const requestedSection =
          getSectionFromUrl();

        setActiveSection(
          requestedSection,
        );

        setMode("workspace");

        if (
          selectedMembership &&
          requestedBandId !==
            selectedMembership.band_id
        ) {
          window.history.replaceState(
            null,
            "",
            createBandspaceUrl(
              selectedMembership.band_id,
              requestedSection,
            ),
          );
        }
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Your BandSpaces could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadBands();
  }, [loadBands]);

  const loadMembers = useCallback(
    async (bandId: string) => {
      setMembersLoading(true);
      setMembersError(null);

      try {
        const [
          bandMembers,
          {
            data: { user },
          },
        ] = await Promise.all([
          listBandMembers(bandId),
          supabase.auth.getUser(),
        ]);

        setMembers(
          bandMembers.map((member) => ({
            id: member.id,
            userId: member.user_id,
            name:
              member.profile.display_name ||
              member.profile.username ||
              member.profile.email?.split("@")[0] ||
              "Band member",
            email: member.profile.email,
            role: normalizeMemberRole(
              member.role,
            ),
            avatarUrl:
              member.profile.avatar_url,
            isCurrentUser:
              member.user_id === user?.id,
          })),
        );
      } catch (caughtError) {
        setMembers([]);
        setMembersError(
          caughtError instanceof Error
            ? caughtError.message
            : "Band members could not be loaded.",
        );
      } finally {
        setMembersLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const bandId =
      activeMembership?.band_id;

    if (!bandId) {
      setMembers([]);
      setMembersError(null);
      return;
    }

    void loadMembers(bandId);

    const channel = supabase
      .channel(`band-members-${bandId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "band_members",
          filter: `band_id=eq.${bandId}`,
        },
        () => {
          void loadMembers(bandId);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    activeMembership?.band_id,
    loadMembers,
  ]);

  const handleOnboardingComplete = (
    membership: BandMembership,
  ) => {
    window.location.assign(
      createBandspaceUrl(
        membership.band_id,
      ),
    );
  };

  const handleBandChange = (
    bandId: string,
  ) => {
    const membership =
      memberships.find(
        (item) =>
          item.band_id === bandId,
      );

    if (!membership) {
      return;
    }

    setActiveMembership(membership);
    setActiveSection("overview");

    window.history.replaceState(
      null,
      "",
      createBandspaceUrl(
        bandId,
        "overview",
      ),
    );
  };

  const handleSectionChange = (
    section: BandSection,
  ) => {
    if (!activeMembership) {
      return;
    }

    setActiveSection(section);

    window.history.replaceState(
      null,
      "",
      createBandspaceUrl(
        activeMembership.band_id,
        section,
      ),
    );
  };

  const bandOptions = useMemo(
    () =>
      memberships.map(
        (membership) => ({
          id: membership.band_id,
          name: membership.band.name,
        }),
      ),
    [memberships],
  );

  if (loading) {
    return <BandSpaceLoading />;
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-[2rem] border border-red-500/25 bg-[var(--surface)] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            !
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-[var(--text-default)]">
            BandSpace could not load
          </h1>

          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            {error}
          </p>

          <Button
            type="button"
            className="mt-6"
            onClick={() =>
              void loadBands()
            }
          >
            Try again
          </Button>
        </div>
      </main>
    );
  }

  if (
    mode === "onboarding" ||
    !activeMembership
  ) {
    return (
      <div>
        {memberships.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setMode("workspace")
              }
            >
              ← Return to BandSpace
            </Button>
          </div>
        )}

        <BandOnboarding
          onComplete={
            handleOnboardingComplete
          }
        />
      </div>
    );
  }

  const { band, role } =
    activeMembership;

  const inviteAllowed =
    canInviteMembers(role);

  return (
    <>
      <BandShell
        bandName={band.name}
        role={role}
        activeBandId={
          activeMembership.band_id
        }
        bands={bandOptions}
        activeSection={activeSection}
        canInviteMembers={
          inviteAllowed
        }
        onSectionChange={
          handleSectionChange
        }
        onBandChange={
          handleBandChange
        }
        onInviteMember={() =>
          setInviteModalOpen(true)
        }
        onAddBand={() =>
          setMode("onboarding")
        }
      >
        {activeSection ===
          "overview" && (
          <BandOverview
            bandName={band.name}
            description={
              band.description
            }
            role={role}
            visibility={
              band.visibility
            }
            location={band.location}
            defaultServiceDay={
              band.default_service_day
            }
            canInviteMembers={
              inviteAllowed
            }
            onSectionChange={
              handleSectionChange
            }
            onInviteMember={() =>
              setInviteModalOpen(true)
            }
          />
        )}

        {activeSection ===
          "members" && (
          <div className="space-y-6">
            <PendingJoinRequests
              bandId={
                activeMembership.band_id
              }
              currentUserRole={role}
            />

            {membersError ? (
              <section className="rounded-[2rem] border border-red-500/25 bg-[var(--surface)] p-7 text-center backdrop-blur-3xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  !
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[var(--text-default)]">
                  Members could not load
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                  {membersError}
                </p>

                <Button
                  type="button"
                  className="mt-6"
                  onClick={() =>
                    void loadMembers(
                      activeMembership.band_id,
                    )
                  }
                >
                  Try again
                </Button>
              </section>
            ) : (
              <MembersList
                members={members}
                currentUserRole={role}
                loading={membersLoading}
                onInviteMember={() =>
                  setInviteModalOpen(true)
                }
              />
            )}
          </div>
        )}

        {activeSection !==
          "overview" &&
          activeSection !==
            "members" && (
            <SectionPlaceholder
              section={activeSection}
              onReturnHome={() =>
                handleSectionChange(
                  "overview",
                )
              }
            />
          )}
      </BandShell>

      <InviteMemberModal
        open={inviteModalOpen}
        bandName={band.name}
        joinCode={
          band.join_code ||
          "Unavailable"
        }
        onClose={() =>
          setInviteModalOpen(false)
        }
      />
    </>
  );
}

type BandOverviewProps = {
  bandName: string;
  description?: string | null;
  role: string;
  visibility?: string | null;
  location?: string | null;
  defaultServiceDay?: string | null;
  canInviteMembers: boolean;
  onSectionChange: (
    section: BandSection,
  ) => void;
  onInviteMember: () => void;
};

function BandOverview({
  bandName,
  description,
  role,
  visibility,
  location,
  defaultServiceDay,
  canInviteMembers,
  onSectionChange,
  onInviteMember,
}: BandOverviewProps) {
  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--accent-ring)] bg-[var(--surface)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] backdrop-blur-3xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-[100px]" />

        <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--accent-ring)] bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Band Home
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {formatValue(
                  role,
                  "Member",
                )}
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-default)] sm:text-4xl">
              Welcome to {bandName}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              {description ||
                "Your shared home for songs, setlists, rehearsals and your whole band team."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <OverviewDetail
              label="Visibility"
              value={formatValue(
                visibility,
                "Private",
              )}
            />

            <OverviewDetail
              label="Service day"
              value={formatValue(
                defaultServiceDay,
                "Not set",
              )}
            />

            <OverviewDetail
              label="Location"
              value={
                location ||
                "Not added"
              }
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <UpcomingService />

        <QuickActions
          canInviteMembers={
            canInviteMembers
          }
          onSectionChange={
            onSectionChange
          }
          onInviteMember={
            onInviteMember
          }
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SetlistPreview
          onCreateSetlist={() =>
            onSectionChange(
              "setlists",
            )
          }
        />

        <TeamStatus
          onViewMembers={() =>
            onSectionChange(
              "members",
            )
          }
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <RecentActivity />

        <StorageCard
          onOpenFiles={() =>
            onSectionChange("files")
          }
        />
      </div>
    </div>
  );
}

function OverviewDetail({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "min-w-32 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3",
        className,
      ].join(" ")}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-subtle)]">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-semibold text-[var(--text-default)]">
        {value}
      </p>
    </div>
  );
}

function SectionPlaceholder({
  section,
  onReturnHome,
}: {
  section: Exclude<
    BandSection,
    "overview" | "members"
  >;
  onReturnHome: () => void;
}) {
  const content: Record<
    Exclude<
      BandSection,
      "overview" | "members"
    >,
    {
      icon: string;
      title: string;
      description: string;
    }
  > = {
    songs: {
      icon: "♫",
      title: "Songs",
      description:
        "The shared song library will be connected in the next BandSpace feature pack.",
    },
    setlists: {
      icon: "≡",
      title: "Setlists",
      description:
        "Setlist creation and service-order management will appear here.",
    },
    rehearsals: {
      icon: "◷",
      title: "Rehearsals",
      description:
        "Rehearsal scheduling and attendance tools will appear here.",
    },
    tasks: {
      icon: "✓",
      title: "Tasks",
      description:
        "Band assignments and preparation tasks will appear here.",
    },
    files: {
      icon: "▱",
      title: "Files",
      description:
        "Charts, recordings and shared band documents will appear here.",
    },
    chat: {
      icon: "◌",
      title: "Band Chat",
      description:
        "Private BandSpace conversations will appear here.",
    },
    settings: {
      icon: "⚙",
      title: "Band Settings",
      description:
        "Band details, permissions and workspace controls will appear here.",
    },
  };

  const sectionContent =
    content[section];

  return (
    <section className="flex min-h-[65vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center backdrop-blur-3xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-2xl text-[var(--accent)]">
          {sectionContent.icon}
        </div>

        <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[var(--text-default)]">
          {sectionContent.title}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
          {sectionContent.description}
        </p>

        <button
          type="button"
          onClick={onReturnHome}
          className="mt-6 h-11 rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Return to Band Home
        </button>
      </div>
    </section>
  );
}

function BandSpaceLoading() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-14 w-80 max-w-full" />
          <Skeleton className="h-5 w-[34rem] max-w-full" />
        </div>

        <Skeleton className="mt-8 h-64 w-full rounded-[2rem]" />

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-96 rounded-[2rem]" />
          <Skeleton className="h-96 rounded-[2rem]" />
        </div>
      </div>
    </main>
  );
}