import { authenticate, json, readJsonBody, setSessionCookie } from './_lib/auth.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const username = String(body.username || '');
    const password = String(body.password || '');

    if (!authenticate(username, password)) {
      json(res, 401, { error: 'Invalid username or password.' });
      return;
    }

    setSessionCookie(req, res, username);
    json(res, 200, { ok: true });
  } catch (error) {
    json(res, 400, { error: error.message || 'Login request could not be processed.' });
  }
}
