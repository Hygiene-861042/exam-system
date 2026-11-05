import { getStore } from "@netlify/blobs";
import { NAMES, STATUSES, json } from "../lib/common.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  let b = {};
  try { b = await req.json(); } catch {}
  const exp = Number(b.exp), pre = Number(b.pre);
  if (!NAMES.includes(b.cls)) return json({ error: "班級不正確" }, 400);
  if (!Number.isInteger(exp) || !Number.isInteger(pre) || exp < 0 || pre < 0 || exp > 99 || pre > 99)
    return json({ error: "人數不正確" }, 400);
  if (!STATUSES.includes(b.st)) return json({ error: "狀況不正確" }, 400);
  const rec = { exp, pre, st: b.st, note: String(b.note || "").slice(0, 100), ts: Date.now() };
  await getStore({ name: "exam", consistency: "strong" }).setJSON("class/" + b.cls, rec);
  return json({ ok: true, rec });
};

export const config = { path: "/api/report" };
