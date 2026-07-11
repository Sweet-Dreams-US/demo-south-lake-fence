import sharp from "sharp";
// Key the cream-on-green footer logo to transparent-cream via projection onto
// the green→cream axis (clean antialiasing, no matting halos).
const SRC = "https://d8j0ntlcm91z4.cloudfront.net/user_3Bs1Gzh2MpZN8Jyqk2W1lFgNYAU/hf_20260711_171553_427829ca-820a-47a4-92ee-641bd8ee8bd3.png";
const G = [22, 56, 38];        // grove-deep bg
const C = [250, 243, 231];     // cream ink
const D = [C[0]-G[0], C[1]-G[1], C[2]-G[2]];
const DD = D[0]*D[0] + D[1]*D[1] + D[2]*D[2];

const src = Buffer.from(await (await fetch(SRC)).arrayBuffer());
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const t = Math.max(0, Math.min(1,
    ((data[i]-G[0])*D[0] + (data[i+1]-G[1])*D[1] + (data[i+2]-G[2])*D[2]) / DD));
  data[i] = C[0]; data[i+1] = C[1]; data[i+2] = C[2];
  data[i+3] = Math.round(t * 255);
}
const out = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim().resize({ width: 900, withoutEnlargement: true })
  .webp({ quality: 92, alphaQuality: 95 }).toBuffer();
const res = await fetch(`${process.env.DEMOS_SUPABASE_URL}/storage/v1/object/demo-media/demo-south-lake-fence/logo-footer.webp`, {
  method: "POST", headers: { apikey: process.env.DEMOS_SUPABASE_ANON_KEY, "Content-Type": "image/webp", "x-upsert": "true" }, body: out,
});
const meta = await sharp(out).metadata();
console.log("logo-footer.webp", res.status, `${meta.width}x${meta.height}`, `${(out.length/1024).toFixed(0)}KB`);
// preview on a mid-green background to check edges
await sharp({ create: { width: meta.width, height: meta.height, channels: 4, background: { r: 31, g: 77, b: 54, alpha: 1 } } })
  .composite([{ input: out }]).png()
  .toFile("/private/tmp/claude-501/-Users-dreamer-Desktop-Sweet-Dreams/67daa701-389f-4d82-a3aa-48f53c312bbd/scratchpad/view-logo-footer2.png");
