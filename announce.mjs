import { getStore } from "@netlify/blobs";
import { NAMES, json, verify } from "../lib/common.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!verify(req)) return json({ error: "未登入或登入已過期" }, 401);
  let f;
  try { f = await req.formData(); } catch { return json({ error: "格式不正確" }, 400); }
  const to = String(f.get("to") || "");
  const text = String(f.get("text") || "").trim().slice(0, 300);
  const file = f.get("audio");
  const hasAudio = file && typeof file === "object" && file.size > 0;
  if (to !== "全部班級" && !NAMES.includes(to)) return json({ error: "對象不正確" }, 400);
  if (!text && !hasAudio) return json({ error: "請輸入內容或選擇音檔" }, 400);
  const id = String(Date.now()).padStart(13, "0");
  if (hasAudio) {
    if (file.size > 4 * 1024 * 1024) return json({ error: "音檔超過 4 MB" }, 400);
    if (!String(file.type).startsWith("audio/")) return json({ error: "只接受音檔" }, 400);
    await getStore("audio").set(id, await file.arrayBuffer(), { metadata: { type: file.type } });
  }
  await getStore({ name: "exam", consistency: "strong" }).setJSON("ann/" + id, { id, to, text, audio: !!hasAudio, ts: Date.now() });
  return json({ ok: true, id });
};

export const config = { path: "/api/announce" };
