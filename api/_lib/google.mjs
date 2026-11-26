import { createRemoteJWKSet, jwtVerify } from 'jose';

// The host signs in with Google (Firebase Auth project shared with the TV portal).
const FIREBASE_PROJECT = process.env.FIREBASE_PROJECT_ID || 'casa-karaya-tv';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'erjaquez@gmail.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const GOOGLE_KEYS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

// Returns the admin's email, or throws if the token is invalid or not an admin.
export async function verifyAdminIdToken(idToken) {
  if (!idToken) throw new Error('Sign in with Google to continue.');
  const { payload } = await jwtVerify(String(idToken), GOOGLE_KEYS, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT}`,
    audience: FIREBASE_PROJECT
  });
  const email = String(payload.email || '').toLowerCase();
  if (!payload.email_verified || !ADMIN_EMAILS.includes(email)) {
    const error = new Error(`${email || 'This account'} isn't allowed to make changes.`);
    error.status = 403;
    throw error;
  }
  return email;
}
