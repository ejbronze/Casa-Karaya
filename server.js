import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const CONTENT_PATH = path.join(__dirname, 'content.json');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const contentTypeByExt = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers
  });
  response.end(JSON.stringify(payload, null, 2));
}

function sendText(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    ...headers
  });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'));
        request.destroy();
      }
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function readContentFile() {
  const raw = fs.readFileSync(CONTENT_PATH, 'utf8');
  return JSON.parse(raw);
}

function validateContentShape(content) {
  if (!content || typeof content !== 'object') {
    return 'Content payload must be an object.';
  }

  const requiredArrays = ['quickFacts', 'areas', 'appliances', 'houseRules', 'localTips', 'contacts'];
  for (const key of requiredArrays) {
    if (!Array.isArray(content[key])) {
      return `${key} must be an array.`;
    }
  }

  if (!content.site || typeof content.site !== 'object') {
    return 'site must be an object.';
  }

  return null;
}

function serveStaticFile(response, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypeByExt[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, file) => {
    if (error) {
      sendText(response, 404, 'Not found');
      return;
    }

    response.writeHead(200, { 'Content-Type': contentType });
    response.end(file);
  });
}

function resolveStaticPath(urlPath) {
  const route = urlPath === '/' ? '/index.html' : urlPath;
  const normalized = path.normalize(route).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(__dirname, normalized);

  if (!filePath.startsWith(__dirname)) {
    return null;
  }

  return filePath;
}

export async function requestListener(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);
  const { pathname } = url;

  if ((request.method === 'GET' || request.method === 'HEAD') && pathname === '/health') {
    sendJson(response, 200, {
      ok: true,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    });
    return;
  }

  if ((request.method === 'GET' || request.method === 'HEAD') && pathname === '/api/content') {
    try {
      sendJson(response, 200, readContentFile());
    } catch {
      sendJson(response, 500, { error: 'Content could not be loaded.' });
    }
    return;
  }

  if (request.method === 'PUT' && pathname === '/api/content') {
    try {
      const rawBody = await readBody(request);
      const nextContent = JSON.parse(rawBody || '{}');
      const validationError = validateContentShape(nextContent);

      if (validationError) {
        sendJson(response, 400, { error: validationError });
        return;
      }

      fs.writeFileSync(CONTENT_PATH, JSON.stringify(nextContent, null, 2) + '\n', 'utf8');
      sendJson(response, 200, { ok: true });
    } catch {
      sendJson(response, 400, { error: 'Content update failed.' });
    }
    return;
  }

  if ((request.method === 'GET' || request.method === 'HEAD') && pathname === '/admin') {
    serveStaticFile(response, path.join(__dirname, 'admin.html'));
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  const filePath = resolveStaticPath(pathname);
  if (!filePath) {
    sendText(response, 403, 'Forbidden');
    return;
  }

  serveStaticFile(response, filePath);
}

export const server = http.createServer(requestListener);

if (IS_PRODUCTION && ADMIN_PASSWORD === 'changeme-casa-karaya') {
  throw new Error('Set ADMIN_PASSWORD before starting Casa Karaya in production.');
}

if (process.argv[1] === __filename) {
  server.listen(PORT, HOST, () => {
    console.log(`Casa Karaya server running at http://${HOST}:${PORT}`);
    console.log(`Admin username: ${ADMIN_USERNAME}`);
    console.log('Set ADMIN_PASSWORD in your environment to change the default password.');
  });
}
