"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { publicAsset } from "@/lib/publicAsset";
import { FiCamera, FiCameraOff } from "react-icons/fi";
import { sampleLetters, supportsHandTracking, type SampleLetter, type Score } from "@/lib/aslInference";

type Mode = { kind: "example"; letter: SampleLetter } | { kind: "camera" };
type Reading = { scores: Score[]; fps?: number };

const buttonClass = "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:border-[#b2edcb] aria-pressed:border-[#b2edcb] aria-pressed:bg-[#1d3a2f]";

export default function SignRecognitionLab() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [status, setStatus] = useState("Start the camera or try a saved hand pose.");
  const video = useRef<HTMLVideoElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const winner = reading?.scores[0];
  const visibleLetter = winner && winner.probability >= 0.55 && !["J", "Z"].includes(winner.letter) ? winner.letter : "—";

  function select(next: Mode | null) {
    setReading(null);
    if (next?.kind === "camera" && !supportsHandTracking()) {
      setMode(null);
      setStatus("Live hand tracking needs WebGL. You can run the CNN on a saved pose.");
      return;
    }
    setStatus(next?.kind === "camera" ? "Requesting camera access…" : next ? "Loading the CNN…" : "Camera stopped. Choose an example or restart.");
    setMode(next);
  }

  useEffect(() => {
    if (!mode) return;
    const player = video.current;
    let active = true;
    let stream: MediaStream | undefined;
    let animation = 0;
    let classifier: Awaited<ReturnType<typeof import("@/lib/aslInference").loadClassifier>> | undefined;
    let tracker: Awaited<ReturnType<typeof import("@/lib/aslInference").loadHandTracker>> | undefined;
    let pending: Promise<void> | undefined;
    let disposed = false;

    function release() {
      if (disposed) return;
      disposed = true;
      tracker?.close();
      if (classifier) void classifier.release().catch(() => {});
    }

    function stopCamera() {
      cancelAnimationFrame(animation);
      stream?.getTracks().forEach((track) => track.stop());
      if (stream && player?.srcObject === stream) player.srcObject = null;
    }

    async function start() {
      if (mode?.kind === "camera") {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera requires HTTPS or localhost.");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (!active || !player) return;
        stream.getVideoTracks()[0]?.addEventListener("ended", () => {
          if (!active) return;
          setStatus("Camera disconnected. Try a saved example.");
          setReading(null);
          setMode(null);
        }, { once: true });
        player.srcObject = stream;
        await player.play();
        if (active) setStatus("Loading the hand tracker and CNN…");
      }
      if (!active) return;
      const engine = await import("@/lib/aslInference");
      if (!active) return;
      classifier = await engine.loadClassifier();
      if (!active) return;

      if (mode?.kind === "example") {
        const image = engine.sampleImage(mode.letter);
        await image.decode();
        const scores = await classifier.predictSample(image);
        if (active) {
          setReading({ scores });
          setStatus("Saved pose classified.");
        }
        return;
      }

      const context = preview.current?.getContext("2d");
      if (!player || !context) throw new Error("Preview unavailable");
      tracker = await engine.loadHandTracker();
      if (!active) return;
      const camera = player;
      const canvas = context;
      const model = classifier;
      const detector = tracker;
      let lastFrame = -1;
      let lastTime = 0;
      let lastUpdate = 0;
      let frames = 0;
      let scores: Score[] = [];
      setStatus("Show one hand inside the frame.");

      function schedule() {
        if (!active) return;
        animation = requestAnimationFrame((time) => {
          if (time - lastTime < 90 || camera.currentTime === lastFrame || !camera.videoWidth) {
            schedule();
            return;
          }
          lastTime = time;
          lastFrame = camera.currentTime;
          pending = processFrame(time);
        });
      }

      async function processFrame(time: number) {
        try {
          const hand = detector.detectForVideo(camera, time).landmarks[0];
          engine.drawLiveFrame(canvas, camera, hand);
          scores = hand ? await model.predictHand(hand, camera.videoWidth, camera.videoHeight) : [];
          if (!active) return;
          frames++;
          if (!lastUpdate || time - lastUpdate >= 350) {
            const fps = lastUpdate ? Math.round(frames * 1000 / (time - lastUpdate)) : undefined;
            setReading({ scores, fps });
            lastUpdate = time;
            frames = 0;
          }
          schedule();
        } catch (error) {
          showError(error);
        }
      }
      schedule();
    }

    function showError(error: unknown) {
      if (!active) return;
      stopCamera();
      const name = error instanceof Error ? error.name : "";
      setStatus(name === "NotAllowedError" ? "Camera permission was denied. Try a saved example."
        : name === "NotFoundError" ? "No camera was found. Try a saved example."
        : !window.isSecureContext && mode?.kind === "camera" ? "Camera access needs HTTPS or localhost."
        : "The demo could not start. Retry or try another input.");
      setReading(null);
      setMode(null);
    }

    const setup = start().catch(showError);
    return () => {
      active = false;
      stopCamera();
      void setup.finally(() => {
        stopCamera();
        if (pending) void pending.finally(release);
        else release();
      });
    };
  }, [mode]);

  return (
    <section aria-labelledby="sign-lab-title" className="overflow-hidden rounded-2xl border border-white/15 bg-[#101a1d]">
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 px-5 py-5 md:px-7">
        <div>
          <h2 id="sign-lab-title" className="font-display text-2xl font-semibold sm:text-3xl">Try ASL fingerspelling</h2>
          <p className="mt-2 text-sm text-[#b4c4bf]">One hand. Twenty-four static letters. Video stays in this browser.</p>
        </div>
        <button type="button" className={buttonClass} onClick={() => select(mode?.kind === "camera" ? null : { kind: "camera" })}>
          {mode?.kind === "camera" ? <><FiCameraOff aria-hidden="true" /> Stop camera</> : <><FiCamera aria-hidden="true" /> Start camera</>}
        </button>
      </div>
      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        <div className="min-w-0 border-white/10 lg:border-r">
          <div className="relative grid min-h-[235px] place-items-center overflow-hidden bg-[#070e10] md:min-h-[360px]">
            <video ref={video} muted playsInline hidden aria-hidden="true" />
            <canvas ref={preview} className={`aspect-[4/3] max-h-[420px] w-full object-contain ${mode?.kind === "camera" ? "block" : "hidden"}`} aria-label="Mirrored camera preview with tracked hand joints" />
            {mode?.kind === "example" && (
              <Image src={publicAsset(`/models/asl/examples/${mode.letter}.png`)} alt={`Saved hand landmarks for ${mode.letter}`} width={192} height={192} unoptimized className="my-6 [image-rendering:pixelated]" />
            )}
            {!mode && <FiCamera aria-hidden="true" className="h-12 w-12 text-[#527067]" />}
          </div>
          <div className="flex flex-wrap items-center gap-2 p-4 md:px-6">
            <span className="mr-2 text-sm text-[#b4c4bf]">Saved poses</span>
            {sampleLetters.map((letter) => (
              <button key={letter} type="button" className={buttonClass} aria-label={`Try example ${letter}`} aria-pressed={mode?.kind === "example" && mode.letter === letter} onClick={() => select({ kind: "example", letter })}>
                {letter}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 border-t border-white/10 p-5 lg:border-t-0 md:p-7">
          <p role="status" className="min-h-10 text-sm text-[#c0ccc7]">{status}</p>
          <div className="mt-5 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-sm text-[#b4c4bf]">Recognized letter</p>
              <p aria-label="Recognized letter" className="mt-1 font-display text-6xl font-semibold text-[#b2edcb]">{visibleLetter}</p>
            </div>
            {mode?.kind === "camera" && (
              <p className="pb-1 font-mono text-xs text-[#b4c4bf]">{reading?.fps ?? "—"} frames/s processed · {winner ? 21 : 0} landmarks</p>
            )}
          </div>
          {reading?.scores.length ? (
            <ol aria-label="Top model scores" className="mt-6 space-y-3">
              {reading.scores.map(({ letter, probability }) => (
                <li key={letter} className="grid grid-cols-[1.5rem_1fr_3.5rem] items-center gap-2 font-mono text-xs">
                  <span>{letter}</span>
                  <progress value={probability} max={1} aria-label={`Model score for ${letter}`} className="h-2 w-full accent-[#b2edcb]" />
                  <span className="text-right">{Math.round(probability * 100)}%</span>
                </li>
              ))}
            </ol>
          ) : reading && <p className="mt-5 text-sm text-[#b4c4bf]">No hand detected.</p>}
          <p className="mt-6 text-sm leading-relaxed text-[#b4c4bf]">Prediction scores reflect the CNN’s ranking. J and Z require movement and are outside this demo’s vocabulary.</p>
        </div>
      </div>
    </section>
  );
}
