import { supabase } from "@/integrations/supabase/client";

const ACCEPT = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
const MAX_BYTES = 5 * 1024 * 1024;

export async function uploadClubLogo(file: File): Promise<string> {
  if (!ACCEPT.includes(file.type)) {
    throw new Error("Logo must be PNG, JPG, WEBP, or SVG.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Logo must be under 5MB.");
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("club-logos").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("club-logos").getPublicUrl(path);
  return data.publicUrl;
}
