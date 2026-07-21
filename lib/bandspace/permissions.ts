import type { BandRole } from "./types";

const roleWeight: Record<BandRole, number> = {
  member: 1,
  leader: 2,
  admin: 3,
  owner: 4,
};

export function hasMinimumBandRole(
  role: BandRole | null | undefined,
  minimumRole: BandRole,
) {
  if (!role) return false;

  return roleWeight[role] >= roleWeight[minimumRole];
}

export function canManageBand(
  role: BandRole | null | undefined,
) {
  return hasMinimumBandRole(role, "admin");
}

export function canInviteBandMembers(
  role: BandRole | null | undefined,
) {
  return hasMinimumBandRole(role, "admin");
}

export function canManageBandContent(
  role: BandRole | null | undefined,
) {
  return hasMinimumBandRole(role, "leader");
}

export function canDeleteBand(
  role: BandRole | null | undefined,
) {
  return role === "owner";
}

export function formatBandRole(role: BandRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}