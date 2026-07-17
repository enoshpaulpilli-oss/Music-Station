"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorshipStudio from "./components/WorshipStudio";
import BandWorkspace from "./components/BandWorkspace";
import CursorRipple from "./components/CursorRipple";


export default function Home() {

  return (

    <main className="min-h-screen overflow-hidden bg-black text-white">

      <CursorRipple />

      <Navbar />

      <Hero />

      <WorshipStudio />

      <BandWorkspace />

    </main>

  );

}