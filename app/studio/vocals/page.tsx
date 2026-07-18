import StudioPage from "../../components/studioPage";

export default function VocalStudioPage() {
  return (
    <StudioPage
      number="03"
      title="Vocal Studio"
      subtitle="Sing with confidence, control and expression."
      description="Develop healthy vocal technique, pitch accuracy, harmony skills and the confidence to lead or support worship effectively."
      modules={[
        {
          title: "Vocal Foundations",
          description:
            "Build breath control, posture, resonance and a reliable vocal warm-up routine.",
        },
        {
          title: "Pitch and Control",
          description:
            "Improve accuracy, consistency, tone and control across your comfortable range.",
        },
        {
          title: "Harmony Training",
          description:
            "Learn common harmony intervals and how to blend naturally with other vocalists.",
        },
        {
          title: "Worship Expression",
          description:
            "Communicate meaning with dynamics, phrasing and sensitivity rather than over-singing.",
        },
      ]}
    />
  );
}