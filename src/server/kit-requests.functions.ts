import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const FIXED_PRICE_USD = 185; // default fixed price per kit; admin can override on approval

const HEX = /^#[0-9a-fA-F]{6}$/;

// ---------- Generate AI mockups ----------
const generateInput = z.object({
  logoUrl: z.string().url(),
  baseStyle: z.enum(["Road", "Gravel", "Classic"]),
  primaryColor: z.string().regex(HEX),
  secondaryColor: z.string().regex(HEX).optional().or(z.literal("")),
  accentColor: z.string().regex(HEX).optional().or(z.literal("")),
});

async function callAiImage(prompt: string, logoUrl: string): Promise<string | null> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: logoUrl } },
          ],
        },
      ],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limited by AI gateway. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted on workspace.");
    throw new Error(`AI gateway error ${res.status}`);
  }

  const data = await res.json();
  const url: string | undefined = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  return url ?? null;
}

async function uploadDataUrlToBucket(dataUrl: string, name: string): Promise<string> {
  const match = /^data:(.+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid image data url returned by AI");
  const contentType = match[1];
  const base64 = match[2];
  const buf = Buffer.from(base64, "base64");

  const { error } = await supabaseAdmin.storage
    .from("kit-mockups")
    .upload(name, buf, { contentType, upsert: true });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage.from("kit-mockups").getPublicUrl(name);
  return data.publicUrl;
}

export const generateKitDesigns = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => generateInput.parse(input))
  .handler(async ({ data }) => {
    const colors = [data.primaryColor, data.secondaryColor, data.accentColor]
      .filter((c) => c && c.length > 0)
      .join(", ");
    const styleDescriptor =
      data.baseStyle === "Road"
        ? "race-fit road cycling jersey and bib shorts"
        : data.baseStyle === "Gravel"
          ? "all-road gravel cycling jersey and bib shorts with relaxed fit"
          : "classic-cut heritage cycling jersey and bib shorts";

    const variations = [
      `Editorial product photo of a ${styleDescriptor} in ${colors}, full color block design, the provided logo placed cleanly on the chest and one thigh panel. Studio lighting, clean neutral background, technical fabric texture, photorealistic.`,
      `Editorial product photo of a ${styleDescriptor} in ${colors}, minimal accent design with the provided logo on the chest only and a small accent stripe in the secondary color. Studio lighting, neutral background, photorealistic.`,
      `Editorial product photo of a ${styleDescriptor} in ${colors}, retro horizontal stripe design across the chest with the provided logo centered on the front. Studio lighting, neutral background, photorealistic.`,
      `Editorial product photo of a ${styleDescriptor} in ${colors}, modern panel-block design with asymmetric color panels and the provided logo on the chest. Studio lighting, neutral background, photorealistic.`,
    ];

    const designs: { url: string; prompt: string }[] = [];
    for (let i = 0; i < variations.length; i++) {
      try {
        const dataUrl = await callAiImage(variations[i], data.logoUrl);
        if (!dataUrl) continue;
        const fileName = `gen/${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.png`;
        const publicUrl = await uploadDataUrlToBucket(dataUrl, fileName);
        designs.push({ url: publicUrl, prompt: variations[i] });
        // small delay between calls to avoid bursts
        await new Promise((r) => setTimeout(r, 600));
      } catch (e) {
        console.error("design gen failed", i, e);
      }
    }

    if (designs.length === 0) {
      throw new Error("Could not generate any designs. Please try again.");
    }
    return { designs };
  });

// ---------- Submit request ----------
const submitInput = z.object({
  customerEmail: z.string().email().max(255),
  customerName: z.string().min(1).max(120),
  clubName: z.string().min(1).max(120),
  estimatedQty: z.number().int().min(1).max(10000),
  logoUrl: z.string().url(),
  baseStyle: z.enum(["Road", "Gravel", "Classic"]),
  primaryColor: z.string().regex(HEX),
  secondaryColor: z.string().regex(HEX).optional().or(z.literal("")),
  accentColor: z.string().regex(HEX).optional().or(z.literal("")),
  generatedDesigns: z
    .array(z.object({ url: z.string().url(), prompt: z.string() }))
    .min(1)
    .max(8),
  selectedDesignIndex: z.number().int().min(0).max(7),
});

export const submitKitRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitInput.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("kit_requests")
      .insert({
        status: "pending",
        customer_email: data.customerEmail,
        customer_name: data.customerName,
        club_name: data.clubName,
        estimated_qty: data.estimatedQty,
        logo_url: data.logoUrl,
        base_style: data.baseStyle,
        primary_color: data.primaryColor,
        secondary_color: data.secondaryColor || null,
        accent_color: data.accentColor || null,
        generated_designs: data.generatedDesigns,
        selected_design_index: data.selectedDesignIndex,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: row.id };
  });

// ---------- Get request by id (public, for status page) ----------
export const getKitRequest = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("kit_requests")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { request: null };
    // Don't leak admin notes to public
    const { admin_notes, customer_email, ...safe } = row;
    return { request: { ...safe, customer_email_masked: maskEmail(customer_email) } };
  });

function maskEmail(e: string) {
  const [user, domain] = e.split("@");
  if (!domain) return e;
  const u = user.length <= 2 ? user[0] + "*" : user.slice(0, 2) + "***";
  return `${u}@${domain}`;
}

// ---------- Admin: verify password ----------
export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD not configured");
    return { ok: data.password === expected };
  });

function ensureAdmin(password: string | undefined) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD not configured");
  if (password !== expected) throw new Error("Unauthorized");
}

// ---------- Admin: list requests ----------
export const listKitRequests = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        password: z.string().min(1),
        status: z.enum(["all", "pending", "approved", "rejected", "ordered"]).default("all"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    ensureAdmin(data.password);
    let q = supabaseAdmin
      .from("kit_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data.status !== "all") q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { requests: rows ?? [] };
  });

// ---------- Admin: get one request (full, with admin notes & email) ----------
export const adminGetKitRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ password: z.string().min(1), id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    ensureAdmin(data.password);
    const { data: row, error } = await supabaseAdmin
      .from("kit_requests")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { request: row };
  });

// ---------- Admin: reject ----------
export const rejectKitRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        password: z.string().min(1),
        id: z.string().uuid(),
        notes: z.string().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    ensureAdmin(data.password);
    const { error } = await supabaseAdmin
      .from("kit_requests")
      .update({ status: "rejected", admin_notes: data.notes ?? null, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Admin: approve & create Shopify product ----------
export const approveKitRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        password: z.string().min(1),
        id: z.string().uuid(),
        priceUsd: z.number().min(1).max(10000).default(FIXED_PRICE_USD),
        notes: z.string().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    ensureAdmin(data.password);

    const { data: req, error: reqErr } = await supabaseAdmin
      .from("kit_requests")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (reqErr) throw new Error(reqErr.message);
    if (!req) throw new Error("Request not found");

    const designs = (req.generated_designs as Array<{ url: string; prompt: string }>) ?? [];
    const idx = req.selected_design_index ?? 0;
    const selected = designs[idx];
    if (!selected) throw new Error("No selected design on request");

    // Create Shopify product via Admin API
    const shop = "lilu-engineered-endurance-9srdf.myshopify.com";
    const token = process.env.SHOPIFY_ACCESS_TOKEN;
    if (!token) throw new Error("SHOPIFY_ACCESS_TOKEN not configured");

    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const productPayload = {
      product: {
        title: `Custom Kit — ${req.club_name}`,
        body_html: `<p>One-off custom kit for ${req.club_name}. Approved design.</p>`,
        vendor: "LILU",
        product_type: "Custom Kit",
        tags: "custom-kit, hidden",
        status: "active",
        published: true,
        options: [{ name: "Size", values: sizes }],
        variants: sizes.map((s) => ({
          option1: s,
          price: data.priceUsd.toFixed(2),
          inventory_management: null,
          inventory_policy: "continue",
        })),
        images: [{ src: selected.url, alt: `Custom Kit — ${req.club_name}` }],
      },
    };

    const res = await fetch(
      `https://${shop}/admin/api/2025-07/products.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload),
      },
    );
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Shopify product create failed: ${res.status} ${t}`);
    }
    const created = await res.json();
    const productId: number = created.product.id;
    const handle: string = created.product.handle;
    const productUrl = `https://${shop}/products/${handle}`;

    const { error: updErr } = await supabaseAdmin
      .from("kit_requests")
      .update({
        status: "approved",
        approved_price_cents: Math.round(data.priceUsd * 100),
        admin_notes: data.notes ?? null,
        shopify_product_id: String(productId),
        shopify_product_url: productUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message);

    return { ok: true, productUrl };
  });
