// All media hosted on the demos Supabase `demo-media` bucket (public CDN).
const BASE =
  "https://vhyjphcwfvrcclqberoe.supabase.co/storage/v1/object/public/demo-media/demo-south-lake-fence";

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
  scrollVideo: `${BASE}/scroll-4k.mp4`, // native-4K master (Seedance 2.0)
  scrollPoster: `${BASE}/scroll-poster-4k.webp`,
  trailer: `${BASE}/trailer.mp4`,
  trailerPoster: `${BASE}/trailer-poster.webp`,
  repairBefore: `${BASE}/repair-before.webp`,
  repairAfter: `${BASE}/repair-after.webp`,
  panoWood: `${BASE}/pano-wood-v2.webp`,
  panoAluminum: `${BASE}/pano-aluminum-v2.webp`,
  panoVinyl: `${BASE}/pano-vinyl-v2.webp`,
  panoChain: `${BASE}/pano-chain-v2.webp`,
  panoIron: `${BASE}/pano-iron-v2.webp`,
} as const;

// Scroll-scrub frame sequence — 1920w cuts from the native-4K master.
export const SCROLL_FRAME_COUNT = 283;
export const scrollFrame = (i: number) =>
  `${BASE}/scroll4/frame-${String(i).padStart(4, "0")}.webp`;
