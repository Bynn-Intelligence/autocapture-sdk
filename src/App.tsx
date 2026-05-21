import { useState } from "react";
import { IDAutoCapture, type AutoCaptureResult } from "@bynn-intelligence/autocapture-sdk";

export function App() {
  const [active, setActive] = useState(false);
  const [result, setResult] = useState<{
    url: string;
    type: string;
    score: number;
  } | null>(null);

  return (
    <div className="h-full w-full">
      {!active && !result && (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="max-w-sm text-center">
            <h1 className="mb-2 text-2xl font-semibold">autocapture demo</h1>
            <p className="mb-6 text-sm opacity-80">
              Tap below to open the camera. Point at a passport or ID card;
              the app will auto-capture once it's well-framed and sharp.
            </p>
            <button
              onClick={() => setActive(true)}
              className="rounded-full bg-white px-6 py-3 text-base font-medium text-black"
            >
              Start
            </button>
          </div>
        </div>
      )}
      {active && (
        <div className="fixed inset-0">
          <IDAutoCapture
            license={import.meta.env.VITE_AUTOCAPTURE_LICENSE ?? ""}
            modelBaseUrl="/models"
            detectorFile="detector.enc"
            decoderFile="decoder.enc"
            executionProviders={["wasm"]}
            minQuality={0.85}
            stableFrames={5}
            onCapture={(r: AutoCaptureResult) => {
              setActive(false);
              const url = URL.createObjectURL(r.blob);
              setResult({ url, type: r.type, score: r.quality.score });
            }}
            onCancel={() => setActive(false)}
            onError={(e: Error) => {
              // The SDK shows its own error screen for license/camera
              // failures; just log here. Don't unmount it - that would
              // hide the SDK's (translated) error screen.
              console.error("autocapture:", e);
            }}
          />
        </div>
      )}
      {result && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
          <p className="text-sm opacity-80">
            Captured {result.type} (quality {result.score.toFixed(2)})
          </p>
          <img
            src={result.url}
            alt="captured document"
            className="max-h-[70vh] max-w-full rounded-lg border border-white/10 shadow-2xl"
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                URL.revokeObjectURL(result.url);
                setResult(null);
                setActive(true);
              }}
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
            >
              Capture again
            </button>
            <a
              href={result.url}
              download={`${result.type}.jpg`}
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
