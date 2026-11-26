import { verifyAdminIdToken } from './_lib/google.mjs';
import { json, readJsonBody, setSessionCookie } from './_lib/auth.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const email = await verifyAdminIdToken(body.idToken);
    setSessionCookie(req, res, email);
    json(res, 200, { ok: true, email });
  } catch (error) {
    json(res, error.status || 401, { error: error.status ? error.message : 'Google sign-in could not be verified. Please try again.' });
  }
}
