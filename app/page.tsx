"use client";

import IntroScreen from "./components/IntroScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorshipStudio from "./components/WorshipStudio";
import BandWorkspace from "./components/BandWorkspace";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      {/* Homepage-only cinematic intro */}
      <IntroScreen />

      {/* Homepage sections */}
      <Navbar />
      <Hero />
      <WorshipStudio />
      <BandWorkspace />
    </main>
  );
}