"use client";

import Footer from "./components/Footer";
import IntroScreen from "./components/IntroScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WorshipStudio from "./components/WorshipStudio";
import BandWorkspace from "./components/BandWorkspace";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      {/* Homepage-only cinematic intro */}
      <IntroScreen />

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Product Overview */}
      <HowItWorks />

      {/* Features */}
      <WorshipStudio />

      {/* Band Workspace */}
      <BandWorkspace />

      {/* Footer */}
      <Footer />
    </main>
  );
}