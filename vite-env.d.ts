/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // ajoute tes autres variables ici si besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}