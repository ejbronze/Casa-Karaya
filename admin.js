'use strict';

const editorPanel = document.getElementById('editorPanel');
const editorForm = document.getElementById('editorForm');
const statusBanner = document.getElementById('statusBanner');
const topActions = document.getElementById('topActions');
const saveTopButton = document.getElementById('saveTopButton');
const widgetVisibilityList = document.getElementById('widgetVisibilityList');

const repeaters = {
  quickFacts: document.getElementById('quickFactsList'),
  areas: document.getElementById('areasList'),
  appliances: document.getElementById('appliancesAdminList'),
  houseRules: document.getElementById('rulesAdminList'),
  localTips: document.getElementById('tipsAdminList'),
  contacts: document.getElementById('contactsAdminList')
};

let currentContent = null;

const templates = {
  quickFacts: () => ({ label: '', value: '', detail: '' }),
  areas: () => ({ name: '', summary: '', instructions: [] }),
  appliances: () => ({ name: '', summary: '', instructions: [] }),
  houseRules: () => ({ title: '', description: '' }),
  localTips: () => ({ title: '', items: [] }),
  contacts: () => ({ label: '', name: '', description: '', phone: '', phoneLabel: '', whatsapp: '', primary: false })
};

function showStatus(message, type = 'success') {
  statusBanner.textContent = message;
  statusBanner.className = `status-banner visible ${type}`;
}

function hideStatus() {
  statusBanner.className = 'status-banner';
  statusBanner.textContent = '';
}

function splitLines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderListItem(type, item, index) {
  const wrapper = document.createElement('article');
  wrapper.className = 'repeater-item';
  wrapper.dataset.type = type;
  wrapper.dataset.index = String(index);

  let fields = '';

  if (type === 'quickFacts') {
    fields = `
      <div class="form-grid">
        <div class="inline-field"><label>Label</label><input data-key="label" value="${escapeHtml(item.label || '')}" /></div>
        <div class="inline-field"><label>Value</label><input data-key="value" value="${escapeHtml(item.value || '')}" /></div>
        <div class="inline-field full-width"><label>Detail</label><textarea data-key="detail">${escapeHtml(item.detail || '')}</textarea></div>
      </div>
    `;
  }

  if (type === 'areas' || type === 'appliances') {
    fields = `
      <div class="form-grid">
        <div class="inline-field"><label>Name</label><input data-key="name" value="${escapeHtml(item.name || '')}" /></div>
        <div class="inline-field full-width"><label>Summary</label><textarea data-key="summary">${escapeHtml(item.summary || '')}</textarea></div>
        <div class="inline-field full-width"><label>Instructions (one per line)</label><textarea data-key="instructions">${escapeHtml((item.instructions || []).join('\n'))}</textarea></div>
      </div>
    `;
  }

  if (type === 'houseRules') {
    fields = `
      <div class="form-grid">
        <div class="inline-field"><label>Rule Title</label><input data-key="title" value="${escapeHtml(item.title || '')}" /></div>
        <div class="inline-field full-width"><label>Description</label><textarea data-key="description">${escapeHtml(item.description || '')}</textarea></div>
      </div>
    `;
  }

  if (type === 'localTips') {
    fields = `
      <div class="form-grid">
        <div class="inline-field"><label>Tip Group Title</label><input data-key="title" value="${escapeHtml(item.title || '')}" /></div>
        <div class="inline-field full-width"><label>Items (one per line)</label><textarea data-key="items">${escapeHtml((item.items || []).join('\n'))}</textarea></div>
      </div>
    `;
  }

  if (type === 'contacts') {
    fields = `
      <div class="form-grid">
        <div class="inline-field"><label>Label</label><input data-key="label" value="${escapeHtml(item.label || '')}" /></div>
        <div class="inline-field"><label>Name</label><input data-key="name" value="${escapeHtml(item.name || '')}" /></div>
        <div class="inline-field full-width"><label>Description</label><textarea data-key="description">${escapeHtml(item.description || '')}</textarea></div>
        <div class="inline-field"><label>Phone</label><input data-key="phone" value="${escapeHtml(item.phone || '')}" /></div>
        <div class="inline-field"><label>Phone Label</label><input data-key="phoneLabel" value="${escapeHtml(item.phoneLabel || '')}" /></div>
        <div class="inline-field"><label>WhatsApp Link</label><input data-key="whatsapp" value="${escapeHtml(item.whatsapp || '')}" /></div>
        <div class="inline-field"><label>Primary Contact</label><input data-key="primary" type="checkbox" ${item.primary ? 'checked' : ''} /></div>
      </div>
    `;
  }

  wrapper.innerHTML = `
    <div class="repeater-item-head">
      <h4>${humanizeType(type)} ${index + 1}</h4>
      <button class="danger-button" type="button" data-remove-item="${type}">Remove</button>
    </div>
    ${fields}
  `;

  return wrapper;
}

function humanizeType(type) {
  return {
    quickFacts: 'Fact',
    areas: 'Area',
    appliances: 'Appliance',
    houseRules: 'Rule',
    localTips: 'Tip Group',
    contacts: 'Contact'
  }[type] || 'Item';
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function fillSiteFields(content) {
  document.getElementById('siteName').value = content.site.name || '';
  document.getElementById('siteLocationField').value = content.site.location || '';
  document.getElementById('heroEyebrowField').value = content.site.heroEyebrow || '';
  document.getElementById('heroTitleField').value = content.site.heroTitle || '';
  document.getElementById('heroSubtitleField').value = content.site.heroSubtitle || '';
  document.getElementById('ctaLabelField').value = content.site.ctaLabel || '';
  document.getElementById('heroNoteField').value = content.site.heroNote || '';
  document.getElementById('footerNoteField').value = content.site.footerNote || '';
}

function buildWidgetDefinitions(content) {
  return [
    { id: 'guide-wifi', label: 'WiFi & Internet', detail: 'Guest Essential' },
    ...(content.appliances || []).map((item) => ({
      id: `guide-${slugify(item.name)}`,
      label: item.name || 'Untitled Appliance',
      detail: 'Appliance Guide'
    })),
    ...(content.areas || []).map((item) => ({
      id: `room-${slugify(item.name)}`,
      label: item.name || 'Untitled Area',
      detail: 'Room Notes'
    })),
    { id: 'guide-local-notes', label: 'Helpful Extras', detail: 'Local Guide' }
  ];
}

function renderWidgetVisibility(content) {
  const visibility = content.widgetVisibility || {};
  const widgets = buildWidgetDefinitions(content);

  widgetVisibilityList.innerHTML = widgets.map((widget) => `
    <article class="repeater-item">
      <div class="repeater-item-head">
        <h4>${escapeHtml(widget.label)}</h4>
        <span class="helper-copy">${escapeHtml(widget.detail)}</span>
      </div>
      <div class="form-grid">
        <div class="inline-field">
          <label class="checkbox-row">
            <input type="checkbox" data-widget-key="${escapeHtml(widget.id)}" ${visibility[widget.id] !== false ? 'checked' : ''} />
            <span>Show this guide widget</span>
          </label>
        </div>
      </div>
    </article>
  `).join('');
}

function renderRepeater(type, items) {
  const container = repeaters[type];
  container.innerHTML = '';
  items.forEach((item, index) => {
    container.appendChild(renderListItem(type, item, index));
  });
}

function renderEditor(content) {
  currentContent = structuredClone(content);
  fillSiteFields(currentContent);
  renderWidgetVisibility(currentContent);
  renderRepeater('quickFacts', currentContent.quickFacts || []);
  renderRepeater('areas', currentContent.areas || []);
  renderRepeater('appliances', currentContent.appliances || []);
  renderRepeater('houseRules', currentContent.houseRules || []);
  renderRepeater('localTips', currentContent.localTips || []);
  renderRepeater('contacts', currentContent.contacts || []);
  markPortalManaged(currentContent);
}

// Wi-Fi, house rules, contacts and local picks are edited in the Casa Karaya Concierge portal,
// which keeps the TV and this guide in step. Show them here as read-only so nothing drifts apart.
function markPortalManaged(content) {
  document.querySelectorAll('.portal-note').forEach((n) => n.remove());
  const managed = content.managedByPortal || [];
  const where = { quickFacts: 'Screen → Wi-Fi', houseRules: 'Screen → House rules', localTips: 'Screen → Neighborhood map (your picks and city spots)', contacts: 'Screen → Host & WhatsApp and Building concierge' };
  ['quickFacts', 'houseRules', 'localTips', 'contacts'].forEach((type) => {
    const key = type === 'quickFacts' ? 'wifi' : type;
    if (!managed.includes(key)) return;
    const list = repeaters[type];
    const section = list.closest('.panel-section');
    const note = document.createElement('p');
    note.className = 'helper-copy portal-note';
    note.innerHTML = `${type === 'quickFacts' ? 'The WiFi entry is' : 'This section is'} managed in the <a href="https://casa-karaya-admin.vercel.app/#screen" target="_blank" rel="noopener">Casa Karaya Concierge portal</a> (${where[type]}), so the TV and this guide always match.`;
    list.before(note);
    if (type === 'quickFacts') {
      list.querySelectorAll('.repeater-item').forEach((item) => {
        const label = item.querySelector('input');
        if (label && /wifi/i.test(label.value)) item.querySelectorAll('input, textarea, button').forEach((el) => { el.disabled = true; });
      });
      return;
    }
    list.querySelectorAll('input, textarea, button, select').forEach((el) => { el.disabled = true; });
    const add = section && section.querySelector('[data-add-list-item]');
    if (add) add.hidden = true;
  });
}

function readWidgetVisibility() {
  const nodes = widgetVisibilityList.querySelectorAll('[data-widget-key]');
  return Object.fromEntries(Array.from(nodes).map((node) => [node.dataset.widgetKey, node.checked]));
}

function readRepeater(type) {
  const nodes = repeaters[type].querySelectorAll('.repeater-item');
  return Array.from(nodes).map((node) => {
    if (type === 'quickFacts') {
      return {
        label: node.querySelector('[data-key="label"]').value.trim(),
        value: node.querySelector('[data-key="value"]').value.trim(),
        detail: node.querySelector('[data-key="detail"]').value.trim()
      };
    }

    if (type === 'areas' || type === 'appliances') {
      return {
        name: node.querySelector('[data-key="name"]').value.trim(),
        summary: node.querySelector('[data-key="summary"]').value.trim(),
        instructions: splitLines(node.querySelector('[data-key="instructions"]').value)
      };
    }

    if (type === 'houseRules') {
      return {
        title: node.querySelector('[data-key="title"]').value.trim(),
        description: node.querySelector('[data-key="description"]').value.trim()
      };
    }

    if (type === 'localTips') {
      return {
        title: node.querySelector('[data-key="title"]').value.trim(),
        items: splitLines(node.querySelector('[data-key="items"]').value)
      };
    }

    if (type === 'contacts') {
      return {
        label: node.querySelector('[data-key="label"]').value.trim(),
        name: node.querySelector('[data-key="name"]').value.trim(),
        description: node.querySelector('[data-key="description"]').value.trim(),
        phone: node.querySelector('[data-key="phone"]').value.trim(),
        phoneLabel: node.querySelector('[data-key="phoneLabel"]').value.trim(),
        whatsapp: node.querySelector('[data-key="whatsapp"]').value.trim(),
        primary: node.querySelector('[data-key="primary"]').checked
      };
    }

    return {};
  });
}

function collectContentFromForm() {
  return {
    site: {
      name: document.getElementById('siteName').value.trim(),
      location: document.getElementById('siteLocationField').value.trim(),
      heroEyebrow: document.getElementById('heroEyebrowField').value.trim(),
      heroTitle: document.getElementById('heroTitleField').value.trim(),
      heroSubtitle: document.getElementById('heroSubtitleField').value.trim(),
      ctaLabel: document.getElementById('ctaLabelField').value.trim(),
      heroNote: document.getElementById('heroNoteField').value.trim(),
      footerNote: document.getElementById('footerNoteField').value.trim()
    },
    widgetVisibility: readWidgetVisibility(),
    quickFacts: readRepeater('quickFacts'),
    areas: readRepeater('areas'),
    appliances: readRepeater('appliances'),
    houseRules: readRepeater('houseRules'),
    localTips: readRepeater('localTips'),
    contacts: readRepeater('contacts'),
    ...(currentContent && currentContent.managedByPortal ? { managedByPortal: currentContent.managedByPortal } : {})
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.error) {
        message = data.error;
      }
    } catch {
      // Ignore parse failures and use the default message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function loadEditor() {
  try {
    const content = await fetchJson('/api/content');
    renderEditor(content);
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

editorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideStatus();

  try {
    const nextContent = collectContentFromForm();
    await fetchJson('/api/content', {
      method: 'PUT',
      body: JSON.stringify(nextContent)
    });
    currentContent = nextContent;
    showStatus('Content saved. The guest page now uses the updated information.');
  } catch (error) {
    showStatus(error.message, 'error');
  }
});

document.addEventListener('click', async (event) => {
  const addButton = event.target.closest('[data-add-list-item]');
  if (addButton) {
    const type = addButton.dataset.addListItem;
    const nextItems = readRepeater(type);
    nextItems.push(templates[type]());
    renderRepeater(type, nextItems);
    const draftContent = {
      ...(currentContent || {}),
      widgetVisibility: readWidgetVisibility(),
      areas: type === 'areas' ? nextItems : readRepeater('areas'),
      appliances: type === 'appliances' ? nextItems : readRepeater('appliances')
    };
    renderWidgetVisibility(draftContent);
    return;
  }

  const removeButton = event.target.closest('[data-remove-item]');
  if (removeButton) {
    const type = removeButton.dataset.removeItem;
    const item = removeButton.closest('.repeater-item');
    const index = Number(item.dataset.index);
    const nextItems = readRepeater(type).filter((_, itemIndex) => itemIndex !== index);
    renderRepeater(type, nextItems);
    const draftContent = {
      ...(currentContent || {}),
      widgetVisibility: readWidgetVisibility(),
      areas: type === 'areas' ? nextItems : readRepeater('areas'),
      appliances: type === 'appliances' ? nextItems : readRepeater('appliances')
    };
    renderWidgetVisibility(draftContent);
    return;
  }
});

saveTopButton.addEventListener('click', () => {
  editorForm.requestSubmit();
});

// Saving requires an admin session, so show a Google sign-in step first when needed.
const signinPanel = document.getElementById('signinPanel');
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBXaJdtZeYiyPqkNasMJYpWBwuaqUm6b14',
  authDomain: 'casa-karaya-tv.firebaseapp.com',
  projectId: 'casa-karaya-tv',
  appId: '1:466359122734:web:1b6a0826836fbe851c58bf'
};

function showEditor() {
  signinPanel.classList.add('hide');
  editorPanel.classList.remove('hide');
  topActions.classList.remove('hide');
  loadEditor();
}

function showSignin() {
  editorPanel.classList.add('hide');
  topActions.classList.add('hide');
  signinPanel.classList.remove('hide');
}

document.getElementById('googleSignIn').addEventListener('click', async () => {
  hideStatus();
  try {
    if (!window.firebase) throw new Error('Google sign-in could not load. Check your connection and reload.');
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    const result = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const idToken = await result.user.getIdToken();
    await fetchJson('/api/login', { method: 'POST', body: JSON.stringify({ idToken }) });
    await firebase.auth().signOut();
    showEditor();
  } catch (error) {
    if (error && error.code === 'auth/popup-closed-by-user') return;
    showStatus(error.message || 'Sign-in did not finish.', 'error');
  }
});

document.getElementById('signOutButton').addEventListener('click', async () => {
  try { await fetchJson('/api/logout', { method: 'POST' }); } catch { /* already signed out */ }
  showSignin();
});

editorPanel.classList.add('hide');
fetchJson('/api/session')
  .then((session) => (session && session.authenticated ? showEditor() : showSignin()))
  .catch(() => showSignin());
