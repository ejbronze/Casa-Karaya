import { createRemoteJWKSet, jwtVerify } from 'jose';
import { json, readJsonBody, setSessionCookie } from './_lib/auth.mjs';

// Admins sign in with Google (Firebase Auth, the same project as the TV portal).
const FIREBASE_PROJECT = process.env.FIREBASE_PROJECT_ID || 'casa-karaya-tv';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'erjaquez@gmail.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const GOOGLE_KEYS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const idToken = String(body.idToken || '');
    if (!idToken) {
      json(res, 400, { error: 'Sign in with Google to continue.' });
      return;
    }

    const { payload } = await jwtVerify(idToken, GOOGLE_KEYS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT}`,
      audience: FIREBASE_PROJECT
    });
    const email = String(payload.email || '').toLowerCase();

    if (!payload.email_verified || !ADMIN_EMAILS.includes(email)) {
      json(res, 403, { error: `${email || 'This account'} isn't allowed to edit the guide.` });
      return;
    }

    setSessionCookie(req, res, email);
    json(res, 200, { ok: true, email });
  } catch (error) {
    json(res, 401, { error: 'Google sign-in could not be verified. Please try again.' });
  }
}
