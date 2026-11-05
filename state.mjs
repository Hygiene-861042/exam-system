import { getStore } from "@netlify/blobs";
import { NAMES, json } from "../lib/common.mjs";

export default async () => {
  const store = getStore({ name: "exam", consistency: "strong" });
  const classes = {};
  await Promise.all(
    NAMES.map(async (n) => {
      classes[n] = (await store.get("class/" + n, { type: "json" })) || { exp: 30, pre: 30, st: "正常", note: "" };
    })
  );
  const { blobs } = await store.list({ prefix: "ann/" });
  const keys = blobs.map((b) => b.key).sort().slice(-20);
  const ann = (await Promise.all(keys.map((k) => store.get(k, { type: "json" })))).filter(Boolean);
  return json({ classes, ann }, 200, {
    "cache-control": "public, max-age=0, must-revalidate",
    // CDN 快取 3 秒：大量裝置同時輪詢時，函式最多每幾秒才執行一次
    "netlify-cdn-cache-control": "public, max-age=3, stale-while-revalidate=5",
  });
};

export const config = { path: "/api/state" };
