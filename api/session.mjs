import { getSession, json } from './_lib/auth.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed.' });
    return;
  }

  json(res, 200, { authenticated: Boolean(getSession(req)) });
}
