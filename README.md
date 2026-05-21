# Bynn Autocapture SDK

On-device ID-document autocapture for the web. A phone-friendly React
component that opens the rear camera, detects an ID card, passport, or
driver's licence in real time with live guidance ("move closer", "reduce
glare", "hold still"), and auto-captures the document at full native
resolution the moment every quality check passes.

Inference runs fully on-device via [onnxruntime-web]; no image ever leaves
the browser.

- npm package: [`@bynn-intelligence/autocapture-sdk`](https://www.npmjs.com/package/@bynn-intelligence/autocapture-sdk)
- This repository is a runnable demo (see [Running the demo](#running-the-demo)).

## Features

- Real-time detection of ID cards, passports, and driver's licences.
- Live quality guidance: framing, lighting, glare, tilt, sharpness, stability.
- Auto-capture at native camera resolution with perspective unwarp.
- Fully on-device inference (onnxruntime-web, WASM).
- 39-language UI, auto-detected from the browser.
- Camera-permission flow built in; rear camera on mobile, front (mirrored)
  on desktop.

## Install

```sh
npm install @bynn-intelligence/autocapture-sdk onnxruntime-web
```

`onnxruntime-web` and `react` (19+) are peer dependencies.

## Usage

```tsx
import { IDAutoCapture, type AutoCaptureResult } from "@bynn-intelligence/autocapture-sdk";

function Scanner() {
  return (
    <IDAutoCapture
      license={import.meta.env.VITE_AUTOCAPTURE_LICENSE}
      modelBaseUrl="/models"
      detectorFile="detector.enc"
      decoderFile="decoder.enc"
      onCapture={(r: AutoCaptureResult) => {
        // r.blob   - the captured, perspective-corrected JPEG
        // r.type   - "id_card" | "passport" | "drivers_license"
        // r.quality - the quality report for the captured frame
        const url = URL.createObjectURL(r.blob);
        // ...
      }}
      onCancel={() => {}}
      onError={(e) => console.error(e)}
    />
  );
}
```

The component fills its parent, so give it a sized container (e.g. a
full-screen `fixed inset-0` element).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `license` | `string` | required | Your Bynn license token. |
| `onCapture` | `(r: AutoCaptureResult) => void` | required | Fired once a document is captured. |
| `apiBaseUrl` | `string` | `https://api.bynn.com` | Bynn licensing API base URL. |
| `modelBaseUrl` | `string` | `/models` | Where the encrypted model files are served from. |
| `detectorFile` | `string` | `detector.onnx` | Detector model filename. |
| `decoderFile` | `string` | `decoder.onnx` | Mask-decoder model filename. |
| `documentTypes` | `DocumentType[]` | all | Restrict accepted document types. |
| `executionProviders` | `ExecutionProvider[]` | `["webgpu","wasm"]` | onnxruntime-web execution providers. |
| `minQuality` | `number` | `0.85` | Minimum quality score to auto-capture. |
| `stableFrames` | `number` | `5` | Stability hold before capture (~120 ms per unit). |
| `language` | `string` | auto | Force a UI language; omitted = browser-detected. |
| `mirror` | `boolean` | auto | Mirror the preview; defaults by device. |
| `debug` | `boolean` | `false` | Show detection overlays and a metrics HUD. |
| `onCancel` | `() => void` | | Fired when the user closes the scanner. |
| `onQuality` | `(r: QualityReport) => void` | | Per-frame quality callback. |
| `onError` | `(e: Error) => void` | | Fired on license/camera/model errors. |
| `className` | `string` | | Class on the root element. |

## Requirements

- A **secure context** (HTTPS, or `localhost`). The camera (`getUserMedia`)
  and WebCrypto both require it.
- A modern browser with WebAssembly and WebCrypto.

## Model files

The detector and mask-decoder run from encrypted model files that you host
yourself at `modelBaseUrl`. They are encrypted per license; Bynn provides
the model files that match your license token. The decryption key is
fetched at runtime over an authenticated, key-wrapped exchange — it is
never embedded in your app bundle.

## Running the demo

```sh
git clone https://github.com/Bynn-Intelligence/autocapture-sdk.git
cd autocapture-sdk
npm install
cp .env.example .env        # then set VITE_AUTOCAPTURE_LICENSE
npm run dev
```

Open the printed URL. For phone testing the page must be served over
HTTPS — use a tunnel (ngrok, localtunnel, cloudflared); their hostnames
are pre-allowed in `vite.config.ts`.

## License

Proprietary and commercial. Copyright (c) 2026 Bynn Intelligence Inc.
Use of the SDK requires a valid commercial license and a Bynn-issued
license token.

To obtain a trial license, email **hello@bynn.com**.
