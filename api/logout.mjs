import { clearSessionCookie, json } from './_lib/auth.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed.' });
    return;
  }

  clearSessionCookie(req, res);
  json(res, 200, { ok: true });
}
