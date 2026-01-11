// Cloudflare Pages Function to proxy IPTV requests
// This bypasses CORS restrictions and handles HTTP/HTTPS issues

export async function onRequest(context) {
  const { request } = context;
  
  // Only allow POST requests with JSON body
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { url, method = 'GET', headers = {} } = await request.json();
    
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate URL to prevent abuse
    const urlObj = new URL(url);
    const allowedPaths = ['/player_api.php', '.m3u', '.m3u8', '.xml'];
    const isAllowed = allowedPaths.some(path => 
      urlObj.pathname.includes(path) || urlObj.pathname.endsWith(path)
    );

    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'URL not allowed for proxying' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Make the proxied request
    const proxiedResponse = await fetch(url, {
      method,
      headers: {
        'User-Agent': 'OpenWebPlayer/1.0',
        ...headers
      }
    });

    // Get response body
    const contentType = proxiedResponse.headers.get('content-type') || '';
    let body;
    
    if (contentType.includes('application/json')) {
      body = await proxiedResponse.json();
    } else {
      body = await proxiedResponse.text();
    }

    // Return with CORS headers
    return new Response(JSON.stringify({
      status: proxiedResponse.status,
      statusText: proxiedResponse.statusText,
      headers: Object.fromEntries(proxiedResponse.headers),
      body,
      contentType
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}