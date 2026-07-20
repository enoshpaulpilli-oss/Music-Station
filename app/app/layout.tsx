import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music Space | Personal Studio",
  description: "Music Space",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}