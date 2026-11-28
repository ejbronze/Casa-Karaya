import { verifyAdminIdToken } from './_lib/google.mjs';
import { json, readJsonBody } from './_lib/auth.mjs';
import { readContent, writeContent } from './_lib/content-store.mjs';

// The Casa Karaya Concierge portal is the one place to edit the details guests see on both
// the TV and this guide: Wi-Fi, house rules, contacts and local picks. When the host saves
// there, the portal sends those parts here. Only the host's Google account may do this.
const ALLOWED_ORIGINS = (process.env.UPLOAD_ORIGINS || 'https://casa-karaya-admin.vercel.app')
  .split(',').map((o) => o.trim()).filter(Boolean);

const str = (v, max = 400) => String(v == null ? '' : v).slice(0, max);

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { json(res, 405, { error: 'Method not allowed.' }); return; }

  try {
    const body = await readJsonBody(req);
    await verifyAdminIdToken(body.idToken);
    const patch = body.patch || {};
    const content = await readContent();

    if (patch.wifi && patch.wifi.ssid) {
      const others = (content.quickFacts || []).filter((f) => String(f.label).toLowerCase() !== 'wifi');
      content.quickFacts = [{ label: 'WiFi', value: str(patch.wifi.ssid, 80), detail: `Password: ${str(patch.wifi.pass, 80)}` }, ...others];
    }
    if (Array.isArray(patch.houseRules)) {
      content.houseRules = patch.houseRules.slice(0, 30).map((r) => ({ title: str(r.title, 120), description: str(r.description) }));
    }
    if (Array.isArray(patch.contacts)) {
      content.contacts = patch.contacts.slice(0, 10).map((c) => ({
        label: str(c.label, 40), name: str(c.name, 80), description: str(c.description), phone: str(c.phone, 30),
        phoneLabel: str(c.phoneLabel, 40), whatsapp: str(c.whatsapp, 120), primary: !!c.primary
      }));
    }
    if (Array.isArray(patch.localTips)) {
      content.localTips = patch.localTips.slice(0, 6).map((t) => ({ title: str(t.title, 80), items: (t.items || []).slice(0, 20).map((i) => str(i, 200)) }));
    }
    if (Array.isArray(patch.appliances)) {
      // update named appliances in place (summary and steps), leaving the rest alone
      patch.appliances.forEach((p) => {
        const a = (content.appliances || []).find((x) => String(x.name).toLowerCase() === String(p.name).toLowerCase());
        if (!a) return;
        if (p.summary != null) a.summary = str(p.summary);
        if (Array.isArray(p.instructions)) a.instructions = p.instructions.slice(0, 20).map((i) => str(i, 200));
      });
    }
    content.managedByPortal = ['wifi', 'houseRules', 'contacts', 'localTips'];
    await writeContent(content);
    json(res, 200, { ok: true });
  } catch (error) {
    json(res, error.status || 400, { error: error.message || 'Sync failed.' });
  }
}
