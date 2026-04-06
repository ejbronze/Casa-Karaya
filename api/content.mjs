import { json, readJsonBody } from './_lib/auth.mjs';
import { readContent, writeContent } from './_lib/content-store.mjs';

export default async function handler(req, res) {
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
