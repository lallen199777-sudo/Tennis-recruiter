import { createClient } from "@supabase/supabase-js";

// These come from your OWN Supabase project (free tier) — see README-CLOUD.md
// for exactly where to find them. Nothing here works until you fill them in.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials are missing. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY — see README-CLOUD.md."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
