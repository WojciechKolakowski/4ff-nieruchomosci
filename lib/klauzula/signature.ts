import { createHash } from "node:crypto";
import { PNG } from "pngjs";

// Signatures arrive from the browser as PNG data URLs. Never trust them:
// check type, size, dimensions and content, then crop to the ink so the PDF
// step can scale the signature proportionally.

export const MAX_SIGNATURE_BYTES = 400_000;
const MAX_DIMENSION = 3000;
const MIN_DIMENSION = 40;
const MIN_INK_PIXELS = 150;
const MAX_INK_RATIO = 0.35;
const ALPHA_THRESHOLD = 40;
const CROP_PADDING = 6;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const DATA_URL_PREFIX = "data:image/png;base64,";

export type PreparedSignature = { png: Buffer; width: number; height: number };

export function sha256Hex(data: Buffer | Uint8Array | string): string {
  return createHash("sha256").update(data).digest("hex");
}

/** Decodes `data:image/png;base64,…` (size-limited). Returns null if malformed. */
export function decodePngDataUrl(value: unknown): Buffer | null {
  if (typeof value !== "string" || !value.startsWith(DATA_URL_PREFIX)) return null;
  const base64 = value.slice(DATA_URL_PREFIX.length);
  // Base64 is 4/3 of the binary size; reject before allocating.
  if (base64.length > Math.ceil((MAX_SIGNATURE_BYTES * 4) / 3) + 8) return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) return null;
  const buffer = Buffer.from(base64, "base64");
  return buffer.length > 0 && buffer.length <= MAX_SIGNATURE_BYTES ? buffer : null;
}

export function prepareSignature(
  buffer: Buffer
): { ok: true; value: PreparedSignature } | { ok: false; error: string } {
  const fail = (error: string) => ({ ok: false as const, error });
  if (buffer.length > MAX_SIGNATURE_BYTES || !buffer.subarray(0, 8).equals(PNG_MAGIC)) {
    return fail("Nieprawidłowy plik podpisu.");
  }

  let image: PNG;
  try {
    image = PNG.sync.read(buffer);
  } catch {
    return fail("Nieprawidłowy plik podpisu.");
  }
  const { width, height, data } = image;
  if (width < MIN_DIMENSION || height < MIN_DIMENSION || width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return fail("Nieprawidłowy rozmiar podpisu.");
  }

  let ink = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > ALPHA_THRESHOLD) {
        ink++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (ink < MIN_INK_PIXELS) return fail("Podpis jest pusty lub zbyt krótki.");
  if (ink / (width * height) > MAX_INK_RATIO) return fail("Nieprawidłowa zawartość podpisu.");

  const x0 = Math.max(0, minX - CROP_PADDING);
  const y0 = Math.max(0, minY - CROP_PADDING);
  const x1 = Math.min(width - 1, maxX + CROP_PADDING);
  const y1 = Math.min(height - 1, maxY + CROP_PADDING);
  const cropWidth = x1 - x0 + 1;
  const cropHeight = y1 - y0 + 1;

  const cropped = new PNG({ width: cropWidth, height: cropHeight });
  PNG.bitblt(image, cropped, x0, y0, cropWidth, cropHeight, 0, 0);
  return {
    ok: true,
    value: { png: PNG.sync.write(cropped), width: cropWidth, height: cropHeight },
  };
}
