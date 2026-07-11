// Shared scroll-scrub film engine. A film maps scroll progress → a frame
// fraction of the master 7-clip film plus an optional overlay "hold".
import { useEffect, useRef, useState, type RefObject } from "react";
import { SCROLL_FRAME_COUNT, scrollFrame, media } from "./media";

export type Seg =
  | { kind: "play"; from: number; to: number; units: number }
  | {
      kind: "hold";
      at: number;
      units: number;
      overlay: string | number;
      final?: boolean;
    };

export function totalUnits(segs: Seg[]) {
  return segs.reduce((s, x) => s + x.units, 0);
}

export function resolveSegs(segs: Seg[], p: number) {
  let u = p * totalUnits(segs);
  for (const seg of segs) {
    if (u <= seg.units || seg === segs[segs.length - 1]) {
      const t = Math.min(1, Math.max(0, u / seg.units));
      if (seg.kind === "play")
        return {
          frac: seg.from + (seg.to - seg.from) * t,
          overlay: null as string | number | null,
          t: 0,
          final: false,
        };
      return { frac: seg.at, overlay: seg.overlay, t, final: !!seg.final };
    }
    u -= seg.units;
  }
  const last = segs[segs.length - 1];
  return last.kind === "hold"
    ? { frac: last.at, overlay: last.overlay, t: 1, final: !!last.final }
    : { frac: last.to, overlay: null, t: 0, final: false };
}

/**
 * Preloads a frame window [fromFrac..toFrac] of the master film, draws the
 * frame for the current scroll progress on the canvas, returns progress.
 */
export function useFilmScrub(
  wrapRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  segs: Seg[],
  window0 = 0,
  window1 = 1,
) {
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const posterRef = useRef<HTMLImageElement | null>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  function frameIndex(frac: number) {
    return Math.min(
      SCROLL_FRAME_COUNT - 1,
      Math.max(0, Math.round(frac * (SCROLL_FRAME_COUNT - 1))),
    );
  }

  function draw(p: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { frac } = resolveSegs(segs, p);
    const idx = frameIndex(frac);
    const frame = imagesRef.current.get(idx);
    const img =
      frame && frame.complete && frame.naturalWidth > 0
        ? frame
        : posterRef.current;
    if (!img || !img.naturalWidth) return;

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw = w,
      dh = h,
      dx = 0,
      dy = 0;
    if (ir > cr) {
      dh = h;
      dw = h * ir;
      dx = (w - dw) / 2;
    } else {
      dw = w;
      dh = w / ir;
      dy = (h - dh) / 2;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  useEffect(() => {
    // poster = first frame of this film's window
    const poster = new Image();
    poster.src = scrollFrame(frameIndex(window0) + 1);
    poster.onload = () => {
      posterRef.current = poster;
      draw(0);
    };
    void media.scrollPoster; // (full-film poster kept on CDN for og/social)

    const from = frameIndex(window0);
    const to = frameIndex(window1);
    for (let i = from; i <= to; i++) {
      const img = new Image();
      img.src = scrollFrame(i + 1); // files are 1-indexed
      imagesRef.current.set(i, img);
    }
    const first = imagesRef.current.get(from);
    if (first) first.onload = () => draw(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const wrap = wrapRef.current;
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const total = wrap.offsetHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        setProgress(p);
        draw(p);
      });
    };
    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return progress;
}
