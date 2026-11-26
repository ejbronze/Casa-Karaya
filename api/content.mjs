import { getSession, json, readJsonBody } from './_lib/auth.mjs';
import { readContent, writeContent } from './_lib/content-store.mjs';

export default async function handler(req, res) {
  // The guide is public, so other apps (like the Casa Karaya TV screen) may read it.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const content = await readContent();
      json(res, 200, content);
    } catch (error) {
      json(res, 500, { error: error.message || 'Content could not be loaded.' });
    }
    return;
  }

  if (req.method === 'PUT') {
    // Only a signed-in admin may change the guide.
    if (!getSession(req)) {
      json(res, 401, { error: 'Sign in to save changes.' });
      return;
    }
    try {
      const payload = await readJsonBody(req);
      await writeContent(payload);
      json(res, 200, { ok: true });
    } catch (error) {
      json(res, 400, { error: error.message || 'Content update failed.' });
    }
    return;
  }

  json(res, 405, { error: 'Method not allowed.' });
}
