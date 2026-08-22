/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google OAuth client id; empty in environments without credentials yet. */
  readonly VITE_GOOGLE_CLIENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
