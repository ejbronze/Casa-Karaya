/* ============================================================
   CASA KARAYA — script.js
   Interactions, animations, and dynamic behavior
   ============================================================ */

'use strict';

/* === NAV SCROLL BEHAVIOR === */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const heroSection = document.getElementById('hero');
const overlay = document.getElementById('overlay');

function closeNavMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  overlay.classList.remove('show');
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

window.addEventListener('scroll', updateNavVisibility, { passive: true });
window.addEventListener('resize', updateNavVisibility);

/* === HAMBURGER MENU === */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  overlay.classList.toggle('show', isOpen);
});

// Close nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    closeNavMenu();
  });
});

// Close on overlay click
overlay.addEventListener('click', () => {
  closeNavMenu();
  // Also close zone panel
  closeZonePanel();
});


/* === SMOOTH SCROLL (fallback for older browsers) === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* === QUICK ACCESS BUTTONS → SCROLL + OPEN ACCORDION === */
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;

    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });

    // If target is an accordion item, open it
    setTimeout(() => {
      if (target.classList.contains('accordion-item')) {
        openAccordion(target);
      }
    }, 500);
  });
});


/* === ACCORDION === */
function openAccordion(item) {
  if (item.classList.contains('open')) return;

  // Optionally close others in same group
  const siblings = item.parentElement.querySelectorAll('.accordion-item.open');
  siblings.forEach(sib => {
    if (sib !== item) closeAccordion(sib);
  });

  item.classList.add('open');
}

function closeAccordion(item) {
  item.classList.remove('open');
}

document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    if (item.classList.contains('open')) {
      closeAccordion(item);
    } else {
      openAccordion(item);
    }
  });
});


/* === COPY TO CLIPBOARD === */
document.querySelectorAll('.copy-text').forEach(el => {
  el.addEventListener('click', async () => {
    const text = el.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      el.classList.add('copied');
      const original = el.textContent;
      el.textContent = '✓ Copied!';
      setTimeout(() => {
        el.textContent = original;
        el.classList.remove('copied');
      }, 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      el.classList.add('copied');
      setTimeout(() => el.classList.remove('copied'), 1500);
    }
  });
});


/* === INTERACTIVE APARTMENT MAP === */
const zoneData = {
  entrance: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8m4-9-4-4m4 4-4 4m4-4H9"/></svg>`,
    title: 'Entry',
    content: `<ul>
      <li><strong>Door code:</strong> 2847 (keypad on door)</li>
      <li>Keys are on the entry table. Extra key in the kitchen drawer.</li>
      <li>Shoe rack on the left — please use it indoors.</li>
      <li>Main light switch to the right of the door.</li>
      <li>Electric panel is in the hall closet.</li>
    </ul>`
  },
  living: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M9 20h6"/><path d="M12 17v3"/></svg>`,
    title: 'Living / Dining',
    content: `<ul>
      <li>65" Samsung Smart TV — streaming apps pre-installed.</li>
      <li>Dining table seats 4. Extra chairs behind the kitchen door.</li>
      <li>Bluetooth speaker on shelf — connect to <strong>"KarayaSound"</strong>.</li>
      <li>WiFi network: <strong>Apt903</strong> / password: <strong>Britney10!</strong>.</li>
      <li>Router is in the dining room area behind the jalousie windows.</li>
      <li>Tap the lower-right corner of the living room painting to connect an NFC/RFID-enabled device.</li>
      <li>A/C remote on the coffee table. Dimmer on side wall.</li>
    </ul>`
  },
  kitchen: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10h14v2a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-2Z"/><path d="M8 10V8.5A1.5 1.5 0 0 1 9.5 7h5A1.5 1.5 0 0 1 16 8.5V10"/><path d="M19 11h1a1 1 0 0 1 0 2h-1"/><path d="M5 11H4a1 1 0 0 0 0 2h1"/></svg>`,
    title: 'Kitchen',
    content: `<ul>
      <li>4-burner electric stove — turn all knobs to OFF after cooking.</li>
      <li>Nespresso machine on counter — pods in top cabinet.</li>
      <li>Essentials stocked: salt, pepper, olive oil, coffee.</li>
      <li>Trash under the sink. Recyclables in the blue bin.</li>
      <li>Dish soap and sponge under the sink.</li>
    </ul>`
  },
  bedroom: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`,
    title: 'Bedroom #1',
    content: `<ul>
      <li>King bed with hotel-quality 600TC linens.</li>
      <li>Blackout curtains — pull cord on left side.</li>
      <li>USB-A + USB-C ports on both bedside tables.</li>
      <li>A/C remote on the nightstand.</li>
      <li>Walk-in closet connects through the right door.</li>
    </ul>`
  },
  bedroom2: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`,
    title: 'Bedroom #2',
    content: `<ul>
      <li>Queen bed with premium linens.</li>
      <li>USB charging ports on both bedside tables.</li>
      <li>Shared bathroom (Bathroom #2) through the connecting door.</li>
      <li>Blackout curtains — cord on right side.</li>
      <li>A/C vent controlled from main thermostat in hallway.</li>
    </ul>`
  },
  bathroom: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
    title: 'Bathroom #1',
    content: `<ul>
      <li>Hot water: turn on the switch in the hallway panel, wait <strong>10–15 min</strong>.</li>
      <li>Towels refreshed every 3 days. Extras in the closet.</li>
      <li>Complimentary toiletries in the basket.</li>
      <li>Hair dryer under the sink.</li>
    </ul>`
  },
  bathroom2: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
    title: 'Bathroom #2',
    content: `<ul>
      <li>Shared bathroom for Bedroom #2.</li>
      <li>Same hot water switch in the hallway panel.</li>
      <li>Towels on the rack — extras in the linen closet.</li>
      <li>Toiletries in the basket under the sink.</li>
    </ul>`
  },
  closet: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M12 3v18"/><circle cx="10" cy="12" r="0.8" fill="currentColor"/><circle cx="14" cy="12" r="0.8" fill="currentColor"/></svg>`,
    title: 'Closets',
    content: `<ul>
      <li><strong>Linen closet:</strong> extra towels and bathroom essentials.</li>
      <li><strong>Bedroom #2 closet:</strong> standard hanging/storage space for guests staying in Bedroom #2.</li>
      <li><strong>Walk-in closet:</strong> for Bedroom #1, with hangers, the safe, iron, ironing board, and extra blankets and pillows.</li>
    </ul>`
  },
  office: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l3.5-.8L18.8 7.9a1.8 1.8 0 0 0 0-2.5l-.2-.2a1.8 1.8 0 0 0-2.5 0L4.8 16.5 4 20Z"/><path d="M13.5 7.5l3 3"/></svg>`,
    title: 'Office',
    content: `<ul>
      <li>Work desk with ergonomic chair and good natural light.</li>
      <li>WiFi extender inside — strong signal for video calls.</li>
      <li>USB-C and USB-A power strip on the desk.</li>
      <li>Can double as a third sleeping space with the pull-out.</li>
    </ul>`
  },
  laundry: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l4.24 4.24"/></svg>`,
    title: 'Laundry',
    content: `<ul>
      <li>Washer and dryer are side-by-side units.</li>
      <li>Detergent pods in cabinet above — use <strong>1 pod</strong> per load.</li>
      <li>Select <strong>Normal / Cold</strong> cycle for most items.</li>
      <li>Clean dryer lint trap before each use.</li>
      <li>Leave washer door open after use to prevent odor.</li>
    </ul>`
  },
  balcony: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M4.93 4.93l2.12 2.12"/><path d="M16.95 16.95l2.12 2.12"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="M4.93 19.07l2.12-2.12"/><path d="M16.95 7.05l2.12-2.12"/></svg>`,
    title: 'Balcony',
    content: `<ul>
      <li>Sliding door — lift handle slightly upward, then slide right.</li>
      <li>Two chairs and side table provided.</li>
      <li>City views of Evaristo Morales.</li>
      <li><strong>No smoking</strong> on the balcony.</li>
      <li>Do not place objects on the railing ledge.</li>
    </ul>`
  },
  powder: {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="1.5"/><circle cx="12" cy="5.5" r="1"/><circle cx="14.5" cy="8" r="1.2"/><rect x="5" y="11" width="14" height="7" rx="3.5"/><path d="M9 14h6"/></svg>`,
    title: 'Powder Room',
    content: `<ul>
      <li>Guest powder room near the entry corridor.</li>
      <li>Hand soap, towels, and quick guest essentials go here.</li>
      <li>Instructions placeholder.</li>
    </ul>`
  }
};

const zonePanel = document.getElementById('zonePanel');
const zoneTitle = document.getElementById('zoneTitle');
const zoneContent = document.getElementById('zoneContent');
const zoneIcon = document.getElementById('zoneIcon');
const zoneClose = document.getElementById('zoneClose');

function openZonePanel(zoneKey) {
  const data = zoneData[zoneKey];
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

  // Highlight active zone
  document.querySelectorAll('.map-zone').forEach(z => z.classList.remove('active'));
  const activeZone = document.querySelector(`.map-zone[data-room="${zoneKey}"]`);
  if (activeZone) activeZone.classList.add('active');
}

function closeZonePanel() {
  zonePanel.classList.remove('open');
  zonePanel.classList.remove('swap');
  document.querySelectorAll('.map-zone').forEach(z => z.classList.remove('active'));
}

document.querySelectorAll('.map-zone').forEach(zone => {
  zone.addEventListener('click', () => {
    const key = zone.dataset.room;
    if (zonePanel.classList.contains('open') && zone.classList.contains('active')) {
      closeZonePanel();
    } else {
      openZonePanel(key);
    }
  });

  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openZonePanel(zone.dataset.room);
    }
  });
});

zoneClose.addEventListener('click', closeZonePanel);


/* === PARALLAX HERO === */
const moonOrb = document.getElementById('moonOrb');
const arcs = document.querySelectorAll('.arc');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroH = document.querySelector('.hero').offsetHeight;
  if (scrollY > heroH) return;

  const p = scrollY / heroH;

  if (moonOrb) {
    moonOrb.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + p * 0.1})`;
  }

  arcs.forEach((arc, i) => {
    const speed = 0.1 + i * 0.05;
    arc.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * (i % 2 === 0 ? 0.05 : -0.04)}deg)`;
  });
}, { passive: true });


/* === SCROLL REVEAL === */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

// Add reveal class to elements
const revealSelectors = [
  '.quick-btn',
  '.accordion-item',
  '.building-card',
  '.rule-item',
  '.feature-tile',
  '.emergency-card',
  '.section-title',
  '.section-label',
  '.section-sub'
];

revealSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
    revealObserver.observe(el);
  });
});


/* === ACTIVE NAV LINK ON SCROLL === */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active-nav');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));


/* === TOUCH RIPPLE ON QUICK BUTTONS === */
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('pointerdown', (e) => {
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: rgba(242,201,76,0.15);
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      pointer-events: none;
      animation: rippleAnim 0.6s ease-out forwards;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    from { transform: scale(0); opacity: 1; }
    to { transform: scale(1); opacity: 0; }
  }
  .nav-link.active-nav { color: var(--gold) !important; }
  .nav-link.active-nav::after { transform: scaleX(1) !important; }
`;
document.head.appendChild(style);


/* === BUILDING CARD HOVER TILT === */
document.querySelectorAll('.building-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* === FEATURE TILE SUBTLE GLOW ON HOVER === */
document.querySelectorAll('.feature-tile').forEach(tile => {
  tile.addEventListener('mousemove', (e) => {
    const rect = tile.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    tile.style.setProperty('--glow-x', `${x}%`);
    tile.style.setProperty('--glow-y', `${y}%`);
  });
});


/* === LUNAR CLOCK (subtle ambient element) === */
function updateLunarTime() {
  // Just a visual — show current Santo Domingo time (AST = UTC-4)
  const now = new Date();
  const options = {
    timeZone: 'America/Santo_Domingo',
    hour: '2-digit', minute: '2-digit', hour12: false
  };
  const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
  const el = document.querySelector('.hero-eyebrow');
  if (el && !el.dataset.originalText) {
    el.dataset.originalText = el.textContent;
  }
}
updateLunarTime();


/* === KEYBOARD ACCESSIBILITY === */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeZonePanel();
    closeNavMenu();
  }
});


/* === PAGE LOAD ANIMATION SEQUENCE === */
document.addEventListener('DOMContentLoaded', () => {
  updateNavVisibility();

  // Stagger hero elements
  const heroElements = [
    document.querySelector('.hero-eyebrow'),
    document.querySelector('.hero-logo-wrap'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-sub'),
    document.querySelector('.btn-primary'),
    document.querySelector('.hero-scroll-hint')
  ].filter(Boolean);

  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.8s ease ${0.2 + i * 0.15}s, transform 0.8s ease ${0.2 + i * 0.15}s`;

    // Trigger on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
});


/* === SERVICE WORKER (optional, for offline caching via GitHub Pages) === */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
