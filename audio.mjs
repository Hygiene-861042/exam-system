import { getStore } from "@netlify/blobs";

export default async (req, ctx) => {
  const id = ctx.params.id;
  if (!/^\d{13}$/.test(id)) return new Response("bad request", { status: 400 });
  const r = await getStore("audio").getWithMetadata(id, { type: "arrayBuffer" });
  if (!r) return new Response("not found", { status: 404 });
  return new Response(r.data, {
    headers: { "content-type": r.metadata?.type || "audio/mpeg", "cache-control": "public, max-age=86400" },
  });
};

export const config = { path: "/api/audio/:id" };
