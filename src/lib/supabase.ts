import { createClient } from '@supabase/supabase-js'

// On ajoute "as string" pour rassurer TypeScript
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string)
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Attention : Les variables d'environnement Supabase sont manquantes !")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)