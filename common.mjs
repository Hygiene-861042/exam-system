import crypto from "node:crypto";

export const NAMES = [];
for (const g of [7, 8, 9]) for (let i = 1; i <= 10; i++) NAMES.push(`${g}${String(i).padStart(2, "0")}`);
export const STATUSES = ["正常", "學生身體不適", "設備異常", "其他"];

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });

// 簽章金鑰由 ADMIN_PASSWORD 推導；更換密碼後，舊的登入憑證會自動失效
const key = () => crypto.createHash("sha256").update("exam-token:" + (process.env.ADMIN_PASSWORD || "")).digest();

export function sign() {
  const p = Buffer.from(JSON.stringify({ exp: Date.now() + 12 * 3600e3 })).toString("base64url");
  const s = crypto.createHmac("sha256", key()).update(p).digest("base64url");
  return p + "." + s;
}

export function verify(req) {
  if (!process.env.ADMIN_PASSWORD) return false;
  const t = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
  const [p, s] = t.split(".");
  if (!p || !s) return false;
  const e = crypto.createHmac("sha256", key()).update(p).digest("base64url");
  const a = Buffer.from(s), b = Buffer.from(e);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try { return JSON.parse(Buffer.from(p, "base64url")).exp > Date.now(); } catch { return false; }
}
