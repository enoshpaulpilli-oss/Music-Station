"use client";

import {
  type ReactNode,
  useEffect,
  useState,
} from "react";

import BandSidebar, {
  type BandSection,
} from "./BandSidebar";

import BandTopBar from "./BandTopBar";

type BandOption = {
  id: string;
  name: string;
};

type BandShellProps = {
  children: ReactNode;
  bandName: string;
  role: string;
  activeBandId: string;
  bands: BandOption[];
  activeSection: BandSection;
  canInviteMembers: boolean;
  onSectionChange: (
    section: BandSection,
  ) => void;
  onBandChange: (bandId: string) => void;
  onInviteMember: () => void;
  onAddBand: () => void;
};

export default function BandShell({
  children,
  bandName,
  role,
  activeBandId,
  bands,
  activeSection,
  canInviteMembers,
  onSectionChange,
  onBandChange,
  onInviteMember,
  onAddBand,
}: BandShellProps) {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeSection, activeBandId]);

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [mobileSidebarOpen]);

  const sidebar = (
    <BandSidebar
      bandName={bandName}
      role={role}
      activeSection={activeSection}
      onSectionChange={onSectionChange}
      onAddBand={onAddBand}
    />
  );

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[var(--background)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[18%] top-[-8rem] h-96 w-96 rounded-full bg-[var(--accent-soft)] opacity-60 blur-[150px]" />

        <div className="absolute bottom-[-10rem] right-[5%] h-[28rem] w-[28rem] rounded-full bg-[var(--accent-soft)] opacity-40 blur-[170px]" />
      </div>

      <div className="relative flex min-h-[calc(100vh-5rem)]">
        <div className="fixed bottom-0 left-0 top-20 z-40 hidden w-72 lg:block">
          {sidebar}
        </div>

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="BandSpace navigation"
          >
            <button
              type="button"
              aria-label="Close BandSpace menu"
              onClick={() =>
                setMobileSidebarOpen(false)
              }
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            <div className="absolute bottom-0 left-0 top-0 w-[min(88vw,19rem)] shadow-[30px_0_100px_rgba(0,0,0,0.45)]">
              <BandSidebar
                bandName={bandName}
                role={role}
                activeSection={activeSection}
                onSectionChange={
                  onSectionChange
                }
                onAddBand={onAddBand}
                onClose={() =>
                  setMobileSidebarOpen(false)
                }
              />
            </div>
          </div>
        )}

        <div className="relative min-w-0 flex-1 lg:pl-72">
          <BandTopBar
            bandName={bandName}
            activeBandId={activeBandId}
            bands={bands}
            activeSection={activeSection}
            canInviteMembers={
              canInviteMembers
            }
            onBandChange={onBandChange}
            onInviteMember={onInviteMember}
            onOpenMenu={() =>
              setMobileSidebarOpen(true)
            }
          />

          <main className="relative">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}