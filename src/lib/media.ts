// Images + scroll-scrub frames: demos Supabase `demo-media` bucket (public CDN).
const BASE =
  "https://vhyjphcwfvrcclqberoe.supabase.co/storage/v1/object/public/demo-media/demo-south-lake-fence";

// Video (the signature film + trailer): Cloudflare Stream.
const STREAM = "https://customer-w6h9o08eg118alny.cloudflarestream.com";
export const stream = {
  scrollFilmUid: "ca9d4bda0d09e737853313b39df7adb5",
  trailerUid: "026040efdfd4744aa972c47ad8363094",
  mp4: (uid: string) => `${STREAM}/${uid}/downloads/default.mp4`,
  hls: (uid: string) => `${STREAM}/${uid}/manifest/video.m3u8`,
  iframe: (uid: string) => `${STREAM}/${uid}/iframe`,
};

export const media = {
  logo: `${BASE}/logo.webp`, // original stacked mark on cream (og/social)
  logoFull: `${BASE}/logo-full.webp`, // stacked full-color, transparent
  logoNav: `${BASE}/logo-nav.webp`, // one-line lockup, transparent
  logoFooter: `${BASE}/logo-footer.webp`, // cream mono for dark surfaces, transparent
  hero: `${BASE}/hero-np.webp`, // people-free
  wood: `${BASE}/wood-np.webp`, // people-free (no hands)
  pool: `${BASE}/pool.webp`,
  vinyl: `${BASE}/vinyl.webp`,
  commercial: `${BASE}/commercial-np.webp`, // people-free (no workers)
  beforeAfter: `${BASE}/before-after.webp`,
  map: `${BASE}/map.webp`,
  scrollVideo: stream.mp4("ca9d4bda0d09e737853313b39df7adb5"), // Cloudflare Stream (4K master)
  scrollVideoHls: stream.hls("ca9d4bda0d09e737853313b39df7adb5"),
  scrollPoster: `${BASE}/scroll-poster-4k.webp`,
  trailer: stream.mp4("026040efdfd4744aa972c47ad8363094"), // Cloudflare Stream
  trailerPoster: `${BASE}/trailer-poster.webp`,
  repairBefore: `${BASE}/repair-before.webp`,
  repairAfter: `${BASE}/repair-after.webp`,
  panoWood: `${BASE}/pano-wood-v2.webp`,
  panoAluminum: `${BASE}/pano-aluminum-v2.webp`,
  panoVinyl: `${BASE}/pano-vinyl-v2.webp`,
  panoChain: `${BASE}/pano-chain-v2.webp`,
  panoIron: `${BASE}/pano-iron-v2.webp`,
} as const;

// Scroll-scrub frame sequence — cut from the native-4K master.
// `scroll4`   = 1920w (desktop, crisp). `scroll4-sm` = 768w (mobile, ~5x lighter).
export const SCROLL_FRAME_COUNT = 283;
export const scrollFrame = (i: number, small = false) =>
  `${BASE}/${small ? "scroll4-sm" : "scroll4"}/frame-${String(i).padStart(4, "0")}.webp`;
