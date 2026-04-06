import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { list, put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const LOCAL_CONTENT_PATH = path.join(ROOT_DIR, 'content.json');
const BLOB_PATHNAME = process.env.BLOB_CONTENT_PATH || 'casa-karaya/content.json';

function validateContentShape(content) {
  if (!content || typeof content !== 'object') {
    return 'Content payload must be an object.';
  }

  const requiredArrays = ['quickFacts', 'areas', 'appliances', 'houseRules', 'localTips', 'contacts'];
  for (const key of requiredArrays) {
    if (!Array.isArray(content[key])) {
      return `${key} must be an array.`;
    }
  }

  if (!content.site || typeof content.site !== 'object') {
    return 'site must be an object.';
  }

  return null;
}

async function readLocalSeed() {
  const raw = await fs.readFile(LOCAL_CONTENT_PATH, 'utf8');
  return JSON.parse(raw);
}

async function readBlobContent() {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 10 });
  const blob = blobs.find((item) => item.pathname === BLOB_PATHNAME);

  if (!blob) {
    return null;
  }

  const response = await fetch(blob.url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Blob content could not be fetched.');
  }

  return response.json();
}

export async function readContent() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return readLocalSeed();
  }

  const existing = await readBlobContent();
  if (existing) {
    return existing;
  }

  const seed = await readLocalSeed();
  await writeContent(seed);
  return seed;
}

export async function writeContent(content) {
  const validationError = validateContentShape(content);
  if (validationError) {
    throw new Error(validationError);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    await fs.writeFile(LOCAL_CONTENT_PATH, JSON.stringify(content, null, 2) + '\n', 'utf8');
    return content;
  }

  await put(BLOB_PATHNAME, JSON.stringify(content, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8'
  });

  return content;
}
