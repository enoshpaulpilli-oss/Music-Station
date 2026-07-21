import type { Metadata } from "next";
import CommandPalette from "./CommandPalette";
import ThemeManager from "./components/ThemeManager";
import ToastProvider from "./components/ui/Toast";

export const metadata: Metadata = {
  title: "Music Space | Personal Studio",
  description: "Music Space",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeManager />
      <CommandPalette />

      <ToastProvider position="bottom-right">
        {children}
      </ToastProvider>
    </>
  );
}
