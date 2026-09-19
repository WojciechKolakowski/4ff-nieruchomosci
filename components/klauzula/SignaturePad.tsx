"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  drawStroke,
  drawStrokeTail,
  drawStrokes,
  PAD_ASPECT,
  type Point,
  type Stroke,
} from "./signature-utils";

type Props = {
  strokes: Stroke[];
  onChange: (strokes: Stroke[]) => void;
  /** Accessible name, e.g. "Podpis pod oświadczeniem". */
  label: string;
  disabled?: boolean;
};

/**
 * Hand-drawn signature field. Works with mouse, touchpad, stylus and finger
 * through Pointer Events; `touch-action: none` (see .kl-pad-canvas) stops the
 * page from scrolling while drawing. Strokes live in the parent's state, so
 * the signature is redrawn on resize/rotation and kept when moving between steps.
 */
export function SignaturePad({ strokes, onChange, label, disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>(strokes);
  const currentRef = useRef<Stroke | null>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cssWidth = canvas.width / dpr;
    drawStrokes(ctx, strokesRef.current, cssWidth);
    if (currentRef.current) drawStroke(ctx, currentRef.current, cssWidth);
  }, []);

  // Keep the drawing in step with the parent's strokes (clear, step changes).
  useEffect(() => {
    strokesRef.current = strokes;
    redraw();
  }, [strokes, redraw]);

  // Size the bitmap to the element × devicePixelRatio; redraw on any resize.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.width * PAD_ASPECT * dpr));
      redraw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [redraw]);

  const toPoint = (event: { clientX: number; clientY: number; pressure: number; pointerType: string }): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.width,
      // Mouse/touchpad report a constant 0.5 (or 0); only a stylus is pressure-sensitive.
      p: event.pointerType === "pen" && event.pressure > 0 ? event.pressure : 0.5,
    };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || !event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some browsers refuse capture for synthetic/inactive pointers; drawing still works.
    }
    currentRef.current = [toPoint(event)];
    redraw();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = currentRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!stroke || !canvas || !ctx) return;
    event.preventDefault();
    const native = event.nativeEvent;
    const samples = typeof native.getCoalescedEvents === "function" ? native.getCoalescedEvents() : [];
    for (const sample of samples.length ? samples : [native]) {
      const point = toPoint(sample);
      const last = stroke[stroke.length - 1];
      if (Math.hypot(point.x - last.x, point.y - last.y) >= 0.0012) stroke.push(point);
    }
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawStrokeTail(ctx, stroke, canvas.width / dpr);
  };

  const finishStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = currentRef.current;
    if (!stroke) return;
    event.preventDefault();
    currentRef.current = null;
    const next = [...strokesRef.current, stroke];
    strokesRef.current = next;
    redraw();
    onChange(next);
  };

  return (
    <div className="kl-pad">
      <div className="kl-pad-surface">
        <canvas
          ref={canvasRef}
          className="kl-pad-canvas"
          role="img"
          aria-label={label}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          onContextMenu={(event) => event.preventDefault()}
        />
        {strokes.length === 0 && <span className="kl-pad-hint">Podpisz tutaj</span>}
      </div>
      <div className="kl-pad-tools">
        <span className="kl-rotate-tip">Wskazówka: obróć telefon poziomo, aby podpisać wygodniej.</span>
        <button
          type="button"
          className="kl-link-btn"
          onClick={() => onChange([])}
          disabled={disabled || strokes.length === 0}
        >
          Wyczyść podpis
        </button>
      </div>
    </div>
  );
}
