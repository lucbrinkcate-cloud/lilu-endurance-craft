import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const ACCEPT = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
const MAX_BYTES = 5 * 1024 * 1024;

const input = z.object({
  contentType: z.string().min(1).max(100),
  filename: z.string().min(1).max(255),
  // base64-encoded file contents (no data: prefix)
  base64: z.string().min(1).max(Math.ceil((MAX_BYTES * 4) / 3) + 100),
});

export const uploadClubLogoFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data }) => {
    if (!ACCEPT.includes(data.contentType)) {
      throw new Error("Logo must be PNG, JPG, WEBP, or SVG.");
    }
    const buf = Buffer.from(data.base64, "base64");
    if (buf.byteLength === 0 || buf.byteLength > MAX_BYTES) {
      throw new Error("Logo must be under 5MB.");
    }
    const extMatch = /\.([a-zA-Z0-9]{2,5})$/.exec(data.filename);
    const ext = (extMatch?.[1] ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext.slice(0, 5)}`;

    const { error } = await supabaseAdmin.storage
      .from("club-logos")
      .upload(path, buf, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);

    const { data: pub } = supabaseAdmin.storage.from("club-logos").getPublicUrl(path);
    return { url: pub.publicUrl };
  });
