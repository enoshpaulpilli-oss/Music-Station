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

    // Profile fields are optional. Only validate a field when the user entered something.
    if (preferences.email.trim() && !emailPattern.test(preferences.email)) {
      errors.email = "Enter a valid email.";
    }

    if (
      preferences.username.trim() &&
      preferences.username.trim().length < 3
    ) {
      errors.username = "Username must be at least 3 characters.";
    }

    return errors;
  }, [preferences.email, preferences.username]);

  const canSave =
    isDirty && Object.keys(validationErrors).length === 0 && !saving;

  // Preview appearance changes immediately. Save Changes still persists them.
  useEffect(() => {
    if (loading) return;

    applyThemePreferences({
      theme: preferences.theme,
      accent: preferences.accent,
      reduced_motion: preferences.reduced_motion,
    });
  }, [
    loading,
    preferences.theme,
    preferences.accent,
    preferences.reduced_motion,
  ]);

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
      const localPreferences = {
        ...defaultPreferences,
        theme: localStorage.getItem("music-space-theme") ?? defaultPreferences.theme,
        accent: localStorage.getItem("music-space-accent") ?? defaultPreferences.accent,
        reduced_motion:
          localStorage.getItem("music-space-reduced-motion") === "true",
        density:
          localStorage.getItem("music-space-density") ?? defaultPreferences.density,
        sidebar_behavior:
          localStorage.getItem("music-space-sidebar") ??
          defaultPreferences.sidebar_behavior,
      };

      try {
        const session = await supabase.auth.getSession();
        const user = session.data.session?.user;

        if (!user) {
          setError("Please log in to access settings.");
          setPreferences(localPreferences);
          setInitialPreferences(localPreferences);
          return;
        }

        const fallbackPreferences = {
          ...localPreferences,
          email: user.email ?? "",
        };

        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select(
            "avatar_url, display_name, username, email, theme, accent, density, sidebar_behavior, reduced_motion, notifications_email, notifications_push, privacy_activity_status, privacy_profile_visibility, storage_used, storage_total",
          )
          .eq("id", user.id)
          .maybeSingle();

        if (fetchError) {
          // The app can still use device-local preferences when the optional
          // profiles table has not been created yet.
          console.warn("Cloud preferences unavailable:", fetchError.message);
          setPreferences(fallbackPreferences);
          setInitialPreferences(fallbackPreferences);
          applyThemePreferences({
            theme: fallbackPreferences.theme,
            accent: fallbackPreferences.accent,
            reduced_motion: fallbackPreferences.reduced_motion,
          });
          return;
        }

        const nextPreferences = data
          ? {
              ...fallbackPreferences,
              ...data,
              profile_picture: data.avatar_url ?? "",
              email: data.email ?? user.email ?? "",
            }
          : fallbackPreferences;

        setPreferences(nextPreferences);
        setInitialPreferences(nextPreferences);
        applyThemePreferences({
          theme: nextPreferences.theme,
          accent: nextPreferences.accent,
          reduced_motion: nextPreferences.reduced_motion,
        });
      } catch (loadError) {
        console.error("Failed to load settings:", loadError);
        setPreferences(localPreferences);
        setInitialPreferences(localPreferences);
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
    setToast(null);

    // Always save appearance preferences on this device first.
    applyThemePreferences({
      theme: preferences.theme,
      accent: preferences.accent,
      reduced_motion: preferences.reduced_motion,
    });
    localStorage.setItem("music-space-density", preferences.density);
    localStorage.setItem(
      "music-space-sidebar",
      preferences.sidebar_behavior,
    );

    setInitialPreferences(preferences);
    setIsDirty(false);

    try {
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;

      if (!user) {
        setMessage("Settings saved on this device.");
        setToast({
          type: "success",
          message: "Settings saved on this device.",
        });
        return;
      }

      const updates = {
        id: user.id,
        email: preferences.email || user.email || "",
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
        console.warn("Cloud settings sync unavailable:", upsertError.message);
        setMessage("Settings saved on this device.");
        setToast({
          type: "success",
          message:
            "Settings saved on this device. Cloud sync is not set up yet.",
        });
        return;
      }

      setMessage("Settings saved successfully.");
      setToast({
        type: "success",
        message: "Settings saved successfully.",
      });
    } catch (saveError) {
      console.error("Unable to sync settings:", saveError);
      setMessage("Settings saved on this device.");
      setToast({
        type: "success",
        message:
          "Settings saved on this device. Cloud sync is temporarily unavailable.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--text-default)] transition-colors duration-200">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
          <p className="text-sm text-[var(--text-muted)]">Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--text-default)] transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-3xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
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
                  ? "bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
                  : "bg-white/[0.08] text-[var(--text-default)]/40"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
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
          <section className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
                Account
              </p>
              <h2 className="text-2xl font-semibold">Account settings</h2>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2 text-sm text-[var(--text-muted)]">
                <span>Profile picture URL</span>
                <input
                  value={preferences.profile_picture}
                  onChange={(event) => handleChange("profile_picture", event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 text-[var(--text-default)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                />
              </label>

              <label className="space-y-2 text-sm text-[var(--text-muted)]">
                <span>Display name</span>
                <input
                  value={preferences.display_name}
                  onChange={(event) => handleChange("display_name", event.target.value)}
                  placeholder="Your display name"
                  className="w-full rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 text-[var(--text-default)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                />
                {validationErrors.display_name && (
                  <p className="text-xs text-red-300">{validationErrors.display_name}</p>
                )}
              </label>

              <label className="space-y-2 text-sm text-[var(--text-muted)]">
                <span>Username</span>
                <input
                  value={preferences.username}
                  onChange={(event) => handleChange("username", event.target.value)}
                  placeholder="yourusername"
                  className="w-full rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 text-[var(--text-default)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                />
                {validationErrors.username && (
                  <p className="text-xs text-red-300">{validationErrors.username}</p>
                )}
              </label>

              <label className="space-y-2 text-sm text-[var(--text-muted)]">
                <span>Email</span>
                <input
                  value={preferences.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 text-[var(--text-default)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
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
                  className="rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-[var(--text-default)] transition hover:border-purple-300/25 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resettingPassword ? "Sending reset..." : "Reset password"}
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-[var(--text-default)]/40 transition hover:border-red-300/25 hover:bg-red-500/10 disabled:cursor-not-allowed"
                >
                  Delete account
                </button>
              </div>

              <button
                type="button"
                disabled
                title="Coming soon"
                className="rounded-3xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-[var(--text-default)]/40 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed"
              >
                Export data
              </button>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
                  Appearance
                </p>
                <h2 className="text-2xl font-semibold">Theme preferences</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">Theme</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {themes.map((theme) => (
                      <button
                        type="button"
                        key={theme.value}
                        onClick={() => handleChange("theme", theme.value)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          preferences.theme === theme.value
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-default)] shadow-[0_0_0_1px_var(--accent-ring),0_12px_40px_var(--accent-soft)]"
                            : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-muted)] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="block font-semibold">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">Accent color</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {accents.map((accent) => (
                      <button
                        type="button"
                        key={accent.value}
                        onClick={() => handleChange("accent", accent.value)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          preferences.accent === accent.value
                            ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_14px_40px_var(--accent-soft)]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                        }`}
                      >
                        <span className="flex items-center gap-3 font-semibold">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: `var(--accent-preview-${accent.value}, currentColor)` }}
                          />
                          {accent.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">Density</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {densities.map((density) => (
                      <button
                        type="button"
                        key={density.value}
                        onClick={() => handleChange("density", density.value)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          preferences.density === density.value
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-default)] shadow-[0_0_0_1px_var(--accent-ring),0_12px_40px_var(--accent-soft)]"
                            : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-muted)] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="block font-semibold">{density.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm text-[var(--text-muted)]">Sidebar behaviour</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {sidebarBehaviours.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => handleChange("sidebar_behavior", option.value)}
                        className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                          preferences.sidebar_behavior === option.value
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-default)] shadow-[0_0_0_1px_var(--accent-ring),0_12px_40px_var(--accent-soft)]"
                            : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-muted)] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="block font-semibold">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-4 text-sm transition hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={preferences.reduced_motion}
                    onChange={(event) => handleChange("reduced_motion", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 accent-[var(--accent)] focus:ring-[var(--accent-ring)]"
                  />
                  <span>Reduce motion</span>
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
                  Notifications
                </p>
                <h2 className="text-2xl font-semibold">Notification preferences</h2>
              </div>

              <div className="mt-4 space-y-4">
                <label className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-4 text-sm text-[var(--text-muted)]">
                  <div>
                    <p className="font-semibold text-[var(--text-default)]">Email notifications</p>
                    <p className="text-sm text-[var(--text-subtle)]">Receive updates and alerts by email.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications_email}
                    onChange={(event) => handleChange("notifications_email", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 accent-[var(--accent)] focus:ring-[var(--accent-ring)]"
                  />
                </label>

                <label className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-4 text-sm text-[var(--text-muted)]">
                  <div>
                    <p className="font-semibold text-[var(--text-default)]">Push notifications</p>
                    <p className="text-sm text-[var(--text-subtle)]">Show notification badges in the app.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications_push}
                    onChange={(event) => handleChange("notifications_push", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 accent-[var(--accent)] focus:ring-[var(--accent-ring)]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
                  Privacy
                </p>
                <h2 className="text-2xl font-semibold">Privacy preferences</h2>
              </div>

              <div className="mt-4 space-y-4">
                <label className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-4 text-sm text-[var(--text-muted)]">
                  <div>
                    <p className="font-semibold text-[var(--text-default)]">Activity status</p>
                    <p className="text-sm text-[var(--text-subtle)]">Allow others to see when you are active.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.privacy_activity_status}
                    onChange={(event) => handleChange("privacy_activity_status", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 accent-[var(--accent)] focus:ring-[var(--accent-ring)]"
                  />
                </label>

                <label className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-4 text-sm text-[var(--text-muted)]">
                  <div>
                    <p className="font-semibold text-[var(--text-default)]">Profile visibility</p>
                    <p className="text-sm text-[var(--text-subtle)]">Show your profile to others in your workspace.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.privacy_profile_visibility}
                    onChange={(event) => handleChange("privacy_profile_visibility", event.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-black/70 accent-[var(--accent)] focus:ring-[var(--accent-ring)]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
                  Storage
                </p>
                <h2 className="text-2xl font-semibold">Storage usage</h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] p-5">
                  <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
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

                <p className="text-sm leading-6 text-[var(--text-muted)]">
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