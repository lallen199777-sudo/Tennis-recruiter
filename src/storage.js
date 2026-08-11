import { supabase } from "./supabaseClient";

// Same get/set shape as the local version, but backed by a Supabase table
// scoped to the logged-in user (see schema.sql). Each row is one key/value
// pair for one user, so "schools" and "profile" are separate rows.

export const storage = {
  async get(key) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("board_data")
      .select("value")
      .eq("user_id", user.id)
      .eq("key", key)
      .maybeSingle();

    if (error || !data) return null;
    return { key, value: data.value };
  },

  async set(key, value) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { error } = await supabase
      .from("board_data")
      .upsert({ user_id: user.id, key, value, updated_at: new Date().toISOString() }, { onConflict: "user_id,key" });

    if (error) return null;
    return { key, value };
  },
};
