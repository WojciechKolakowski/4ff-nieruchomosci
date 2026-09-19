import { PNG } from "pngjs";

/** Synthetic hand-drawn-looking signature: transparent PNG, dark round-brush strokes. */
export function makeSignaturePng(width = 1200, height = 340, seed = 1): Buffer {
  const png = new PNG({ width, height });
  png.data.fill(0);

  const stamp = (cx: number, cy: number, radius: number) => {
    for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
      for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        if ((x - cx) ** 2 + (y - cy) ** 2 > radius ** 2) continue;
        const i = (y * width + x) * 4;
        png.data[i] = 20;
        png.data[i + 1] = 20;
        png.data[i + 2] = 40;
        png.data[i + 3] = 255;
      }
    }
  };

  // A looping scribble spanning most of the canvas.
  const steps = 900;
  for (let step = 0; step <= steps; step++) {
    const p = step / steps;
    const x = width * (0.06 + 0.88 * p);
    const y =
      height * 0.5 +
      Math.sin(p * 13 + seed) * height * 0.28 * Math.sin(p * Math.PI) +
      Math.cos(p * 31 + seed) * height * 0.06;
    stamp(x, y, 5 + 2 * Math.sin(p * 9));
  }
  return PNG.sync.write(png);
}

export function makeBlankPng(width = 1200, height = 340): Buffer {
  const png = new PNG({ width, height });
  png.data.fill(0);
  return PNG.sync.write(png);
}
