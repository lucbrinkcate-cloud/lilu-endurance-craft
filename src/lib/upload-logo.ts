import { uploadClubLogoFn } from "@/lib/upload-logo.functions";

const ACCEPT = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
const MAX_BYTES = 5 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadClubLogo(file: File): Promise<string> {
  if (!ACCEPT.includes(file.type)) {
    throw new Error("Logo must be PNG, JPG, WEBP, or SVG.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Logo must be under 5MB.");
  }
  const base64 = await fileToBase64(file);
  const res = await uploadClubLogoFn({
    data: { contentType: file.type, filename: file.name, base64 },
  });
  return res.url;
}
