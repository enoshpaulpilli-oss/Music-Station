import StudioPage from "../../components/studioPage";

export default function PianoStudioPage() {
  return (
    <StudioPage
      number="02"
      title="Piano Studio"
      subtitle="Build atmosphere without losing musical clarity."
      description="Learn worship piano voicings, transitions, accompaniment techniques and atmospheric playing for both small teams and full-band settings."
      modules={[
        {
          title: "Chord Voicings",
          description:
            "Move beyond basic triads using inversions, extensions and spacious worship voicings.",
        },
        {
          title: "Pads and Atmosphere",
          description:
            "Create smooth ambient layers that support prayer, transitions and worship moments.",
        },
        {
          title: "Song Arrangements",
          description:
            "Learn how to structure intros, verses, choruses, bridges and spontaneous sections.",
        },
        {
          title: "Transitions",
          description:
            "Connect songs smoothly using shared chords, keys, pads and musical cues.",
        },
      ]}
    />
  );
}