import type { Metadata } from "next";
import CommandPalette from "./CommandPalette";
import ThemeManager from "./components/ThemeManager";

export const metadata: Metadata = {
  title: "Music Space | Personal Studio",
  description: "Music Space",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeManager />
      <CommandPalette />
      {children}
    </>
  );
}