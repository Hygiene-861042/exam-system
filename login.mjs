import crypto from "node:crypto";
import { json, sign } from "../lib/common.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return json({ error: "伺服器尚未設定 ADMIN_PASSWORD" }, 500);
  let body = {};
  try { body = await req.json(); } catch {}
  const h = (x) => crypto.createHash("sha256").update(String(x || "")).digest();
  if (crypto.timingSafeEqual(h(body.password), h(pw))) return json({ token: sign() });
  await new Promise((r) => setTimeout(r, 800));
  return json({ error: "密碼錯誤" }, 401);
};

export const config = { path: "/api/login" };
