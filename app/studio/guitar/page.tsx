import StudioPage from "../../components/studioPage";

export default function GuitarStudioPage() {
  return (
    <StudioPage
      number="01"
      title="Guitar Studio"
      subtitle="Play with skill, tone and purpose."
      description="Develop worship guitar technique, musical confidence and the ability to support a worship team with tasteful, intentional playing."
      modules={[
        {
          title: "Worship Chord Foundations",
          description:
            "Learn essential open chords, movable shapes and common worship progressions.",
        },
        {
          title: "Ambient Guitar",
          description:
            "Create swells, delays, reverbs and spacious textures without overcrowding the song.",
        },
        {
          title: "Lead Guitar",
          description:
            "Develop melodic lead lines, fills, dynamics and expressive worship phrasing.",
        },
        {
          title: "Tone Building",
          description:
            "Understand gain, compression, modulation, delay and reverb for modern worship tones.",
        },
      ]}
    />
  );
}