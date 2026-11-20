import type { Metadata } from "next";
import { CaseLayout } from "@/components/portfolio/Editorial";
import SignRecognitionLab from "@/components/projects/SignRecognitionLab";

export const metadata: Metadata = {
  title: "Sign Language Recognition — Dhiren Sharma",
  description: "Try ASL fingerspelling with saved hand poses or a webcam and explore the original CNN project.",
};

export default function SignLanguagePage() {
  return (
    <CaseLayout
      kind="asl"
      title="Sign language recognition"
      label="Computer vision · Real-time ML"
      summary="I built a webcam classifier to recognize fingerspelled letters from the shape of a hand."
      role="I built the CNN classifier, prepared examples for model development and integrated inference with a webcam loop using OpenCV."
      method="MediaPipe extracts 21 landmarks from the hand. The classifier uses a representation of those landmarks to estimate the letter, and OpenCV displays the result on the webcam feed."
      evaluation="These figures describe my original project. Throughput was measured on a local GPU."
      metrics={[
        { label: "Test accuracy", value: "83%" },
        { label: "Webcam throughput", value: "20 FPS" },
        { label: "Development images", value: "≈3,000" },
      ]}
      limitation="The browser demo uses Nicolás Florentín’s published CNN and covers 24 static letters. J and Z require motion, and the demo classifies individual letters."
    >
      <SignRecognitionLab />
      <a className="ed-link" href="https://github.com/punpuniacitizen/MediaPipe-ASL-sign-language-recognition/tree/45ff2c0e26925c50f4546073bd573fe3ca7a5e6e">Browser CNN source and license ↗</a>
    </CaseLayout>
  );
}
