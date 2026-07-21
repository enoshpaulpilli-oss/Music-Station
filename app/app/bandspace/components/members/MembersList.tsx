"use client";

import {
  useMemo,
  useState,
} from "react";

import MemberCard from "./MemberCard";

export type BandMemberRole =
  | "owner"
  | "admin"
  | "leader"
  | "member";

export type BandMemberListItem = {
  id: string;
  userId: string;
  name: string;
  email?: string | null;
  role: BandMemberRole;
  avatarUrl?: string | null;
  isCurrentUser?: boolean;
};

type MembersListProps = {
  members: BandMemberListItem[];
  currentUserRole: BandMemberRole | string;
  loading?: boolean;
  updatingMemberId?: string | null;
  onInviteMember: () => void;
  onRoleChange?: (
    memberId: string,
    role: BandMemberRole,
  ) => void;
  onRemoveMember?: (
    memberId: string,
  ) => void;
};

type RoleFilter =
  | "all"
  | BandMemberRole;

const roleOptions: Array<{
  value: RoleFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "All roles",
  },
  {
    value: "owner",
    label: "Owners",
  },
  {
    value: "admin",
    label: "Admins",
  },
  {
    value: "leader",
    label: "Leaders",
  },
  {
    value: "member",
    label: "Members",
  },
];

function canManageMembers(
  role: string,
) {
  return (
    role === "owner" ||
    role === "admin"
  );
}

function countRole(
  members: BandMemberListItem[],
  role: BandMemberRole,
) {
  return members.filter(
    (member) => member.role === role,
  ).length;
}

export default function MembersList({
  members,
  currentUserRole,
  loading = false,
  updatingMemberId = null,
  onInviteMember,
  onRoleChange,
  onRemoveMember,
}: MembersListProps) {
  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("all");

  const canManage =
    canManageMembers(currentUserRole);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return members.filter((member) => {
      const matchesRole =
        roleFilter === "all" ||
        member.role === roleFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        member.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        member.email
          ?.toLowerCase()
          .includes(normalizedSearch);

      return matchesRole && matchesSearch;
    });
  }, [
    members,
    roleFilter,
    search,
  ]);

  if (loading) {
    return <MembersLoading />;
  }

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Band team
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-default)]">
            Members
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            View everyone in this BandSpace
            and manage their access and
            responsibilities.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={onInviteMember}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"
          >
            <span className="text-lg">
              +
            </span>

            Invite member
          </button>
        )}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MemberStat
          label="Total members"
          value={members.length}
        />

        <MemberStat
          label="Owners and admins"
          value={
            countRole(members, "owner") +
            countRole(members, "admin")
          }
        />

        <MemberStat
          label="Leaders"
          value={countRole(
            members,
            "leader",
          )}
        />

        <MemberStat
          label="Members"
          value={countRole(
            members,
            "member",
          )}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 backdrop-blur-3xl sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">
            Search band members
          </span>

          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-subtle)]">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search members"
            className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] pl-10 pr-4 text-sm text-[var(--text-default)] outline-none transition placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
          />
        </label>

        <label>
          <span className="sr-only">
            Filter members by role
          </span>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target
                  .value as RoleFilter,
              )
            }
            className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 text-sm text-[var(--text-default)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)] sm:w-44"
          >
            {roleOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <div className="mt-5 space-y-3">
        {filteredMembers.length > 0 ? (
          filteredMembers.map(
            (member) => (
              <MemberCard
                key={member.id}
                name={member.name}
                email={member.email}
                role={member.role}
                avatarUrl={
                  member.avatarUrl
                }
                isCurrentUser={
                  member.isCurrentUser
                }
                canManage={
                  canManage
                }
                updating={
                  updatingMemberId ===
                  member.id
                }
                onRoleChange={
                  onRoleChange
                    ? (role) =>
                        onRoleChange(
                          member.id,
                          role,
                        )
                    : undefined
                }
                onRemove={
                  onRemoveMember
                    ? () =>
                        onRemoveMember(
                          member.id,
                        )
                    : undefined
                }
              />
            ),
          )
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-xl text-[var(--accent)]">
              ◎
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[var(--text-default)]">
              No members found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              Try changing your search or
              role filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function MemberStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-subtle)]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-default)]">
        {value}
      </p>
    </article>
  );
}

function MembersLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded-full bg-[var(--surface-strong)]" />

      <div className="mt-3 h-10 w-56 rounded-2xl bg-[var(--surface-strong)]" />

      <div className="mt-3 h-5 w-full max-w-xl rounded-xl bg-[var(--surface-strong)]" />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-3xl bg-[var(--surface)]"
          />
        ))}
      </div>

      <div className="mt-6 h-20 rounded-3xl bg-[var(--surface)]" />

      <div className="mt-5 space-y-3">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-3xl bg-[var(--surface)]"
          />
        ))}
      </div>
    </div>
  );
}