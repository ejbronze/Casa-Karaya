# Casa Karaya

Casa Karaya is a guest welcome guide for a real home stay, with a polished front-end experience and a protected admin editor for updating instructions, house notes, contacts, and appliance details.

The project now combines:

- A branded landing page with the original Casa Karaya visual language
- A logo-based loading animation on page load
- A full interactive apartment map inside a modal
- A protected admin area at `/admin`
- A content API that persists edits
- Vercel Blob storage support for live production content

## Guest Experience

The public guide at `/` includes:

- A hero landing page styled to match the original design direction
- Quick access buttons for common guest needs
- An interactive map modal that uses the original apartment SVG layout
- A map loading animation before the interactive floor plan appears
- Expandable guide sections for WiFi, appliances, rooms, and guest instructions
- House rules, local notes, and emergency contacts

## Admin Experience

The admin page at `/admin` allows you to sign in and update:

- Site name, location, hero copy, and footer copy
- Quick facts
- Room and area instructions
- Appliance instructions
- House rules
- Local tips
- Important contacts

Those updates are immediately reflected in the live guest guide after saving.

## Content Storage

### Local

When running locally, content falls back to `content.json`.

### Vercel

When deployed to Vercel, editable content is stored in Vercel Blob through the API routes in `api/`.

Relevant files:

- `api/content.mjs`
- `api/login.mjs`
- `api/logout.mjs`
- `api/session.mjs`
- `api/health.mjs`
- `api/_lib/auth.mjs`
- `api/_lib/content-store.mjs`

## Local Development

1. Copy `.env.example` to `.env` if you want custom local credentials.
2. Start the local server:

```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD=your-secure-password node server.js
```

3. Open:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/admin`

## Deployment

### Vercel

This repo is configured for Vercel deployment with `vercel.json`.

Required Vercel environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `BLOB_READ_WRITE_TOKEN`

Optional:

- `BLOB_CONTENT_PATH`

Notes:

- `/admin` is served as a clean URL
- Editable content is persisted through Blob storage
- Admin auth uses signed cookies
- Health endpoint is available at `/api/health`

### Other Node Hosts

The local Node server can still be used on traditional Node hosting.

Suggested settings:

- Start command: `npm start`
- Node version: `18+`

Required environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## Production Notes

- `npm start` runs the app with `NODE_ENV=production`
- Production startup refuses the default placeholder admin password
- The live Vercel deployment uses Blob-backed content instead of filesystem writes
- Pulled env files are ignored through `.gitignore`

## Scripts

```bash
npm run dev
npm run start
npm run check
```
