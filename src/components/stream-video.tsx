"use client";

import { useEffect, useRef } from "react";
import { stream } from "@/lib/media";

/**
 * A Cloudflare Stream video played via adaptive HLS. The stream is attached
 * ONLY while `active` — so a page of reels never splits bandwidth across five
 * videos (which forces them all to low quality); the on-screen one gets it all
 * and plays crisp (up to 1080p). Muted + playsInline for mobile autoplay.
 */
export function StreamVideo({
  uid,
  active = true,
  loop = false,
  poster,
  className,
  onEnded,
}: {
  uid: string;
  active?: boolean;
  loop?: boolean;
  poster?: string;
  className?: string;
  onEnded?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (!active) {
      video.pause();
      return;
    }

    const src = stream.hls(uid);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let hls: any = null;
    let cancelled = false;

    const start = () => {
      try {
        video.currentTime = 0;
      } catch {
        /* not seekable yet */
      }
      video.play().catch(() => {});
    };

    // Prefer hls.js wherever it works (Chromium, Android, desktop Safari) — it
    // decodes HLS + lets us pin a crisp level. Only fall back to native HLS on
    // iOS Safari (where hls.js isn't supported but the OS plays HLS itself).
    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 10,
          enableWorker: true,
          abrEwmaDefaultEstimate: 8_000_000,
        });
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Lock to a crisp level: highest up to 1080p (sharp on any phone,
          // no 4K waste for a small viewport).
          const under = hls.levels
            .map((l: { height: number }, i: number) => ({ i, h: l.height || 0 }))
            .filter((x: { h: number }) => x.h <= 1080);
          const idx = under.length
            ? under.reduce((a: { h: number }, b: { h: number }) =>
                b.h >= a.h ? b : a,
              ).i
            : hls.levels.length - 1;
          hls.startLevel = idx;
          hls.autoLevelCapping = idx;
          start();
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src; // iOS Safari native HLS
        video.addEventListener("loadedmetadata", start, { once: true });
      } else {
        video.src = stream.mp4(uid);
        video.addEventListener("loadedmetadata", start, { once: true });
      }
    });

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
      video.pause();
      video.removeAttribute("src");
      try {
        video.load(); // stop buffering, free bandwidth for the active reel
      } catch {
        /* noop */
      }
    };
  }, [active, uid]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop={loop}
      playsInline
      preload="none"
      onEnded={onEnded}
    />
  );
}
