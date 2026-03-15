import { kv } from "@vercel/kv";

async function saveLog(req, slug) {
  let body = {};
  try {
    body = await req.json();
  } catch {}

  const log = {
    slug,
    method: req.method,
    body,
    time: Date.now(),
    timestamp: new Date().toISOString(),
  };

  const logKey = `logs:${slug}`;
  await kv.lpush(logKey, JSON.stringify(log));
  await kv.ltrim(logKey, 0, 99);
  await kv.expire(logKey, 86400);
}

export async function POST(req, { params }) {
  await saveLog(req, params.slug);
  return Response.json({ ok: true, endpoint: params.slug });
}

export async function GET(req, { params }) {
  const query = Object.fromEntries(new URL(req.url).searchParams);
  
  const log = {
    slug: params.slug,
    method: "GET",
    query,
    time: Date.now(),
    timestamp: new Date().toISOString(),
  };

  const logKey = `logs:${params.slug}`;
  await kv.lpush(logKey, JSON.stringify(log));
  await kv.ltrim(logKey, 0, 99);
  await kv.expire(logKey, 86400);

  return Response.json({ ok: true, endpoint: params.slug });
}

export async function PUT(req, { params }) {
  await saveLog(req, params.slug);
  return Response.json({ ok: true, endpoint: params.slug });
}

export async function PATCH(req, { params }) {
  await saveLog(req, params.slug);
  return Response.json({ ok: true, endpoint: params.slug });
}

export async function DELETE(req, { params }) {
  await saveLog(req, params.slug);
  return Response.json({ ok: true, endpoint: params.slug });
}