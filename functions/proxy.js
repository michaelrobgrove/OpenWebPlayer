// functions/proxy.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 1. Determine the target URL
  let targetUrl;
  
  if (request.method === 'POST') {
    // Handle JSON body for API requests
    try {
      const body = await request.json();
      targetUrl = body.url;
    } catch (e) {
      return new Response('Invalid JSON body', { status: 400 });
    }
  } else if (request.method === 'GET') {
    // Handle Query Parameter for Streaming (e.g., /proxy?url=http://...)
    targetUrl = url.searchParams.get('url');
  }

  if (!targetUrl) {
    return new Response('Missing "url" parameter', { status: 400 });
  }

  // 2. Fetch the upstream content
  // We strictly pass the original headers to look like a browser or player
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'OpenWebPlayer/1.0',
        'Accept': request.headers.get('Accept') || '*/*',
      }
    });

    // 3. Prepare the response headers
    // We filter out headers that might cause issues and add CORS
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.delete('Content-Encoding'); // Let Cloudflare handle compression
    newHeaders.delete('Content-Length');   // Chunked transfer for streams

    // 4. Return the stream directly
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });

  } catch (err) {
    return new Response(`Proxy Error: ${err.message}`, { status: 500 });
  }
}