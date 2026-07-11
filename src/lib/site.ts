import { media } from "./media";

export const business = {
  name: "South Lake Fence",
  legalName: "South Lake Fence of Lake County",
  since: 1997,
  years: 29,
  phone: "(407) 785-4900",
  phoneHref: "tel:+14077854900",
  email: "Southlakefence@gmail.com",
  address: "16751 7th St, Montverde, FL 34756",
  hours: [
    { d: "Mon – Fri", h: "7:00 AM – 5:00 PM" },
    { d: "Saturday", h: "By appointment" },
    { d: "Sunday", h: "Closed" },
  ],
  tagline: "Built by family. Built to last.",
  primaryLine: "Lake County's Fence Family, Since 1997.",
} as const;

export const voiceLines = [
  "Built by family. Built to last.",
  "Every post, set right.",
  "Good fences. Great neighbors. Since '97.",
  "Florida-tough, family-built.",
];

export const serviceArea = [
  "Clermont",
  "Winter Garden",
  "Minneola",
  "Groveland",
  "Montverde",
  "Ocoee",
  "West Orlando",
];

export const nav = [
  { label: "Styles & Materials", href: "/styles" },
  { label: "Pool & FL Code", href: "/pool-code" },
  { label: "Commercial", href: "/commercial" },
  { label: "Gallery", href: "/gallery" },
  { label: "Our Story", href: "/about" },
];

export type Material = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
  bestFor: string;
  heightsFt: number[];
  gates: string[];
  addOns: { label: string; note: string }[];
  priceFrom: number; // per linear foot, installed — sample data
  tag?: string;
};

export const materials: Material[] = [
  {
    slug: "wood",
    name: "Wood Privacy",
    blurb:
      "Warm, classic cedar and pressure-treated pine — the Central Florida backyard standard, hand-set to last through the humidity.",
    image: media.wood,
    bestFor: "Backyards • Privacy • HOA-friendly looks",
    heightsFt: [4, 6, 8],
    gates: ["Single walk gate", "Double drive gate", "Arched top gate"],
    addOns: [
      { label: "Stain & seal package", note: "Locks out Florida humidity + UV" },
      { label: "Decorative post caps", note: "Flat, gothic, or solar-lit" },
      { label: "Lattice topper", note: "+1 ft of style and light" },
    ],
    priceFrom: 28,
    tag: "Most popular",
  },
  {
    slug: "aluminum",
    name: "Aluminum Ornamental",
    blurb:
      "Powder-coated, rust-proof, and pool-code ready. Clean sightlines that never rot, warp, or need painting.",
    image: media.pool,
    bestFor: "Pools • Front yards • Views you want to keep",
    heightsFt: [4, 5, 6],
    gates: ["Self-closing pool gate", "Double gate", "Keyed lockable gate"],
    addOns: [
      { label: "Self-closing / self-latching hardware", note: "FL pool-code compliant" },
      { label: "Puppy-picket bottom rail", note: "Keeps small pets in" },
      { label: "Decorative finials", note: "Ball, spear, or flat" },
    ],
    priceFrom: 34,
    tag: "Pool favorite",
  },
  {
    slug: "vinyl",
    name: "Vinyl / PVC",
    blurb:
      "Bright, low-maintenance, and built for new-construction subdivisions. Wipes clean and holds its color for decades.",
    image: media.vinyl,
    bestFor: "New builds • Low upkeep • Bright white looks",
    heightsFt: [4, 6],
    gates: ["Matching privacy gate", "Semi-private gate", "Double drive gate"],
    addOns: [
      { label: "Matching post-cap lighting", note: "Solar LED caps" },
      { label: "Semi-private lattice top", note: "Airflow + privacy" },
      { label: "Color-matched hardware", note: "Black, white, or bronze" },
    ],
    priceFrom: 36,
  },
  {
    slug: "chain-link",
    name: "Chain Link",
    blurb:
      "Tough, affordable, and fast. Galvanized or black-vinyl-coated for yards, pets, and property lines.",
    image: media.commercial,
    bestFor: "Pets • Property lines • Budget-friendly",
    heightsFt: [4, 5, 6],
    gates: ["Single swing gate", "Rolling gate", "Double gate"],
    addOns: [
      { label: "Black vinyl coating", note: "Disappears into the landscape" },
      { label: "Privacy slats", note: "Adds screening + color" },
      { label: "Bottom tension wire", note: "Keeps pets from pushing under" },
    ],
    priceFrom: 18,
  },
  {
    slug: "wrought-iron",
    name: "Wrought Iron",
    blurb:
      "Custom, welded, and built to impress — the grand-entrance and estate option, made for a lifetime.",
    image: media.pool,
    bestFor: "Estates • Entrances • Security with style",
    heightsFt: [5, 6, 8],
    gates: ["Custom estate gate", "Automated drive gate", "Arched pedestrian gate"],
    addOns: [
      { label: "Gate automation", note: "Keypad + remote entry" },
      { label: "Custom scrollwork", note: "Designed with you" },
      { label: "Powder-coat finish", note: "Any color, rust-proof" },
    ],
    priceFrom: 55,
    tag: "Custom",
  },
];

export type PropertyType = {
  slug: string;
  label: string;
  hint: string;
  recommend: string[]; // material slugs
  upsell: { label: string; note: string };
};

export const propertyTypes: PropertyType[] = [
  {
    slug: "home",
    label: "My home",
    hint: "Privacy, curb appeal, kids & pets",
    recommend: ["wood", "vinyl", "aluminum"],
    upsell: { label: "Add a stain & seal package", note: "Doubles the life of a wood fence in Florida humidity." },
  },
  {
    slug: "pool",
    label: "Around my pool",
    hint: "Florida safety code applies here",
    recommend: ["aluminum", "wrought-iron"],
    upsell: {
      label: "Self-closing / self-latching gate hardware",
      note: "Required by Florida pool-safety code — we install it to pass inspection.",
    },
  },
  {
    slug: "hoa",
    label: "In an HOA neighborhood",
    hint: "Needs approved styles & colors",
    recommend: ["vinyl", "aluminum", "wood"],
    upsell: { label: "HOA approval help", note: "We prep your spec sheet so the board says yes the first time." },
  },
  {
    slug: "commercial",
    label: "Commercial / site",
    hint: "Security, scale, and durability",
    recommend: ["chain-link", "wrought-iron", "aluminum"],
    upsell: { label: "Security-grade gate automation", note: "Keypad, badge, or remote access control." },
  },
];

// ---- Horizontal fence showcase (scroll-driven slider after the hero) ----
export type ShowcasePanel = {
  slug: string;
  word: string; // giant display word
  name: string;
  detail: string;
  image: string; // wide panorama strip
  priceFrom: number;
};

export const showcasePanels: ShowcasePanel[] = [
  {
    slug: "wood",
    word: "WOOD",
    name: "Cedar Privacy",
    detail:
      "The Central Florida classic — warm cedar, set deep in concrete, stained to shrug off the humidity.",
    image: media.panoWood,
    priceFrom: 28,
  },
  {
    slug: "aluminum",
    word: "ALUMINUM",
    name: "Ornamental Aluminum",
    detail:
      "Rust-proof, pool-code ready, and clean-lined. Keeps the view — and passes inspection.",
    image: media.panoAluminum,
    priceFrom: 34,
  },
  {
    slug: "vinyl",
    word: "VINYL",
    name: "Vinyl / PVC",
    detail:
      "Bright, low-maintenance, HOA-friendly. Wipes clean and holds its color for decades.",
    image: media.panoVinyl,
    priceFrom: 36,
  },
  {
    slug: "chain-link",
    word: "CHAIN LINK",
    name: "Chain Link",
    detail:
      "Tough, fast, and budget-friendly — yards, pets, and jobsites, galvanized or black-coated.",
    image: media.panoChain,
    priceFrom: 18,
  },
  {
    slug: "wrought-iron",
    word: "IRON",
    name: "Wrought Iron",
    detail:
      "Custom, welded, and built to impress — estate entrances and security with style.",
    image: media.panoIron,
    priceFrom: 55,
  },
];

export const differentiators = [
  {
    title: "29 years, same corridor",
    body: "Not a franchise. The same family has fenced Clermont, Winter Garden, Minneola, Groveland and Montverde since 1997.",
  },
  {
    title: "Every material, one crew",
    body: "Wood, aluminum, vinyl, chain link, wrought iron, pool enclosures and temporary construction fence — all under one roof.",
  },
  {
    title: "We repair any fence",
    body: "Even the ones we didn't install. Storm damage, leaning posts, broken gates — we'll set it right.",
  },
  {
    title: "Licensed & insured",
    body: "A licensed, insured Florida fencing contractor. Permits pulled, code met, inspections passed.",
  },
];

export const floridaPillars = [
  {
    title: "Pool-safety code",
    body: "Florida law requires a self-closing, self-latching barrier around residential pools. We build to it and make sure you pass inspection.",
    accent: "sky",
  },
  {
    title: "HOA approval",
    body: "New subdivisions mean strict style and color rules. We know the approved specs and prep your submittal so the board says yes.",
    accent: "clay",
  },
  {
    title: "Hurricane & humidity",
    body: "Salt air, storms, and year-round humidity eat cheap fences. We set posts deep in concrete and use materials built for Florida.",
    accent: "grove",
  },
];

export type Testimonial = { quote: string; name: string; town: string; material: string };
export const testimonials: Testimonial[] = [
  {
    quote:
      "They fenced our first house in Clermont in 2004 and just did our new build in Minneola. Same family, same care, two decades apart.",
    name: "The Alvarez Family",
    town: "Minneola, FL",
    material: "Vinyl privacy",
  },
  {
    quote:
      "Pool inspection passed on the first try. They knew the code cold and the self-latching gate is exactly right.",
    name: "Dana R.",
    town: "Winter Garden, FL",
    material: "Aluminum pool fence",
  },
  {
    quote:
      "A storm took out 40 feet of our old fence — a fence they didn't even build. They repaired it in a day and it looks better than before.",
    name: "Mike & Carol T.",
    town: "Groveland, FL",
    material: "Wood repair",
  },
  {
    quote:
      "Straight posts, clean lines, on time, on budget. You can tell they've been doing this a long time.",
    name: "Priya S.",
    town: "Montverde, FL",
    material: "Wood privacy",
  },
];

export type Project = {
  title: string;
  town: string;
  material: string;
  image: string;
  span?: boolean;
};
export const projects: Project[] = [
  { title: "Cedar privacy line", town: "Clermont", material: "Wood", image: media.wood, span: true },
  { title: "Backyard pool enclosure", town: "Winter Garden", material: "Aluminum", image: media.pool },
  { title: "New-build subdivision", town: "Minneola", material: "Vinyl", image: media.vinyl },
  { title: "Golden-hour hill line", town: "Clermont", material: "Wood + Aluminum", image: media.hero, span: true },
  { title: "Weathered → new cedar", town: "Groveland", material: "Wood repair", image: media.beforeAfter, span: true },
  { title: "Jobsite perimeter", town: "Ocoee", material: "Chain link", image: media.commercial },
];

export const stats = [
  { n: "29", label: "Years in business" },
  { n: "7", label: "Towns served" },
  { n: "6", label: "Fence materials" },
  { n: "Any", label: "Fence we'll repair" },
];

// ---- Mock admin dashboard sample data ----
export const adminTabs = [
  "Dashboard",
  "Jobs",
  "Estimates",
  "Schedule",
  "Staff",
  "Materials",
  "Analytics",
  "Accounting",
  "Socials",
  "Settings",
];
