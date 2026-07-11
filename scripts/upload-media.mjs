// Download Higgsfield source media, convert images to optimized WebP with sharp,
// and upload to the demos Supabase `demo-media` bucket.
// Usage: node scripts/upload-media.mjs <manifest.json>
// manifest.json = [{ name, url, maxWidth?, quality?, raw? }]
//   raw: true  -> upload bytes as-is (e.g. mp4), skip sharp
import sharp from "sharp";
import fs from "node:fs/promises";

const SUPA_URL = process.env.DEMOS_SUPABASE_URL;
const KEY = process.env.DEMOS_SUPABASE_ANON_KEY;
const SLUG = "south-lake-fence";
const BUCKET = "demo-media";
const PREFIX = `demo-${SLUG}`;

if (!SUPA_URL || !KEY) {
  console.error("Missing DEMOS_SUPABASE_URL / DEMOS_SUPABASE_ANON_KEY");
  process.exit(1);
}

const manifestPath = process.argv[2];
const items = JSON.parse(await fs.readFile(manifestPath, "utf8"));

async function fetchBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function upload(path, bytes, contentType) {
  const res = await fetch(
    `${SUPA_URL}/storage/v1/object/${BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": contentType,
        "x-upsert": "true",
      },
      body: bytes,
    },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`upload ${path} -> ${res.status} ${t}`);
  }
  return `${SUPA_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

const out = {};
for (const it of items) {
  const src = await fetchBytes(it.url);
  let bytes = src;
  let file = it.name;
  let ct = "application/octet-stream";
  if (it.raw) {
    if (file.endsWith(".mp4")) ct = "video/mp4";
    else if (file.endsWith(".webp")) ct = "image/webp";
    else if (file.endsWith(".png")) ct = "image/png";
  } else {
    bytes = await sharp(src)
      .resize({ width: it.maxWidth ?? 1600, withoutEnlargement: true })
      .webp({ quality: it.quality ?? 82 })
      .toBuffer();
    file = it.name.replace(/\.(png|jpg|jpeg)$/i, "") + ".webp";
    ct = "image/webp";
  }
  const publicUrl = await upload(`${PREFIX}/${file}`, bytes, ct);
  out[it.name.replace(/\.(png|jpg|jpeg|webp|mp4)$/i, "")] = publicUrl;
  console.error(`✓ ${file}  (${(bytes.length / 1024).toFixed(0)} KB)`);
}
console.log(JSON.stringify(out, null, 2));
