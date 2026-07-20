"use client";

import { useEffect } from "react";

const ACCENT_COLORS: Record<string, string> = {
  violet: "#8b5cf6",
  blue: "#3b82f6",
  cyan: "#22d3ee",
  emerald: "#10b981",
  lime: "#84cc16",
  amber: "#f59e0b",
  orange: "#f97316",
  red: "#ef4444",
  rose: "#fb7185",
  pink: "#ec4899",
  copper: "#c2410c",
  slate: "#64748b",
};

function formatAccentSoft(color: string) {
  if (!color.startsWith("#")) return color;
  const value = color.slice(1);
  return `#${value}25`;
}

function getEffectiveTheme(theme: string) {
  if (theme === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
}

export function applyThemePreferences({
  theme,
  accent,
  reduced_motion,
}: {
  theme: string;
  accent: string;
  reduced_motion: boolean;
}) {
  const root = document.documentElement;
  const effectiveTheme = getEffectiveTheme(theme);
  const accentColor = ACCENT_COLORS[accent] ?? ACCENT_COLORS.violet;

  root.dataset.theme = effectiveTheme;
  root.dataset.themePreference = theme;
  root.dataset.reducedMotion = reduced_motion ? "true" : "false";
  root.style.setProperty("--accent", accentColor);
  root.style.setProperty("--accent-soft", formatAccentSoft(accentColor));
  root.style.setProperty("--surface", effectiveTheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.92)");
  root.style.setProperty("--surface-strong", effectiveTheme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.98)");
  root.style.setProperty("--border", effectiveTheme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.16)");
  root.style.setProperty("--text-default", effectiveTheme === "dark" ? "#ffffff" : "#0f172a");
  root.style.setProperty("--muted", effectiveTheme === "dark" ? "#a1a1aa" : "#6b7280");

  localStorage.setItem("music-space-theme", theme);
  localStorage.setItem("music-space-accent", accent);
  localStorage.setItem("music-space-reduced-motion", String(reduced_motion));
}

export default function ThemeManager() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("music-space-theme") ?? "system";
    const savedAccent = localStorage.getItem("music-space-accent") ?? "violet";
    const savedReducedMotion = localStorage.getItem("music-space-reduced-motion") === "true";

    applyThemePreferences({
      theme: savedTheme,
      accent: savedAccent,
      reduced_motion: savedReducedMotion,
    });
  }, []);

  return null;
}
