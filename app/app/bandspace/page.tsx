import TopBar from "./components/TopBar";

export default function BandSpacePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <TopBar />

      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-white/35">
          BandSpace dashboard content will go here.
        </p>
      </section>
    </main>
  );
}