// Images + scroll-scrub frames: demos Supabase `demo-media` bucket (public CDN).
const BASE =
  "https://vhyjphcwfvrcclqberoe.supabase.co/storage/v1/object/public/demo-media/demo-south-lake-fence";

// Video: Cloudflare Stream (adaptive HLS — crisp on mobile, streams only what
// the device/connection needs). The film is chaptered so mobile can snap
// stop-to-stop and play each transition in high quality.
const STREAM = "https://customer-w6h9o08eg118alny.cloudflarestream.com";
export const stream = {
  hls: (uid: string) => `${STREAM}/${uid}/manifest/video.m3u8`,
  mp4: (uid: string) => `${STREAM}/${uid}/downloads/default.mp4`,
  iframe: (uid: string) => `${STREAM}/${uid}/iframe`,
  poster: (uid: string) => `${STREAM}/${uid}/thumbnails/thumbnail.jpg?height=1080`,
};

// Homepage hero: build → gate → logo reveal (cut after the logo).
export const heroFilmUid = "d5fdc4ed54b8898e9365af2fb031b497";
export const trailerUid = "026040efdfd4744aa972c47ad8363094";

// Styles page material showcase — one chapter per material (the slide-in).
export const materialFilm: Record<string, string> = {
  wood: "94ea61997a4d8333d01875775a6c94c5",
  aluminum: "167aae80f479e34a9f0946128c471a35",
  vinyl: "fe8adb5bc3e462a9bec13f6e23cf5841",
  "chain-link": "c8df68b56d709b53d2b6e5f085a6e097",
  "wrought-iron": "1780d807a67932bd14157282f98082fa",
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
  scrollPoster: `${BASE}/scroll-poster-4k.webp`,
  repairBefore: `${BASE}/repair-before.webp`,
  repairAfter: `${BASE}/repair-after.webp`,
  panoWood: `${BASE}/pano-wood-v2.webp`,
  panoAluminum: `${BASE}/pano-aluminum-v2.webp`,
  panoVinyl: `${BASE}/pano-vinyl-v2.webp`,
  panoChain: `${BASE}/pano-chain-v2.webp`,
  panoIron: `${BASE}/pano-iron-v2.webp`,
} as const;

// Scroll-scrub frame sequence — cut from the native-4K master.
// `scroll4` = 1920w (desktop). `scroll4-md` = 1152w (mobile — crisp on
// high-DPR phones, much lighter than the full set).
export const SCROLL_FRAME_COUNT = 283;
export const scrollFrame = (i: number, small = false) =>
  `${BASE}/${small ? "scroll4-md" : "scroll4"}/frame-${String(i).padStart(4, "0")}.webp`;
