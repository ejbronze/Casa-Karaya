'use strict';

const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const heroSection = document.getElementById('hero');
const overlay = document.getElementById('overlay');
const pageLoader = document.getElementById('pageLoader');
const mapModal = document.getElementById('mapModal');
const mapLoader = document.getElementById('mapLoader');
const mapModalContent = document.getElementById('mapModalContent');
const mapModalClose = document.getElementById('mapModalClose');
const zonePanel = document.getElementById('zonePanel');
const zoneTitle = document.getElementById('zoneTitle');
const zoneContent = document.getElementById('zoneContent');
const zoneIcon = document.getElementById('zoneIcon');
const zoneClose = document.getElementById('zoneClose');
const heroEyebrow = document.getElementById('heroEyebrow');
const heroTitle = document.getElementById('heroTitle');
const heroSubtitle = document.getElementById('heroSubtitle');
const heroCta = document.getElementById('heroCta');
const heroFacts = document.getElementById('heroFacts');
const footerName = document.getElementById('footerName');
const footerLocation = document.getElementById('footerLocation');
const footerNote = document.getElementById('footerNote');
const quickGrid = document.getElementById('quickGrid');
const guideDashboard = document.getElementById('guideDashboard');
const guideModal = document.getElementById('guideModal');
const guideModalClose = document.getElementById('guideModalClose');
const guideModalShell = document.getElementById('guideModalShell');
const guideModalKicker = document.getElementById('guideModalKicker');
const guideModalIcon = document.getElementById('guideModalIcon');
const guideModalTitle = document.getElementById('guideModalTitle');
const guideModalSummary = document.getElementById('guideModalSummary');
const guideModalBody = document.getElementById('guideModalBody');
const rulesGrid = document.getElementById('rulesGrid');
const contactsGrid = document.getElementById('contactsGrid');

let currentZoneData = {};
let mapHasLoadedOnce = false;
let currentGuideModalData = null;
let guideModalView = 'details';
let currentGuideItems = [];

const defaultZoneMeta = {
  living: { title: 'Living / Dining', icon: iconTv() },
  kitchen: { title: 'Kitchen', icon: iconKitchen() },
  bedroom: { title: 'Bedroom #1', icon: iconBed() },
  bedroom2: { title: 'Bedroom #2', icon: iconBed() },
  bathroom: { title: 'Bathroom #1', icon: iconBath() },
  bathroom2: { title: 'Bathroom #2', icon: iconBath() },
  closet: { title: 'Closets', icon: iconCloset() },
  office: { title: 'Office', icon: iconOffice() },
  laundry: { title: 'Laundry', icon: iconLaundry() },
  balcony: { title: 'Balcony', icon: iconSun() },
  powder: { title: 'Powder Room', icon: iconPowder() }
};

function iconTv() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M9 20h6"/><path d="M12 17v3"/></svg>`;
}
function iconKitchen() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10h14v2a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-2Z"/><path d="M8 10V8.5A1.5 1.5 0 0 1 9.5 7h5A1.5 1.5 0 0 1 16 8.5V10"/><path d="M19 11h1a1 1 0 0 1 0 2h-1"/><path d="M5 11H4a1 1 0 0 0 0 2h1"/></svg>`;
}
function iconBed() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;
}
function iconBath() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`;
}
function iconCloset() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M12 3v18"/><circle cx="10" cy="12" r="0.8" fill="currentColor"/><circle cx="14" cy="12" r="0.8" fill="currentColor"/></svg>`;
}
function iconOffice() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l3.5-.8L18.8 7.9a1.8 1.8 0 0 0 0-2.5l-.2-.2a1.8 1.8 0 0 0-2.5 0L4.8 16.5 4 20Z"/><path d="M13.5 7.5l3 3"/></svg>`;
}
function iconLaundry() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l4.24 4.24"/></svg>`;
}
function iconSun() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M4.93 4.93l2.12 2.12"/><path d="M16.95 16.95l2.12 2.12"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="M4.93 19.07l2.12-2.12"/><path d="M16.95 7.05l2.12-2.12"/></svg>`;
}
function iconPowder() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="1.5"/><circle cx="12" cy="5.5" r="1"/><circle cx="14.5" cy="8" r="1.2"/><rect x="5" y="11" width="14" height="7" rx="3.5"/><path d="M9 14h6"/></svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function closeNavMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('show');
}

function syncBodyModalState() {
  const hasOpenModal = mapModal.classList.contains('open') || guideModal.classList.contains('open');
  document.body.classList.toggle('modal-open', hasOpenModal);
}

function updateNavVisibility() {
  if (!heroSection) return;
  const revealPoint = Math.max(heroSection.offsetHeight - nav.offsetHeight - 24, 80);
  const shouldShowNav = window.scrollY >= revealPoint;
  nav.classList.toggle('visible', shouldShowNav);
  nav.classList.toggle('scrolled', shouldShowNav);
  if (!shouldShowNav) {
    closeNavMenu();
  }
}

function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
  const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
  window.scrollTo({ top, behavior: 'smooth' });
}

function createBulletList(items) {
  if (!Array.isArray(items) || !items.length) {
    return '<p class="guide-note">Instructions will appear here.</p>';
  }

  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function toRoomHtml(title, items) {
  return `${createBulletList(items)}`;
}

function findArea(areas, name) {
  return areas.find((area) => area.name.toLowerCase() === name.toLowerCase());
}

function findAppliance(appliances, name) {
  return appliances.find((item) => item.name.toLowerCase() === name.toLowerCase());
}

function buildZoneData(content) {
  const areas = content.areas || [];
  const appliances = content.appliances || [];

  const living = findArea(areas, 'Living Room');
  const kitchen = findArea(areas, 'Kitchen');
  const bedroom = findArea(areas, 'Primary Bedroom');
  const bedroom2 = findArea(areas, 'Guest Bedroom');
  const balcony = findArea(areas, 'Balcony');
  const laundry = findAppliance(appliances, 'Washer and Dryer');
  const waterHeater = findAppliance(appliances, 'Water Heater');

  return {
    living: {
      ...defaultZoneMeta.living,
      content: toRoomHtml('Living / Dining', living?.instructions || [
        'Main lounge area for relaxing, dining, and gathering.',
        'Use the guide below for TV, WiFi, and guest essentials.'
      ])
    },
    kitchen: {
      ...defaultZoneMeta.kitchen,
      content: toRoomHtml('Kitchen', kitchen?.instructions || ['The kitchen instructions are available in the guide section below.'])
    },
    bedroom: {
      ...defaultZoneMeta.bedroom,
      content: toRoomHtml('Bedroom #1', bedroom?.instructions || ['Primary bedroom instructions can be updated from the admin page.'])
    },
    bedroom2: {
      ...defaultZoneMeta.bedroom2,
      content: toRoomHtml('Bedroom #2', bedroom2?.instructions || ['Guest bedroom instructions can be updated from the admin page.'])
    },
    balcony: {
      ...defaultZoneMeta.balcony,
      content: toRoomHtml('Balcony', balcony?.instructions || ['Balcony notes can be updated from the admin page.'])
    },
    laundry: {
      ...defaultZoneMeta.laundry,
      content: toRoomHtml('Laundry', laundry?.instructions || [
        'Washer and dryer are side-by-side units.',
        'Use one detergent pod per load.',
        'Leave the washer door open after use.'
      ])
    },
    bathroom: {
      ...defaultZoneMeta.bathroom,
      content: toRoomHtml('Bathroom #1', waterHeater?.instructions || [
        'Hot water uses the central water heater instructions in the guide.',
        'Extra towels and toiletries can be updated from the admin page.'
      ])
    },
    bathroom2: {
      ...defaultZoneMeta.bathroom2,
      content: toRoomHtml('Bathroom #2', waterHeater?.instructions || [
        'Shared bathroom for guests staying in Bedroom #2.',
        'Use the water heater instructions listed in the guide.'
      ])
    },
    office: {
      ...defaultZoneMeta.office,
      content: toRoomHtml('Office', [
        'Use this room for work, calls, or quiet time.',
        'Update this section in the admin page if the room setup changes.'
      ])
    },
    closet: {
      ...defaultZoneMeta.closet,
      content: toRoomHtml('Closets', [
        'Linen closet holds extra bathroom essentials.',
        'Bedroom closet spaces can be customized for each stay.',
        'Update stored items in the admin page whenever the setup changes.'
      ])
    },
    powder: {
      ...defaultZoneMeta.powder,
      content: toRoomHtml('Powder Room', [
        'Guest powder room near the corridor.',
        'Use this space for quick guest essentials and hand towels.'
      ])
    }
  };
}

function openZonePanel(zoneKey) {
  const data = currentZoneData[zoneKey];
  if (!data) return;

  if (zonePanel.classList.contains('open')) {
    zonePanel.classList.remove('swap');
    void zonePanel.offsetWidth;
    zonePanel.classList.add('swap');
  }

  zoneIcon.innerHTML = data.icon;
  zoneTitle.textContent = data.title;
  zoneContent.innerHTML = data.content;
  zonePanel.classList.add('open');

  document.querySelectorAll('.map-zone').forEach((zone) => zone.classList.remove('active'));
  const activeZone = document.querySelector(`.map-zone[data-room="${zoneKey}"]`);
  if (activeZone) activeZone.classList.add('active');
}

function closeZonePanel() {
  zonePanel.classList.remove('open');
  zonePanel.classList.remove('swap');
  document.querySelectorAll('.map-zone').forEach((zone) => zone.classList.remove('active'));
}

function openMapModal() {
  mapModal.classList.add('open');
  mapModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  overlay.classList.add('show');
  closeNavMenu();
  closeZonePanel();

  if (!mapHasLoadedOnce) {
    mapLoader.classList.add('active');
    mapModalContent.classList.remove('map-ready');
    window.setTimeout(() => {
      mapLoader.classList.remove('active');
      mapModalContent.classList.add('map-ready');
      mapHasLoadedOnce = true;
    }, 1150);
  } else {
    mapLoader.classList.remove('active');
    mapModalContent.classList.add('map-ready');
  }
}

function closeMapModal() {
  mapModal.classList.remove('open');
  mapModal.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('show');
  closeZonePanel();
  syncBodyModalState();
}

function renderHero(content) {
  const site = content.site || {};
  heroEyebrow.textContent = site.location || 'Evaristo Morales · Santo Domingo';
  heroTitle.textContent = site.heroTitle || 'Apartment Guide';
  heroSubtitle.innerHTML = `${escapeHtml(site.heroNote || 'Named for the Taíno moon goddess.')}<br />${escapeHtml(site.heroSubtitle || 'Your home, illuminated.')}`;
  heroCta.textContent = site.ctaLabel || 'Explore the Guide';
  footerName.textContent = site.name || 'Casa Karaya';
  footerLocation.innerHTML = `${escapeHtml(site.location || 'Evaristo Morales · Santo Domingo')}<br />Dominican Republic`;
  footerNote.innerHTML = `${escapeHtml(site.footerNote || 'Live editable guide')}<br />May your stay be luminous.`;
  heroFacts.innerHTML = '';
}

function renderQuickAccess(content) {
  const network = (content.quickFacts || []).find((fact) => fact.label.toLowerCase() === 'wifi');
  const ac = findAppliance(content.appliances || [], 'Air Conditioning');
  const water = findAppliance(content.appliances || [], 'Water Heater');
  const kitchen = findArea(content.areas || [], 'Kitchen');
  const tv = findAppliance(content.appliances || [], 'Smart TV');
  const visibleGuideIds = new Set(currentGuideItems.map((item) => item.id));

  const buttons = [
    { id: 'wifi', label: 'WiFi', target: 'guide-wifi', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>`, detail: network?.value || 'Internet' },
    { id: 'ac', label: 'A/C', target: 'guide-air-conditioning', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="8" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4"/><path d="M12 15v4"/><path d="M8 19h8"/></svg>`, detail: ac?.summary || 'Cooling' },
    { id: 'water', label: 'Hot Water', target: 'guide-water-heater', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10c0-5.5-4.5-10-10-10zm0 0c0 0-4 6-4 10a4 4 0 0 0 8 0c0-4-4-10-4-10z"/></svg>`, detail: water?.summary || 'Shower help' },
    { id: 'kitchen', label: 'Kitchen', target: 'room-kitchen', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="7" rx="1"/><path d="M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/><path d="M9 10v4h6v-4"/></svg>`, detail: kitchen?.summary || 'Cooking notes' },
    { id: 'map', label: 'Map', action: 'open-map', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6.5 9 4l6 2.5 6-2.5v13L15 19l-6-2.5L3 19v-12.5Z"/><path d="M9 4v12.5"/><path d="M15 6.5V19"/></svg>`, detail: 'Interactive layout' },
    { id: 'rules', label: 'House Rules', target: 'house-rules', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`, detail: 'Stay details' },
    { id: 'tips', label: 'Local Notes', target: 'guide-local-notes', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`, detail: 'Nearby favorites' },
    { id: 'tv', label: 'TV / Streaming', target: 'guide-smart-tv', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>`, detail: tv?.summary || 'Entertainment' }
  ].filter((button) => !button.target || !button.target.startsWith('guide-') && !button.target.startsWith('room-') || visibleGuideIds.has(button.target));

  quickGrid.innerHTML = buttons.map((button) => `
    <button class="quick-btn" data-target="${button.target || ''}" data-action="${button.action || ''}">
      <div class="quick-icon ${button.id === 'map' ? 'map-icon' : ''}">${button.icon}</div>
      <span>${escapeHtml(button.label)}</span>
      <small>${escapeHtml(button.detail)}</small>
    </button>
  `).join('');

  quickGrid.querySelectorAll('.quick-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.action === 'open-map') {
        openMapModal();
        return;
      }

      if (button.dataset.target) {
        const guideItem = currentGuideItems.find((item) => item.id === button.dataset.target);
        if (guideItem) {
          smoothScrollTo('apartment-guide');
          window.setTimeout(() => openGuideModal(guideItem), 360);
          return;
        }

        smoothScrollTo(button.dataset.target);
      }
    });
  });
}

function createInfoCard(rows) {
  return `
    <div class="info-card highlight-card">
      ${rows.map((row) => `
        <div class="info-row">
          <span class="info-label">${escapeHtml(row.label)}</span>
          <span class="info-value ${row.copy ? 'copy-text' : ''}" ${row.copy ? `data-copy="${escapeHtml(row.value)}"` : ''}>${escapeHtml(row.value)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function parseWifiPassword(detail) {
  if (!detail) return '';
  const match = String(detail).match(/password\s*[:\-]\s*(.+)/i);
  return match ? match[1].trim() : '';
}

function buildWifiQrUrl(ssid, password) {
  const payload = `WIFI:T:WPA;S:${ssid};P:${password};;`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(payload)}`;
}

function createGuideCard(item) {
  return `
    <button class="guide-card guide-card-${escapeHtml(item.theme || 'default')}" id="${escapeHtml(item.id)}" type="button" data-guide-item="${escapeHtml(item.id)}">
      <div class="guide-card-topline">${escapeHtml(item.kicker)}</div>
      <div class="guide-card-icon">${item.icon}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <span class="guide-card-cta">${escapeHtml(item.cta || 'Open details')}</span>
    </button>
  `;
}

function closeGuideModal() {
  guideModal.classList.remove('open');
  guideModal.setAttribute('aria-hidden', 'true');
  currentGuideModalData = null;
  guideModalView = 'details';
  syncBodyModalState();
}

function renderGuideModalView(item, view = 'details') {
  guideModalKicker.textContent = item.kicker;
  guideModalIcon.innerHTML = item.icon;
  guideModalTitle.textContent = item.title;
  guideModalSummary.textContent = item.summary;
  guideModalShell.classList.toggle('guide-modal-shell-tappable', item.type === 'wifi' && Boolean(item.qrUrl));

  if (item.type === 'wifi' && view === 'qr') {
    guideModalBody.innerHTML = `
      <div class="wifi-qr-panel">
        <p class="wifi-qr-kicker">Scan to join the network</p>
        <img src="${escapeHtml(item.qrUrl)}" alt="QR code for ${escapeHtml(item.network)}" class="wifi-qr-image" />
        <div class="wifi-qr-meta">
          <strong>${escapeHtml(item.network)}</strong>
          <span>${escapeHtml(item.password ? `Password: ${item.password}` : 'Open network')}</span>
        </div>
        <p class="guide-note">Tap anywhere on this panel to return to the network details.</p>
      </div>
    `;
    attachCopyActions();
    return;
  }

  guideModalBody.innerHTML = item.bodyHtml;
  attachCopyActions();
}

function openGuideModal(item, options = {}) {
  if (!item) return;
  currentGuideModalData = item;
  guideModalView = options.view || 'details';
  renderGuideModalView(item, guideModalView);
  guideModal.classList.add('open');
  guideModal.setAttribute('aria-hidden', 'false');
  closeNavMenu();
  syncBodyModalState();
}

function buildGuideItems(content) {
  const site = content.site || {};
  const facts = content.quickFacts || [];
  const appliances = content.appliances || [];
  const areas = content.areas || [];
  const localTips = content.localTips || [];

  const wifi = facts.find((fact) => fact.label.toLowerCase() === 'wifi');
  const wifiNetwork = wifi?.value || 'Update in admin';
  const wifiPassword = parseWifiPassword(wifi?.detail);
  const wifiBody = `
    ${createInfoCard([
      { label: 'Network', value: wifiNetwork, copy: wifiNetwork !== 'Update in admin' },
      { label: 'Details', value: wifi?.detail || 'Update in admin' }
    ])}
    <p class="guide-note">${escapeHtml(site.heroSubtitle || 'Keep your guest essentials clear and easy to copy.')}</p>
    <div class="tip-box"><strong>Tap the network name to copy it.</strong> Tap this panel again to reveal a scannable WiFi code for guests.</div>
  `;

  const wifiItem = {
    id: 'guide-wifi',
    type: 'wifi',
    kicker: 'Guest Essential',
    title: 'WiFi & Internet',
    summary: wifi?.detail || 'Tap in for network details and a scannable QR code.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>`,
    bodyHtml: wifiBody,
    cta: 'View WiFi',
    theme: 'wifi',
    network: wifiNetwork,
    password: wifiPassword,
    qrUrl: wifiNetwork !== 'Update in admin' && wifiPassword ? buildWifiQrUrl(wifiNetwork, wifiPassword) : ''
  };

  const applianceItems = appliances.map((appliance) => ({
    id: `guide-${slugify(appliance.name)}`,
    type: 'appliance',
    kicker: 'Appliance Guide',
    title: appliance.name,
    summary: appliance.summary || 'Open for step-by-step instructions.',
    icon: applianceIconFor(appliance.name),
    bodyHtml: `${appliance.summary ? `<p class="guide-note">${escapeHtml(appliance.summary)}</p>` : ''}${createBulletList(appliance.instructions)}`,
    cta: 'Open instructions',
    theme: 'appliance'
  }));

  const roomItems = areas.map((area) => ({
    id: `room-${slugify(area.name)}`,
    type: 'room',
    kicker: 'Room Notes',
    title: area.name,
    summary: area.summary || 'Open for the room details and guest notes.',
    icon: roomIconFor(area.name),
    bodyHtml: `${area.summary ? `<p class="guide-note">${escapeHtml(area.summary)}</p>` : ''}${createBulletList(area.instructions)}`,
    cta: 'Open room guide',
    theme: 'room'
  }));

  const localNotesItem = {
    id: 'guide-local-notes',
    type: 'local',
    kicker: 'Local Guide',
    title: 'Helpful Extras',
    summary: 'Nearby favorites, useful local notes, and stay extras in one place.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    bodyHtml: localTips.length ? localTips.map((tip) => `
      <div class="tip-card">
        <h3>${escapeHtml(tip.title)}</h3>
        ${createBulletList(tip.items)}
      </div>
    `).join('') : '<p class="guide-note">Local recommendations and extra notes can be added from the admin page.</p>',
    cta: 'Open local notes',
    theme: 'local'
  };

  const visibility = content.widgetVisibility || {};
  return [wifiItem, ...applianceItems, ...roomItems, localNotesItem]
    .filter((item) => visibility[item.id] !== false);
}

function renderGuide(content) {
  currentGuideItems = buildGuideItems(content);
  guideDashboard.innerHTML = currentGuideItems.map(createGuideCard).join('');

  guideDashboard.querySelectorAll('[data-guide-item]').forEach((card) => {
    card.addEventListener('click', () => {
      const item = currentGuideItems.find((entry) => entry.id === card.dataset.guideItem);
      openGuideModal(item);
    });
  });
}

function applianceIconFor(name) {
  const lower = name.toLowerCase();
  if (lower.includes('air')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="8" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4"/><path d="M12 15v4"/><path d="M8 19h8"/></svg>`;
  if (lower.includes('water')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10c0-5.5-4.5-10-10-10zm0 0c0 0-4 6-4 10a4 4 0 0 0 8 0c0-4-4-10-4-10z"/></svg>`;
  if (lower.includes('washer') || lower.includes('dryer')) return iconLaundry();
  if (lower.includes('coffee')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 10h14v2a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-2Z"/><path d="M8 10V8.5A1.5 1.5 0 0 1 9.5 7h5A1.5 1.5 0 0 1 16 8.5V10"/><path d="M19 11h1a1 1 0 0 1 0 2h-1"/></svg>`;
  return iconTv();
}

function roomIconFor(name) {
  const lower = name.toLowerCase();
  if (lower.includes('kitchen')) return iconKitchen();
  if (lower.includes('living')) return iconTv();
  if (lower.includes('bed')) return iconBed();
  if (lower.includes('balcony')) return iconSun();
  return iconCloset();
}

function renderRules(content) {
  const rules = content.houseRules || [];
  rulesGrid.innerHTML = rules.map((rule) => `
    <div class="rule-item">
      <div class="rule-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      </div>
      <div class="rule-text">
        <strong>${escapeHtml(rule.title)}</strong>
        <span>${escapeHtml(rule.description)}</span>
      </div>
    </div>
  `).join('');
}

function renderContacts(content) {
  const contacts = content.contacts || [];
  contactsGrid.innerHTML = contacts.map((contact, index) => `
    <div class="emergency-card ${index === 0 ? 'primary-contact' : ''}">
      <div class="emergency-card-label">${escapeHtml(contact.label)}</div>
      <div class="emergency-card-name">${escapeHtml(contact.name)}</div>
      <p class="emergency-card-copy">${escapeHtml(contact.description || '')}</p>
      ${contact.phone ? `<a href="tel:${escapeHtml(contact.phone)}" class="emergency-call-btn ${index === 0 ? '' : 'secondary'}">${escapeHtml(contact.phoneLabel || contact.phone)}</a>` : ''}
      ${contact.whatsapp ? `<a href="${escapeHtml(contact.whatsapp)}" class="emergency-whatsapp-btn" target="_blank" rel="noreferrer">WhatsApp</a>` : ''}
    </div>
  `).join('');
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function attachCopyActions() {
  document.querySelectorAll('.copy-text').forEach((element) => {
    element.addEventListener('click', async () => {
      const text = element.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const original = element.textContent;
        element.textContent = 'Copied';
        element.classList.add('copied');
        window.setTimeout(() => {
          element.textContent = original;
          element.classList.remove('copied');
        }, 1400);
      } catch {
        // Ignore clipboard fallback failures.
      }
    });
  });
}

function attachMapEvents() {
  document.querySelectorAll('.map-zone').forEach((zone) => {
    zone.addEventListener('click', () => {
      const key = zone.dataset.room;
      if (zonePanel.classList.contains('open') && zone.classList.contains('active')) {
        closeZonePanel();
      } else {
        openZonePanel(key);
      }
    });

    zone.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openZonePanel(zone.dataset.room);
      }
    });
  });
}

function hidePageLoader() {
  window.setTimeout(() => {
    pageLoader.classList.add('fade-out');
    window.setTimeout(() => pageLoader.remove(), 700);
  }, 900);
}

function renderContent(content) {
  renderHero(content);
  renderGuide(content);
  renderQuickAccess(content);
  renderRules(content);
  renderContacts(content);
  currentZoneData = buildZoneData(content);
}

async function loadContent() {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const content = await response.json();
    renderContent(content);
  } catch (error) {
    console.error(error);
    heroTitle.textContent = 'Guide unavailable';
    heroSubtitle.innerHTML = 'The editable content could not be loaded right now.<br />Please try again shortly.';
  }
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  overlay.classList.toggle('show', isOpen);
});

navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => closeNavMenu());
});

overlay.addEventListener('click', () => {
  closeNavMenu();
  if (mapModal.classList.contains('open')) {
    closeMapModal();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    closeNavMenu();
    smoothScrollTo(href.slice(1));
  });
});

document.getElementById('openMapHero').addEventListener('click', openMapModal);
document.getElementById('openMapTeaser').addEventListener('click', openMapModal);
mapModalClose.addEventListener('click', closeMapModal);
mapModal.querySelector('[data-close-map]').addEventListener('click', closeMapModal);
guideModalClose.addEventListener('click', closeGuideModal);
guideModal.querySelector('[data-close-guide]').addEventListener('click', closeGuideModal);
zoneClose.addEventListener('click', closeZonePanel);

guideModalShell.addEventListener('click', (event) => {
  if (!currentGuideModalData || currentGuideModalData.type !== 'wifi') return;
  if (event.target.closest('.guide-modal-close') || event.target.closest('.copy-text')) return;
  if (!currentGuideModalData.qrUrl) return;

  guideModalView = guideModalView === 'details' ? 'qr' : 'details';
  renderGuideModalView(currentGuideModalData, guideModalView);
});

window.addEventListener('scroll', updateNavVisibility, { passive: true });
window.addEventListener('resize', updateNavVisibility);
window.addEventListener('load', hidePageLoader);

const moonOrb = document.getElementById('moonOrb');
const arcs = document.querySelectorAll('.arc');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroHeight = heroSection.offsetHeight;
  if (scrollY > heroHeight) return;

  const progress = scrollY / heroHeight;
  if (moonOrb) {
    moonOrb.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + progress * 0.1})`;
  }

  arcs.forEach((arc, index) => {
    const speed = 0.1 + index * 0.05;
    arc.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * (index % 2 === 0 ? 0.05 : -0.04)}deg)`;
  });
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeGuideModal();
    closeZonePanel();
    closeNavMenu();
    closeMapModal();
  }
});

attachMapEvents();
updateNavVisibility();
loadContent();
