import { createClient } from '@supabase/supabase-js'

// On utilise les noms exacts que tu as mis dans ton .env
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Attention : Les variables d'environnement Supabase sont manquantes ! Vérifiez le .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)