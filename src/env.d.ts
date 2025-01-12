/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_ID: string
  readonly VITE_TEST_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 