import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const input = z.object({
  email: z.string().trim().email().max(255),
  source: z.string().trim().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/).optional(),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email: data.email.toLowerCase(), source: data.source ?? null });
    if (error) {
      if ((error as { code?: string }).code === "23505") {
        return { ok: true, duplicate: true };
      }
      throw new Error("Subscription failed");
    }
    return { ok: true, duplicate: false };
  });
