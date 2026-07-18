import StudioPage from "../../components/studioPage";

export default function RhythmStudioPage() {
  return (
    <StudioPage
      number="04"
      title="Rhythm Studio"
      subtitle="Build the foundation the whole team can trust."
      description="Develop dependable timing, musical dynamics and worship-focused grooves that support the song and unite the band."
      modules={[
        {
          title: "Timing Foundations",
          description:
            "Strengthen your internal pulse and learn to practise effectively with a metronome.",
        },
        {
          title: "Worship Grooves",
          description:
            "Learn practical rhythmic patterns for slow, mid-tempo and energetic worship songs.",
        },
        {
          title: "Dynamics",
          description:
            "Control intensity and build sections without overpowering the worship moment.",
        },
        {
          title: "Playing as a Team",
          description:
            "Lock in with bass, keys, guitars and vocal phrasing while following the worship leader.",
        },
      ]}
    />
  );
}