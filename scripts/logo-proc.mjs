import sharp from "sharp";
const items = [
  { name: "logo-full.webp",  url: "https://d8j0ntlcm91z4.cloudfront.net/user_3Bs1Gzh2MpZN8Jyqk2W1lFgNYAU/hf_20260711_171546_be280ba0-71bf-4336-80b9-8d94c653f78e.png", w: 1200 },
  { name: "logo-nav.webp",   url: "https://d8j0ntlcm91z4.cloudfront.net/user_3Bs1Gzh2MpZN8Jyqk2W1lFgNYAU/hf_20260711_171959_93a1ecbe-caa8-4627-822a-5a3afc830889.png", w: 1000 },
  { name: "logo-footer.webp",url: "https://d8j0ntlcm91z4.cloudfront.net/user_3Bs1Gzh2MpZN8Jyqk2W1lFgNYAU/hf_20260711_172000_9c5cdcc6-bd34-499f-884c-de8e6b2092df.png", w: 900 },
];
const SUPA = process.env.DEMOS_SUPABASE_URL, KEY = process.env.DEMOS_SUPABASE_ANON_KEY;
for (const it of items) {
  const src = Buffer.from(await (await fetch(it.url)).arrayBuffer());
  const out = await sharp(src).trim().resize({ width: it.w, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 95 }).toBuffer();
  const res = await fetch(`${SUPA}/storage/v1/object/demo-media/demo-south-lake-fence/${it.name}`, {
    method: "POST", headers: { apikey: KEY, "Content-Type": "image/webp", "x-upsert": "true" }, body: out,
  });
  const meta = await sharp(out).metadata();
  console.log(it.name, res.status, `${meta.width}x${meta.height}`, `${(out.length/1024).toFixed(0)}KB`);
  await sharp(out).png().toFile(`/private/tmp/claude-501/-Users-dreamer-Desktop-Sweet-Dreams/67daa701-389f-4d82-a3aa-48f53c312bbd/scratchpad/view-${it.name.replace('.webp','.png')}`);
}
