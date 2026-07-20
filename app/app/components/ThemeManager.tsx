"use client";

import { useEffect } from "react";

type ThemePreferences = {
  theme: string;
  accent: string;
  reduced_motion: boolean;
};

const ACCENT_COLORS: Record<
  string,
  { base: string; hover: string; soft: string; ring: string; text: string }
> = {
  violet: { base: "#8b5cf6", hover: "#7c3aed", soft: "rgba(139,92,246,.22)", ring: "rgba(139,92,246,.48)", text: "#ffffff" },
  blue: { base: "#3b82f6", hover: "#2563eb", soft: "rgba(59,130,246,.22)", ring: "rgba(59,130,246,.48)", text: "#ffffff" },
  cyan: { base: "#06b6d4", hover: "#0891b2", soft: "rgba(6,182,212,.22)", ring: "rgba(6,182,212,.48)", text: "#06212a" },
  emerald: { base: "#10b981", hover: "#059669", soft: "rgba(16,185,129,.22)", ring: "rgba(16,185,129,.48)", text: "#052e24" },
  lime: { base: "#84cc16", hover: "#65a30d", soft: "rgba(132,204,22,.22)", ring: "rgba(132,204,22,.48)", text: "#172006" },
  amber: { base: "#f59e0b", hover: "#d97706", soft: "rgba(245,158,11,.22)", ring: "rgba(245,158,11,.48)", text: "#291904" },
  orange: { base: "#f97316", hover: "#ea580c", soft: "rgba(249,115,22,.22)", ring: "rgba(249,115,22,.48)", text: "#ffffff" },
  red: { base: "#ef4444", hover: "#dc2626", soft: "rgba(239,68,68,.22)", ring: "rgba(239,68,68,.48)", text: "#ffffff" },
  rose: { base: "#f43f5e", hover: "#e11d48", soft: "rgba(244,63,94,.22)", ring: "rgba(244,63,94,.48)", text: "#ffffff" },
  pink: { base: "#ec4899", hover: "#db2777", soft: "rgba(236,72,153,.22)", ring: "rgba(236,72,153,.48)", text: "#ffffff" },
  copper: { base: "#c2410c", hover: "#9a3412", soft: "rgba(194,65,12,.22)", ring: "rgba(194,65,12,.48)", text: "#ffffff" },
  slate: { base: "#64748b", hover: "#475569", soft: "rgba(100,116,139,.22)", ring: "rgba(100,116,139,.48)", text: "#ffffff" },
};

function getEffectiveTheme(theme: string): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme === "light" ? "light" : "dark";
}

export function applyThemePreferences({
  theme,
  accent,
  reduced_motion,
}: ThemePreferences) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const effectiveTheme = getEffectiveTheme(theme);
  const selected = ACCENT_COLORS[accent] ?? ACCENT_COLORS.violet;

  root.dataset.theme = effectiveTheme;
  root.dataset.themePreference = theme;
  root.dataset.reducedMotion = reduced_motion ? "true" : "false";

  root.style.setProperty("--accent", selected.base);
  root.style.setProperty("--accent-hover", selected.hover);
  root.style.setProperty("--accent-soft", selected.soft);
  root.style.setProperty("--accent-ring", selected.ring);
  root.style.setProperty("--accent-text", selected.text);

  Object.entries(ACCENT_COLORS).forEach(([name, value]) => {
    root.style.setProperty(`--accent-preview-${name}`, value.base);
  });

  if (effectiveTheme === "light") {
    root.style.setProperty("--background", "#eef3f9");
    root.style.setProperty("--background-elevated", "#ffffff");
    root.style.setProperty("--surface", "rgba(255,255,255,.78)");
    root.style.setProperty("--surface-hover", "rgba(255,255,255,.96)");
    root.style.setProperty("--surface-strong", "#ffffff");
    root.style.setProperty("--border", "rgba(15,23,42,.15)");
    root.style.setProperty("--text-default", "#0f172a");
    root.style.setProperty("--text-muted", "#334155");
    root.style.setProperty("--text-subtle", "#64748b");
  } else {
    root.style.setProperty("--background", "#050507");
    root.style.setProperty("--background-elevated", "#0d0d12");
    root.style.setProperty("--surface", "rgba(255,255,255,.055)");
    root.style.setProperty("--surface-hover", "rgba(255,255,255,.09)");
    root.style.setProperty("--surface-strong", "rgba(255,255,255,.13)");
    root.style.setProperty("--border", "rgba(255,255,255,.13)");
    root.style.setProperty("--text-default", "#ffffff");
    root.style.setProperty("--text-muted", "#d4d4d8");
    root.style.setProperty("--text-subtle", "#a1a1aa");
  }

  localStorage.setItem("music-space-theme", theme);
  localStorage.setItem("music-space-accent", accent);
  localStorage.setItem("music-space-reduced-motion", String(reduced_motion));
}

export default function ThemeManager() {
  useEffect(() => {
    const applySaved = () =>
      applyThemePreferences({
        theme: localStorage.getItem("music-space-theme") ?? "system",
        accent: localStorage.getItem("music-space-accent") ?? "violet",
        reduced_motion:
          localStorage.getItem("music-space-reduced-motion") === "true",
      });

    const onPreferencesUpdated = (event: Event) => {
      const detail = (event as CustomEvent<ThemePreferences>).detail;
      if (detail) applyThemePreferences(detail);
      else applySaved();
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChanged = () => {
      if ((localStorage.getItem("music-space-theme") ?? "system") === "system") {
        applySaved();
      }
    };

    applySaved();
    window.addEventListener("music-space:preferences-updated", onPreferencesUpdated);
    mediaQuery.addEventListener("change", onSystemThemeChanged);

    return () => {
      window.removeEventListener("music-space:preferences-updated", onPreferencesUpdated);
      mediaQuery.removeEventListener("change", onSystemThemeChanged);
    };
  }, []);

  return null;
}