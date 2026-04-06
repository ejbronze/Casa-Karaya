import crypto from 'crypto';

const SESSION_COOKIE = 'casa_karaya_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme-casa-karaya';
const AUTH_SECRET = process.env.AUTH_SECRET || ADMIN_PASSWORD;

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, pair) => {
    const [rawName, ...rawValue] = pair.trim().split('=');
    if (!rawName) return cookies;
    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
}

function createSignature(payload) {
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
}

function createSessionToken(username) {
  const payload = {
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = createSignature(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes('.')) return null;

  const [encodedPayload, signature] = token.split('.');
  const expected = createSignature(encodedPayload);
  if (signature.length !== expected.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

function buildCookie(token, req, maxAge) {
  const proto = req.headers['x-forwarded-proto'];
  const isSecure = process.env.NODE_ENV === 'production' || proto === 'https';
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${isSecure ? '; Secure' : ''}`;
}

export function authenticate(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function setSessionCookie(req, res, username) {
  const token = createSessionToken(username);
  res.setHeader('Set-Cookie', buildCookie(token, req, SESSION_TTL_SECONDS));
}

export function clearSessionCookie(req, res) {
  res.setHeader('Set-Cookie', buildCookie('', req, 0));
}

export function getSession(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return verifyToken(cookies[SESSION_COOKIE]);
}

export function requireSession(req, res) {
  const session = getSession(req);
  if (session) {
    return session;
  }

  json(res, 401, { error: 'You must sign in to access this action.' });
  return null;
}

export function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload, null, 2));
}

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });

    req.on('error', reject);
  });
}
