# Casa Karaya

Casa Karaya is a guest welcome guide for a real home stay, with a polished front-end experience and an unlinked admin editor for updating instructions, house notes, contacts, appliance details, and guide visibility.

The project now combines:

- A branded landing page with the original Casa Karaya visual language
- A logo-based loading animation on page load
- A full interactive apartment map inside a modal
- A dashboard-style apartment guide with card-based navigation
- Detail modals for each guide item, with a focused room-by-room or appliance-by-appliance flow
- A two-step WiFi experience that can reveal a scannable QR code for the network
- An unlinked admin editor at `/admin`
- A content API that persists edits
- Vercel Blob storage support for live production content

## Guest Experience

The public guide at `/` includes:

- A hero landing page styled to match the original design direction
- Quick access buttons for common guest needs
- An interactive map modal that uses the original apartment SVG layout
- A map loading animation before the interactive floor plan appears
- A dashboard of guide cards for WiFi, appliances, rooms, and guest instructions
- Guide detail modals with a dedicated close button in the top-right corner
- A WiFi modal flow that first shows network details and then reveals a guest-scannable QR code on the next tap
- House rules, local notes, and emergency contacts

This keeps the landing page feeling more like an interactive hospitality dashboard and less like a traditional FAQ or accordion list. Guests can move visually through the guide, open only what they need, and get focused instructions without losing the overall structure of the page.

## Admin Experience

The admin page at `/admin` allows you to update:

- Guide widget visibility, so individual guide cards can be turned on or off
- Site name, location, hero copy, and footer copy
- Quick facts
- Room and area instructions
- Appliance instructions
- House rules
- Local tips
- Important contacts

Those updates are immediately reflected in the live guest guide after saving.

The admin content model still drives the public experience, but the rendering layer now presents that content in multiple formats:

- Quick access shortcuts
- Interactive map room guidance
- Dashboard cards
- Guide detail modals
- WiFi QR reveal flow when network credentials are available

The admin page is no longer linked from the public navigation. It is intended to be accessed directly at `/admin`.

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

Guest-facing UI files:

- `index.html`
- `script.js`
- `styles.css`

These files control the guest landing page, modal system, interactive map presentation, dashboard card rendering, and the WiFi QR reveal experience.

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

- `/admin` is served as a clean URL and is intentionally not linked from the public navigation
- Editable content is persisted through Blob storage
- Guide widget visibility is stored with the same shared content payload
- Health endpoint is available at `/api/health`
- The guest guide is deployed as a branded static front-end plus serverless API routes for content and auth
- The WiFi QR experience is generated dynamically from saved WiFi credentials in the content payload

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
- The current public UI favors card-based guide discovery over accordion-style interaction
- Guide cards, room map overlays, and modal detail panels all read from the same saved content source
- The apartment guide and quick-entry flow now share a single section instead of two separate public sections

## Scripts

```bash
npm run dev
npm run start
npm run check
```
