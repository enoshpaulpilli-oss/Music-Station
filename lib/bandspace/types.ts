export type BandRole =
  | "owner"
  | "admin"
  | "leader"
  | "member";

export type BandVisibility =
  | "private"
  | "public";

export type BandInvitationStatus =
  | "pending"
  | "accepted"
  | "revoked"
  | "expired";

export type BandServiceDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type Band = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  genre: string | null;
  location: string | null;
  timezone: string;
  default_service_day: BandServiceDay | null;
  visibility: BandVisibility;
  join_code: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type BandMemberProfile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
};

export type BandMembership = {
  id: string;
  band_id: string;
  user_id: string;
  role: BandRole;
  invited_by: string | null;
  joined_at: string;
  band: Band;
};

export type BandMember = {
  id: string;
  band_id: string;
  user_id: string;
  role: BandRole;
  invited_by: string | null;
  joined_at: string;
  profile: BandMemberProfile;
};

export type BandInvitation = {
  id: string;
  band_id: string;
  email: string;
  role: Exclude<BandRole, "owner">;
  token: string;
  status: BandInvitationStatus;
  invited_by: string;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

export type CreateBandInput = {
  name: string;
  description?: string;
  logoUrl?: string;
  genre?: string;
  location?: string;
  timezone?: string;
  defaultServiceDay?: BandServiceDay | null;
  visibility?: BandVisibility;
};

export type UpdateBandInput = Partial<
  Omit<CreateBandInput, "name"> & {
    name: string;
  }
>;

export type CreateBandInvitationInput = {
  bandId: string;
  email: string;
  role?: Exclude<BandRole, "owner">;
  expiresInDays?: number;
};