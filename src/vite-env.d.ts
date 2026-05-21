/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTOCAPTURE_LICENSE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
