import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Read target internal service base URL injected by Vercel binding
  const backendBaseUrl = process.env.BACKEND_URL;
  if (!backendBaseUrl) {
    return res.status(500).json({
      error: 'BACKEND_URL service binding is not configured in Vercel environment.',
    });
  }

  // Construct target URL using the internal service base URL
  const targetUrl = new URL(req.url || '', backendBaseUrl).toString();

  try {
    const forwardedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (
        key !== 'host' &&
        key !== 'connection' &&
        key !== 'content-length' &&
        typeof value === 'string'
      ) {
        forwardedHeaders[key] = value;
      }
    }

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    const bodyPayload = hasBody
      ? typeof req.body === 'object'
        ? JSON.stringify(req.body)
        : req.body
      : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: forwardedHeaders,
      body: bodyPayload,
    });

    const contentType = response.headers.get('content-type') || '';
    res.status(response.status);

    if (contentType.includes('application/json')) {
      const json = await response.json();
      return res.json(json);
    } else {
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to communicate with internal backend service',
      details: error.message,
    });
  }
}
