import { supabase } from "@/lib/supabase/client";

import type {
  Band,
  BandInvitation,
  BandMember,
  BandMemberProfile,
  BandMembership,
  CreateBandInput,
  CreateBandInvitationInput,
  UpdateBandInput,
} from "./types";

const bandSelection = `
  id,
  name,
  slug,
  description,
  logo_url,
  genre,
  location,
  timezone,
  default_service_day,
  visibility,
  join_code,
  created_by,
  created_at,
  updated_at,
  archived_at
`;

export class BandSpaceError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "BandSpaceError";
    this.code = code;
  }
}

function throwBandSpaceError(error: {
  message?: string;
  code?: string;
}): never {
  throw new BandSpaceError(
    error.message || "Something went wrong in BandSpace.",
    error.code,
  );
}

async function requireCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throwBandSpaceError(error);
  }

  if (!user) {
    throw new BandSpaceError(
      "You must be signed in to use BandSpace.",
      "NOT_AUTHENTICATED",
    );
  }

  return user.id;
}

function normalizeRelation<T>(
  value: T | T[] | null,
): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export async function listMyBands(): Promise<
  BandMembership[]
> {
  const userId = await requireCurrentUserId();

  const { data, error } = await supabase
    .from("band_members")
    .select(
      `
        id,
        band_id,
        user_id,
        role,
        invited_by,
        joined_at,
        band:bands (${bandSelection})
      `,
    )
    .eq("user_id", userId)
    .order("joined_at", { ascending: true });

  if (error) {
    throwBandSpaceError(error);
  }

  return (data ?? []).flatMap((row) => {
    const band = normalizeRelation(
      row.band as Band | Band[] | null,
    );

    if (!band) {
      return [];
    }

    return [
      {
        id: row.id,
        band_id: row.band_id,
        user_id: row.user_id,
        role: row.role,
        invited_by: row.invited_by,
        joined_at: row.joined_at,
        band,
      } as BandMembership,
    ];
  });
}

export async function getBandById(
  bandId: string,
): Promise<Band> {
  const { data, error } = await supabase
    .from("bands")
    .select(bandSelection)
    .eq("id", bandId)
    .single();

  if (error) {
    throwBandSpaceError(error);
  }

  return data as Band;
}

export async function getBandBySlug(
  slug: string,
): Promise<Band> {
  const { data, error } = await supabase
    .from("bands")
    .select(bandSelection)
    .eq("slug", slug)
    .single();

  if (error) {
    throwBandSpaceError(error);
  }

  return data as Band;
}

export async function getMyBandMembership(
  bandId: string,
): Promise<BandMembership> {
  const userId = await requireCurrentUserId();

  const { data, error } = await supabase
    .from("band_members")
    .select(
      `
        id,
        band_id,
        user_id,
        role,
        invited_by,
        joined_at,
        band:bands (${bandSelection})
      `,
    )
    .eq("band_id", bandId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throwBandSpaceError(error);
  }

  const band = normalizeRelation(
    data.band as Band | Band[] | null,
  );

  if (!band) {
    throw new BandSpaceError(
      "Band details could not be loaded.",
    );
  }

  return {
    id: data.id,
    band_id: data.band_id,
    user_id: data.user_id,
    role: data.role,
    invited_by: data.invited_by,
    joined_at: data.joined_at,
    band,
  } as BandMembership;
}

export async function createBand(
  input: CreateBandInput,
): Promise<BandMembership> {
  const userId = await requireCurrentUserId();
  const name = input.name.trim();

  if (name.length < 2) {
    throw new BandSpaceError(
      "Band name must contain at least two characters.",
      "INVALID_BAND_NAME",
    );
  }

  const { data, error } = await supabase
    .from("bands")
    .insert({
      name,
      description: input.description?.trim() ?? "",
      logo_url: input.logoUrl?.trim() || null,
      genre: input.genre?.trim() || null,
      location: input.location?.trim() || null,
      timezone:
        input.timezone?.trim() ||
        "Australia/Melbourne",
      default_service_day:
        input.defaultServiceDay ?? null,
      visibility: input.visibility ?? "private",
      created_by: userId,
    })
    .select(bandSelection)
    .single();

  if (error) {
    throwBandSpaceError(error);
  }

  return getMyBandMembership((data as Band).id);
}

export async function updateBand(
  bandId: string,
  input: UpdateBandInput,
): Promise<Band> {
  const updates: Record<string, unknown> = {};

  if (input.name !== undefined) {
    updates.name = input.name.trim();
  }

  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }

  if (input.logoUrl !== undefined) {
    updates.logo_url = input.logoUrl.trim() || null;
  }

  if (input.genre !== undefined) {
    updates.genre = input.genre.trim() || null;
  }

  if (input.location !== undefined) {
    updates.location =
      input.location.trim() || null;
  }

  if (input.timezone !== undefined) {
    updates.timezone = input.timezone.trim();
  }

  if (input.defaultServiceDay !== undefined) {
    updates.default_service_day =
      input.defaultServiceDay;
  }

  if (input.visibility !== undefined) {
    updates.visibility = input.visibility;
  }

  const { data, error } = await supabase
    .from("bands")
    .update(updates)
    .eq("id", bandId)
    .select(bandSelection)
    .single();

  if (error) {
    throwBandSpaceError(error);
  }

  return data as Band;
}

export async function joinBandByCode(
  joinCode: string,
): Promise<BandMembership> {
  const normalizedCode =
    joinCode.trim().toLowerCase();

  if (!normalizedCode) {
    throw new BandSpaceError(
      "Enter a BandSpace join code.",
      "MISSING_JOIN_CODE",
    );
  }

  const { data, error } = await supabase.rpc(
    "join_band_by_code",
    {
      p_join_code: normalizedCode,
    },
  );

  if (error) {
    throwBandSpaceError(error);
  }

  if (!data) {
    throw new BandSpaceError(
      "BandSpace could not be joined.",
    );
  }

  return getMyBandMembership(data as string);
}

export async function listBandMembers(
  bandId: string,
): Promise<BandMember[]> {
  const { data, error } = await supabase
    .from("band_members")
    .select(
      `
        id,
        band_id,
        user_id,
        role,
        invited_by,
        joined_at,
        profile:profiles!band_members_user_id_fkey (
          id,
          display_name,
          username,
          avatar_url,
          email
        )
      `,
    )
    .eq("band_id", bandId)
    .order("joined_at", { ascending: true });

  if (error) {
    throwBandSpaceError(error);
  }

  return (data ?? []).flatMap((row) => {
    const profile = normalizeRelation(
      row.profile as
        | BandMemberProfile
        | BandMemberProfile[]
        | null,
    );

    if (!profile) {
      return [];
    }

    return [
      {
        id: row.id,
        band_id: row.band_id,
        user_id: row.user_id,
        role: row.role,
        invited_by: row.invited_by,
        joined_at: row.joined_at,
        profile,
      } as BandMember,
    ];
  });
}

export async function createBandInvitation(
  input: CreateBandInvitationInput,
): Promise<BandInvitation> {
  const { data, error } = await supabase.rpc(
    "create_band_invitation",
    {
      p_band_id: input.bandId,
      p_email: input.email.trim().toLowerCase(),
      p_role: input.role ?? "member",
      p_expires_in_days:
        input.expiresInDays ?? 7,
    },
  );

  if (error) {
    throwBandSpaceError(error);
  }

  const invitation = normalizeRelation(
    data as
      | BandInvitation
      | BandInvitation[]
      | null,
  );

  if (!invitation) {
    throw new BandSpaceError(
      "Invitation could not be created.",
    );
  }

  return invitation;
}

export async function acceptBandInvitation(
  token: string,
): Promise<BandMembership> {
  const { data, error } = await supabase.rpc(
    "accept_band_invitation",
    {
      p_token: token.trim(),
    },
  );

  if (error) {
    throwBandSpaceError(error);
  }

  if (!data) {
    throw new BandSpaceError(
      "Invitation could not be accepted.",
    );
  }

  return getMyBandMembership(data as string);
}

export async function leaveBand(
  bandId: string,
): Promise<void> {
  const { error } = await supabase.rpc(
    "leave_band",
    {
      p_band_id: bandId,
    },
  );

  if (error) {
    throwBandSpaceError(error);
  }
}

export async function rotateBandJoinCode(
  bandId: string,
): Promise<string> {
  const { data, error } = await supabase.rpc(
    "rotate_band_join_code",
    {
      p_band_id: bandId,
    },
  );

  if (error) {
    throwBandSpaceError(error);
  }

  if (!data) {
    throw new BandSpaceError(
      "A new join code could not be generated.",
    );
  }

  return data as string;
}