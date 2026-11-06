import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const COURSE_IMAGES_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "cursos";

let client: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  client ??= createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}
