import { handleUpload } from '@vercel/blob/client';
import { verifyAdminIdToken } from './_lib/google.mjs';
import { json, readJsonBody } from './_lib/auth.mjs';

// Lets the Casa Karaya Concierge portal upload a welcome video straight to Blob storage.
// Only the host's Google account can request an upload.
const ALLOWED_ORIGINS = (process.env.UPLOAD_ORIGINS || 'https://casa-karaya-admin.vercel.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const email = await verifyAdminIdToken(clientPayload);
        if (!pathname.startsWith('tv-videos/')) throw new Error('Videos go in the tv-videos folder.');
        return {
          allowedContentTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ email })
        };
      },
      onUploadCompleted: async () => {}
    });
    json(res, 200, result);
  } catch (error) {
    json(res, error.status || 400, { error: error.message || 'Upload could not start.' });
  }
}
