"use server";

import { createClient } from "./supabase/server";

export async function getUserById(userId: string) {
  const supabase = createClient();
  const result = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return result;
}
