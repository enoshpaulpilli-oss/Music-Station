"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { applyThemePreferences } from "../components/ThemeManager";

const themes = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const accents = [
  { value: "violet", label: "Violet" },
  { value: "blue", label: "Blue" },
  { value: "cyan", label: "Cyan" },
  { value: "emerald", label: "Emerald" },
  { value: "lime", label: "Lime" },
  { value: "amber", label: "Amber" },
  { value: "orange", label: "Orange" },
  { value: "red", label: "Red" },
  { value: "rose", label: "Rose" },
  { value: "pink", label: "Pink" },
  { value: "copper", label: "Copper" },
  { value: "slate", label: "Slate" },
];

const densities = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

const sidebarBehaviours = [
  { value: "expanded", label: "Expanded" },
  { value: "collapsed", label: "Collapsed" },
  { value: "auto", label: "Auto" },
];

const defaultPreferences = {
  profile_picture: "",
  display_name: "",
  username: "",
  email: "",
  theme: "system",
  accent: "violet",
  density: "comfortable",
  sidebar_behavior: "auto",
  reduced_motion: false,
  notifications_email: true,
  notifications_push: true,
  privacy_activity_status: true,
  privacy_profile_visibility: true,
  storage_used: 0,
  storage_total: 5000,
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [preferences, setPreferences] = useState({ ...defaultPreferences });
  const [initialPreferences, setInitialPreferences] = useState({ ...defaultPreferences });
  const [isDirty, setIsDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!preferences.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(preferences.email)) {
      errors.email = "Enter a valid email.";
    }

    if (!preferences.username.trim()) {
      errors.username = "Username is required.";
    } else if (preferences.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!preferences.display_name.trim()) {
      errors.display_name = "Display name is required.";
    }

    return errors;
  }, [preferences]);

  const canSave = isDirty && Object.keys(validationErrors).length === 0 && !saving;

  const handleResetPassword = async () => {
    if (!preferences.email.trim()) {
      setToast({ type: "error", message: "Enter an email address to reset password." });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(preferences.email)) {
      setToast({ type: "error", message: "Enter a valid email address to reset password." });
      return;
    }

    setResettingPassword(true);
    setToast(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(preferences.email);

      if (resetError) {
        setToast({ type: "error", message: resetError.message });
      } else {
        setToast({ type: "success", message: "Password reset email sent." });
      }
    } catch {
      setToast({ type: "error", message: "Unable to send password reset email." });
    } finally {
      setResettingPassword(false);
    }
  };

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const session = await supabase.auth.getSession();
        const user = session.data.session?.user;
        if (!user) {
          setError("Please log in to access settings.");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("avatar_url, display_name, username, email, theme, accent, density, sidebar_behavior, reduced_motion, notifications_email, notifications_push, privacy_activity_status, privacy_profile_visibility, storage_used, storage_total")
          .eq("id", user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        if (data) {
          const nextPreferences = {
            ...defaultPreferences,
            ...data,
            email: data.email ?? user.email ?? "",
          };
          setPreferences(nextPreferences);
          setInitialPreferences(nextPreferences);
          applyThemePreferences({
            theme: nextPreferences.theme,
            accent: nextPreferences.accent,
            reduced_motion: nextPreferences.reduced_motion,
          });
        } else {
          const nextPreferences = {
            ...defaultPreferences,
            email: user.email ?? "",
          };
          setPreferences(nextPreferences);
          setInitialPreferences(nextPreferences);
        }
      } catch {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setPreferences((current) => {
      const next = { ...current, [field]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(initialPreferences));
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;
      if (!user) {
        setError("Please log in to save settings.");
        setSaving(false);
        return;
      }

      const updates = {
        id: user.id,
        email: preferences.email,
        avatar_url: preferences.profile_picture,
        display_name: preferences.display_name,
        username: preferences.username,
        theme: preferences.theme,
        accent: preferences.accent,
        density: preferences.density,
        sidebar_behavior: preferences.sidebar_behavior,
        reduced_motion: preferences.reduced_motion,
        notifications_email: preferences.notifications_email,
        notifications_push: preferences.notifications_push,
        privacy_activity_status: preferences.privacy_activity_status,
        privacy_profile_visibility: preferences.privacy_profile_visibility,
        storage_used: preferences.storage_used,
        storage_total: preferences.storage_total,
      };

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: "id" });

      if (upsertError) {
        setError(upsertError.message);
        setToast({ type: "error", message: upsertError.message });
      } else {
        setMessage("Settings saved successfully.");
        setToast({ type: "success", message: "Settings saved successfully." });
        setInitialPreferences(preferences);
        setIsDirty(false);
        applyThemePreferences({
          theme: preferences.theme,
          accent: preferences.accent,
          reduced_motion: preferences.reduced_motion,
        });
      }
    } catch {
      setError("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
          <p className="text-sm text-neutral-400">Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-3xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-purple-300/70">
                Settings
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Personal Studio settings
              </h1>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-[0_18px_80px_rgba(126,34,206,0.24)] transition disabled:cursor-not-allowed disabled:opacity-50 ${
                canSave
                  ? "bg-purple-600 text-white hover:bg-purple-500"
                  : "bg-white/[0.08] text-white/40"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400">
            Manage your profile, appearance, notifications, and privacy in one place.
          </p>

          {message && (
            <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          )}

          {toast && (
            <div
              className={`mt-6 rounded-3xl border p-4 text-sm ${
                toast.type === "success"
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                  : "border-red-400/20 bg-red-500/10 text-red-100"
              }`}
            >
              {toast.message}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.32em] text-purple-300/70">
                Account
              </p>
              <h2 className="text-2xl font-semibold">Account settings</h2>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2 text-sm text-neutral-300">
                <span>Profile picture URL</span>
                <input
                  value={preferences.profile_picture}
                  onChange={(event) => handleChange("profile_picture", event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/10"
                />
              </label>

              <label className="space-y-2 text-sm text-neutral-300">
                <span>Display name</span>
                <input
                  value={preferences.display_name}
                  onChange={(event) => handleChange("display_name", event.target.value)}
                  placeholder="Your display name"
                  className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/10"
                />
                {validationErrors.display_name && (
                  <p className="text-xs text-red-300">{validationErrors.display_name}</p>
                )}
              </label>

              <label className="space-y-2 text-sm text-neutral-300">
                <span>Username</span>
                <input
                  value={preferences.username}
                  onChange={(event) => handleChange("username", event.target.value)}
                  placeholder="yourusername"
                  className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/10"
                />
                {validationErrors.username && (
                  <p className="text-xs text-red-300">{validationErrors.username}</p>
                )}
              </label>

              <label className="space-y-2 text-sm text-neutral-300">
                <span>Email</span>
                <input
                  value={preferences.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/10"
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-300">{validationErrors.email}</p>
                )}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resettingPassword}
                  className="rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white transition hover:border-purple-300/25 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resettingPassword ? "Sending reset..." : "Reset password"}
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white/40 transition hover:border-red-300/25 hover:bg-red-500/10 disabled:cursor-not-allowed"
                >
                  Delete account
                </button>
              </div>

              <button
                type="button"
                disabled
                title="Coming soon"
                className="rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white/40 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed"
              >
                Export data
              </button>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.32em] text-purple-300/70">
                  Appearance
                </p>
                <h2 className="text-2xl font-semibold">Theme preferences</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <span className="text-sm text-neutral-300">Theme</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {themes.map((theme) => (
                      <button
                        type="button"
                        key={theme.value}
                        onClick={() => handleChange("theme", theme.value)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          preferences.theme === theme.value
                            ? "border-purple-400/50 bg-purple-500/10 text-white"
                            : "border-white/10 bg-black/40 text-neutral-300 hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="block font-semibold">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm text-neutral-300">Accent color</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {accents.map((accent) => (
                      <button
                        type="button"
                        key={accent.value}
                        onClick={() => handleChange("accent", accent.value)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          preferences.accent === accent.value
                            ? "border-purple-400/50 bg-purple-500/10 text-white"
                            : "border-white/10 bg-black/40 text-neutral-300 hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="block font-semibold">{accent.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm text-neutral-300">Density</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {densities.map((density) => (
                      <button
                        type="button"
                        key={density.value}
                        onClick={() => handleChange("density", density.value)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          preferences.density === density.value
                            ? "border-purple-400/50 bg-purple-500/10 text-white"
                            : "border-white/10 bg-black/40 text-neutral-300 hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="block font-semibold">{density.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm text-neutral-300">Sidebar behaviour</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {sidebarBehaviours.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => handleChange("sidebar_behavior", option.value)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          preferences.sidebar_behavior === option.value
                            ? "border-purple-400/50 bg-purple-500/10 text-white"
                            : "border-white/10 bg-black/40 text-neutral-300 hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="block font-semibold">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm transition hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={preferences.reduced_motion}
                    onChange={(event) => handleChange("reduced_motion", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 text-purple-400 focus:ring-purple-500"
                  />
                  <span>Reduce motion</span>
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.32em] text-purple-300/70">
                  Notifications
                </p>
                <h2 className="text-2xl font-semibold">Notification preferences</h2>
              </div>

              <div className="mt-4 space-y-4">
                <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-neutral-300">
                  <div>
                    <p className="font-semibold text-white">Email notifications</p>
                    <p className="text-sm text-neutral-500">Receive updates and alerts by email.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications_email}
                    onChange={(event) => handleChange("notifications_email", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 text-purple-400 focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-neutral-300">
                  <div>
                    <p className="font-semibold text-white">Push notifications</p>
                    <p className="text-sm text-neutral-500">Show notification badges in the app.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications_push}
                    onChange={(event) => handleChange("notifications_push", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 text-purple-400 focus:ring-purple-500"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.32em] text-purple-300/70">
                  Privacy
                </p>
                <h2 className="text-2xl font-semibold">Privacy preferences</h2>
              </div>

              <div className="mt-4 space-y-4">
                <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-neutral-300">
                  <div>
                    <p className="font-semibold text-white">Activity status</p>
                    <p className="text-sm text-neutral-500">Allow others to see when you are active.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.privacy_activity_status}
                    onChange={(event) => handleChange("privacy_activity_status", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 text-purple-400 focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-neutral-300">
                  <div>
                    <p className="font-semibold text-white">Profile visibility</p>
                    <p className="text-sm text-neutral-500">Show your profile to others in your workspace.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.privacy_profile_visibility}
                    onChange={(event) => handleChange("privacy_profile_visibility", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 text-purple-400 focus:ring-purple-500"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.32em] text-purple-300/70">
                  Storage
                </p>
                <h2 className="text-2xl font-semibold">Storage usage</h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                  <div className="flex items-center justify-between text-sm text-neutral-300">
                    <span>Used</span>
                    <span>{preferences.storage_used} MB</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400"
                      style={{ width: `${Math.min((preferences.storage_used / preferences.storage_total) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm leading-6 text-neutral-400">
                  {preferences.storage_used} MB of {preferences.storage_total} MB used.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
