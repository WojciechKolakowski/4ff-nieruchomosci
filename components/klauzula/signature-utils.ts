// Client-side signature model. A signature is a list of strokes; every point
// is stored in units of the pad's WIDTH (both x and y), so the same strokes
// can be redrawn at any size — the drawing survives resizing and rotating the
// device — and exported at a fixed resolution.

export type Point = { x: number; y: number; p: number };
export type Stroke = Point[];

/** Pad height / pad width. Also the aspect ratio of the exported PNG. */
export const PAD_ASPECT = 0.42;
export const EXPORT_WIDTH = 1200;

const BASE_LINE_WIDTH = 0.0042; // of pad width (~3 px on a 720 px pad)
const INK = "#14142b";

const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, p: (a.p + b.p) / 2 });

type Segment = { from: Point; ctrl: Point; to: Point };

/** Smooth quadratic path through the midpoints of consecutive points. */
function segmentsOf(stroke: Stroke): Segment[] {
  if (stroke.length < 2) return [];
  const segments: Segment[] = [];
  let from = stroke[0];
  for (let i = 1; i < stroke.length - 1; i++) {
    const to = mid(stroke[i], stroke[i + 1]);
    segments.push({ from, ctrl: stroke[i], to });
    from = to;
  }
  const last = stroke[stroke.length - 1];
  segments.push({ from, ctrl: last, to: last });
  return segments;
}

function lineWidthFor(pressure: number, width: number) {
  return BASE_LINE_WIDTH * width * (0.55 + 0.9 * pressure);
}

function drawSegments(ctx: CanvasRenderingContext2D, segments: Segment[], width: number) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  for (const { from, ctrl, to } of segments) {
    ctx.lineWidth = lineWidthFor(ctrl.p, width);
    ctx.beginPath();
    ctx.moveTo(from.x * width, from.y * width);
    ctx.quadraticCurveTo(ctrl.x * width, ctrl.y * width, to.x * width, to.y * width);
    ctx.stroke();
  }
}

export function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, width: number) {
  if (stroke.length === 1) {
    // A tap leaves a dot.
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(stroke[0].x * width, stroke[0].y * width, lineWidthFor(stroke[0].p, width) / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  drawSegments(ctx, segmentsOf(stroke), width);
}

/** Draws only the newest part of a stroke while the pointer is moving. */
export function drawStrokeTail(ctx: CanvasRenderingContext2D, stroke: Stroke, width: number) {
  if (stroke.length === 1) return drawStroke(ctx, stroke, width);
  drawSegments(ctx, segmentsOf(stroke).slice(-2), width);
}

export function drawStrokes(ctx: CanvasRenderingContext2D, strokes: Stroke[], width: number) {
  for (const stroke of strokes) drawStroke(ctx, stroke, width);
}

export function strokesLength(strokes: Stroke[]): number {
  let total = 0;
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.length; i++) {
      total += Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
    }
  }
  return total;
}

/** A real signature: more than a tap or a tiny scratch. */
export function hasInk(strokes: Stroke[]): boolean {
  const points = strokes.reduce((sum, stroke) => sum + stroke.length, 0);
  return points >= 4 && strokesLength(strokes) >= 0.08;
}

/** Transparent-background PNG at a fixed resolution, as a data URL. */
export function exportSignaturePng(strokes: Stroke[]): string {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = Math.round(EXPORT_WIDTH * PAD_ASPECT);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");
  drawStrokes(ctx, strokes, EXPORT_WIDTH);
  return canvas.toDataURL("image/png");
}

export async function sha256HexOfDataUrl(dataUrl: string): Promise<string> {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
