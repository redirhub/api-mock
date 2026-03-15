import { kv } from "@vercel/kv";

export async function GET(req, { params }) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '5');
  
  try {
    const logKey = `logs:${params.slug}`;
    const rawLogs = await kv.lrange(logKey, 0, limit - 1);
    
    const logs = rawLogs
      .map((l) => {
        try {
          return typeof l === 'string' ? JSON.parse(l) : l;
        } catch (e) {
          console.error('Failed to parse log entry:', l);
          return null;
        }
      })
      .filter((l) => l !== null);
    
    return Response.json({
      total: logs.length,
      slug: params.slug,
      limit,
      logs: logs
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to fetch logs',
      message: error.message 
    }, { status: 500 });
  }
}

