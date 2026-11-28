/* Casa Karaya guide icons: one line-drawn set shared by the guest website and the TV app.
   CKIcons.appliance(name), .room(name), .contact(label), .step(text), .icon(key) return SVG strings.
   CKIcons.css(triggers) returns the animation rules; an icon animates inside any element matching a trigger. */
(function (root) {
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var RAIL = '<path d="M3 15.5h18M3 21.5h18M5 15.5v6M9 15.5v6M13 15.5v6M17 15.5v6M21 15.5v6"/>';
  var BIG = {
    ac: '<rect x="2.5" y="4" width="19" height="7.5" rx="2"/><path d="M5.5 8.5h10"/><circle class="cki-blink" cx="18.3" cy="8.4" r=".7" fill="currentColor"/>' +
      '<g class="cki-air"><path d="M8 14c0 1.6-1 2.1-1 3.6s1 2 1 3.4"/><path d="M12 14c0 1.6-1 2.1-1 3.6s1 2 1 3.4"/><path d="M16 14c0 1.6-1 2.1-1 3.6s1 2 1 3.4"/></g>',
    heater: '<rect x="6" y="6.5" width="12" height="14" rx="4.5"/><path d="M9.5 22v-1.5M14.5 22v-1.5"/>' +
      '<path class="cki-pulse" d="M12 10.5c-1.5 1.9-2.3 3.1-2.3 4.1a2.3 2.3 0 0 0 4.6 0c0-1-.8-2.2-2.3-4.1z"/>' +
      '<g class="cki-steam"><path d="M9.5 4.6c-.7-.8.7-1.4 0-2.3"/><path d="M12 4.6c-.7-.8.7-1.4 0-2.3"/><path d="M14.5 4.6c-.7-.8.7-1.4 0-2.3"/></g>',
    washer: '<rect x="3.5" y="2.5" width="17" height="19" rx="2.5"/><path d="M3.5 6.5h17"/><circle cx="7" cy="4.5" r=".6" fill="currentColor"/><path d="M10 4.5h7"/><circle cx="12" cy="14" r="5"/>' +
      '<g class="cki-spin"><path d="M9 14a3 3 0 0 1 3-3"/><path d="M15 14a3 3 0 0 1-3 3"/></g>',
    coffee: '<path d="M5 10.5h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 12h1.4a2.2 2.2 0 0 1 0 4.4H15.6"/><path d="M4 21.5h14"/>' +
      '<g class="cki-steam"><path d="M8.5 8c-.8-.9.8-1.6 0-2.6"/><path d="M12.5 8c-.8-.9.8-1.6 0-2.6"/></g>',
    tv: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8.5 21h7M12 17v4"/>' +
      '<rect class="cki-glow" x="4.5" y="6" width="15" height="9" rx="1" fill="currentColor" stroke="none" opacity=".14"/><path class="cki-pop" d="M10.5 8.5v4l3.5-2z"/>',
    microwave: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><rect x="5" y="7.5" width="10" height="9" rx="1"/><path d="M18 8v.01M18 11v.01M18 14v2"/><rect class="cki-glow" x="6" y="8.5" width="8" height="7" rx=".5" fill="currentColor" stroke="none" opacity=".14"/>',
    fridge: '<rect x="5.5" y="2.5" width="13" height="19" rx="2"/><path d="M5.5 9.5h13M8.5 5.5v2M8.5 12.5v3"/><circle class="cki-blink" cx="15.5" cy="6" r=".6" fill="currentColor"/>',
    iron: '<path d="M3 17.5h16.5a1 1 0 0 0 1-1.2C19.6 11.6 16.6 8.5 12 8.5H8"/><path d="M3 17.5c0-4 2.5-6.5 6-7"/><path d="M8 8.5V6h8"/><g class="cki-steam"><path d="M7 21c-.6-.7.6-1.2 0-1.9"/><path d="M11 21c-.6-.7.6-1.2 0-1.9"/></g>',
    dryer: '<path d="M14 9a5 5 0 1 0-5 5h6l3 3V5l-3 3"/><circle cx="9" cy="9" r="1.6"/><path d="M8 14l-1.5 7.5h3L11 14"/><g class="cki-air"><path d="M20.5 7.5h2M20.5 10h2M20.5 12.5h2"/></g>',
    safe: '<rect x="3.5" y="3.5" width="17" height="16" rx="2"/><path d="M6 19.5v1.5M18 19.5v1.5"/><g class="cki-spin"><circle cx="12" cy="11.5" r="3.5"/><path d="M12 8v1.5M12 13.5V15M8.5 11.5H10M14 11.5h1.5"/></g>',
    plug: '<path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path class="cki-pulse" d="M12 17v4"/>',
    sofa: '<g class="cki-bounce"><path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11"/><path d="M3.5 11.5a1.5 1.5 0 0 1 3 0V14h11v-2.5a1.5 1.5 0 0 1 3 0V17a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 17z"/></g><path d="M6 18.5v2M18 18.5v2"/>',
    bed: '<path d="M3 19V8"/><path d="M3 14.5h18V19"/><path d="M3 17.5h18"/><path d="M21 14.5V13a2.5 2.5 0 0 0-2.5-2.5H11v4"/><rect x="5" y="11" width="4" height="3" rx="1.5"/>' +
      '<path class="cki-float" d="M17.6 2.6a2.7 2.7 0 1 0 2.9 3.8 2.2 2.2 0 1 1-2.9-3.8z"/>',
    bed2: '<path d="M3 19V8"/><path d="M3 14.5h18V19"/><path d="M3 17.5h18"/><path d="M21 14.5V13a2.5 2.5 0 0 0-2.5-2.5H11v4"/><rect x="5" y="11" width="4" height="3" rx="1.5"/>' +
      '<path class="cki-twinkle" d="M18.5 2.2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7L16 4.7l1.7-.8z"/>',
    kitchen: '<path d="M5 11h14v5.5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z"/><path d="M3 11h18M10 8.5h4"/><path d="M4 22h16"/>' +
      '<g class="cki-steam"><path d="M8.5 6.2c-.7-.8.7-1.4 0-2.3"/><path d="M12 6.2c-.7-.8.7-1.4 0-2.3"/><path d="M15.5 6.2c-.7-.8.7-1.4 0-2.3"/></g>',
    balcony: '<g class="cki-spin-slow"><circle cx="12" cy="8" r="2.8"/><path d="M12 2.6v1.3M12 12.1v1.3M6.6 8h1.3M16.1 8h1.3M8.2 4.2l.9.9M14.9 10.9l.9.9M8.2 11.8l.9-.9M14.9 5.1l.9-.9"/></g>' + RAIL,
    bath: '<path d="M5 21.5V6a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3"/><path d="M9 8.5h6"/><g class="cki-drip"><path d="M10 12v1.2"/><path d="M12 12.5v1.2"/><path d="M14 12v1.2"/><path d="M11 15.5v1.2"/><path d="M13 15.5v1.2"/></g>',
    closet: '<rect x="4" y="2.5" width="16" height="19" rx="1.5"/><path d="M12 2.5v19M10 11v2M14 11v2"/><path class="cki-pop" d="M7 21.5v1M17 21.5v1"/>',
    office: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/><path class="cki-blink" d="M7 8h6M7 11h9"/>',
    laundry: '<rect x="3.5" y="2.5" width="17" height="19" rx="2.5"/><path d="M3.5 6.5h17"/><circle cx="12" cy="14" r="5"/><g class="cki-spin"><path d="M9 14a3 3 0 0 1 3-3"/><path d="M15 14a3 3 0 0 1-3 3"/></g>',
    wifi: '<path class="cki-arc cki-a3" d="M2.5 9a14 14 0 0 1 19 0"/><path class="cki-arc cki-a2" d="M5.5 12.5a9.5 9.5 0 0 1 13 0"/><path class="cki-arc cki-a1" d="M8.7 15.9a5 5 0 0 1 6.6 0"/><circle cx="12" cy="19.2" r="1.1" fill="currentColor"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="4"/><path class="cki-pop" d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/>',
    pin: '<g class="cki-bounce"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></g>',
    phone: '<path class="cki-ring" d="M5 4h3l1.5 4-2 1.3a10 10 0 0 0 7.2 7.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    chat: '<g class="cki-bounce"><path d="M4 5h16v11H9.5L4 20z"/></g><g class="cki-dots"><circle cx="8.5" cy="10.5" r=".9" fill="currentColor"/><circle cx="12" cy="10.5" r=".9" fill="currentColor"/><circle cx="15.5" cy="10.5" r=".9" fill="currentColor"/></g>',
    building: '<rect x="5" y="2.5" width="14" height="19" rx="1.5"/><path d="M9 6.5h1.5M13.5 6.5H15M9 10h1.5M9 13.5h1.5M13.5 13.5H15M10.5 21.5v-4h3v4"/><path class="cki-blink" d="M13.5 10H15"/>',
    siren: '<path d="M6 18v-6a6 6 0 0 1 12 0v6"/><path d="M4 21h16v-3H4z"/><path d="M12 9v4"/><g class="cki-blink"><path d="M12 1.8v1.6M4.4 4.6l1.2 1.2M19.6 4.6l-1.2 1.2"/></g>',
    home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5v11h13v-11"/><path class="cki-pop" d="M10 20.5v-5h4v5"/>',
    star: '<path class="cki-twinkle" d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>'
  };
  var SMALL = {
    power: '<path d="M12 3v8"/><path d="M6.6 6.6a7.5 7.5 0 1 0 10.8 0"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l8-8"/>',
    temp: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
    remote: '<rect x="8" y="2.5" width="8" height="19" rx="3"/><circle cx="12" cy="7" r="1.3"/><path d="M10.5 12h3M10.5 15h3M10.5 18h3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    drop: '<path d="M12 3c-3.3 4.2-5 7-5 9.5a5 5 0 0 0 10 0C17 10 15.3 7.2 12 3z"/>',
    door: '<path d="M4 21.5h16"/><path d="M6.5 21.5v-18h11v18"/><circle cx="14.6" cy="12.5" r=".9" fill="currentColor"/>',
    bin: '<path d="M4 6.5h16M9.5 6.5V4h5v2.5M6 6.5l1 14h10l1-14"/><path d="M10 10.5v6M14 10.5v6"/>',
    pod: '<path d="M7 9h10l-1.5 10a2 2 0 0 1-2 1.7h-3a2 2 0 0 1-2-1.7z"/><path d="M6 9h12a1.5 1.5 0 0 0 0-3H6a1.5 1.5 0 0 0 0 3z"/>',
    bottle: '<path d="M9 3h6v3l2 3v11a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20V9l2-3z"/><path d="M7 13h10"/>',
    filter: '<path d="M3.5 5h17l-6.5 8v6l-4 2v-8z"/>',
    linens: '<path d="M4 9h16v4H4zM4 13h16v4H4z"/><path d="M4 9c0-2 1.5-3 3-3h10c1.5 0 3 1 3 3"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M8.5 14.5a6 6 0 1 1 7 0c-.7.6-1 1.3-1 2V18h-5v-1.5c0-.7-.3-1.4-1-2z"/>',
    curtain: '<path d="M3 3.5h18"/><path d="M5 3.5c0 6 2 11 5 17H5zM19 3.5c0 6-2 11-5 17h5z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
    smoke: '<path d="M3 15.5h13v3H3z"/><path d="M18.5 15.5v3M21 15.5v3"/><path d="M18.5 12.5c0-2 2-2 2-4s-2-2-2-4"/>',
    rain: '<path d="M7 15.5a4.5 4.5 0 1 1 1-8.9A5.5 5.5 0 0 1 18.5 9 3.5 3.5 0 0 1 18 15.5z"/><path d="M9 18.5l-1 2M13 18.5l-1 2M17 18.5l-1 2"/>',
    chat: '<path d="M4 5h16v11H9.5L4 20z"/>',
    home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5v11h13v-11"/>',
    suitcase: '<rect x="3.5" y="7" width="17" height="13" rx="2"/><path d="M9 7V4.5h6V7M3.5 12.5h17"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
    fridge: '<rect x="5.5" y="2.5" width="13" height="19" rx="2"/><path d="M5.5 9.5h13M8.5 5.5v2M8.5 12.5v3"/>',
    hanger: '<path d="M12 7a2 2 0 1 1 2-2"/><path d="M12 7v1.5L3 15.5a1 1 0 0 0 .6 1.8h16.8a1 1 0 0 0 .6-1.8L12 8.5"/>',
    railing: RAIL.replace(/15\.5/g, '9.5').replace(/21\.5/g, '19.5'),
    salt: '<path d="M8 8h8l-1 13H9z"/><path d="M8.5 8 9 3.5h6L15.5 8"/><path d="M11 5.5h.01M13 5.5h.01"/>',
    tv: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8.5 21h7M12 17v4"/>',
    car: '<path d="M4 16.5V12l2-5h12l2 5v4.5zM4 16.5v2.5h3v-2.5M17 16.5v2.5h3v-2.5M4.5 12h15"/>',
    cup: '<path d="M5 10.5h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 12h1.4a2.2 2.2 0 0 1 0 4.4H15.6"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    elevator: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M12 2.5v19M7.5 9.5 9 8l1.5 1.5M13.5 14.5 15 16l1.5-1.5"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    shirt: '<path d="M8 3.5 3.5 6.5l2 4L7.5 9.5V21h9V9.5l2 1 2-4L16 3.5c-.5 1.5-2 2.5-4 2.5S8.5 5 8 3.5z"/>'
  };
  function svg(inner, cls) { return '<svg class="' + cls + '" ' + S + '>' + inner + '</svg>'; }
  function icon(key) { return svg(BIG[key] || BIG.plug, 'cki cki-' + (BIG[key] ? key : 'plug')); }
  function appliance(name) {
    var n = String(name || '').toLowerCase();
    if (/air|a\/c|aire|clima/.test(n)) return icon('ac');
    if (/heater|calentador|hot water|agua caliente/.test(n)) return icon('heater');
    if (/wash|dryer|laundry|lavadora|secadora/.test(n)) return icon('washer');
    if (/coffee|café|cafe|espresso/.test(n)) return icon('coffee');
    if (/tv|television|televisi/.test(n)) return icon('tv');
    if (/microwave|microondas/.test(n)) return icon('microwave');
    if (/fridge|refrigerat|nevera/.test(n)) return icon('fridge');
    if (/hair|secador de pelo|blow/.test(n)) return icon('dryer');
    if (/iron|plancha/.test(n)) return icon('iron');
    if (/safe|caja fuerte/.test(n)) return icon('safe');
    return icon('plug');
  }
  function room(name) {
    var n = String(name || '').toLowerCase();
    if (/living|sala|dining/.test(n)) return icon('sofa');
    if (/guest|second|#2|invitad/.test(n) && /bed|room|dormi|habita/.test(n)) return icon('bed2');
    if (/bed|dormi|habita/.test(n)) return icon('bed');
    if (/kitchen|cocina/.test(n)) return icon('kitchen');
    if (/balcon/.test(n)) return icon('balcony');
    if (/bath|baño|powder/.test(n)) return icon('bath');
    if (/closet/.test(n)) return icon('closet');
    if (/office|oficina|desk/.test(n)) return icon('office');
    if (/laundry|lavander/.test(n)) return icon('laundry');
    return icon('home');
  }
  function contact(label) {
    var n = String(label || '').toLowerCase();
    if (/emerg|911/.test(n)) return icon('siren');
    if (/build|edificio|concierge|security|lobby/.test(n)) return icon('building');
    if (/host|anfitri/.test(n)) return icon('chat');
    return icon('phone');
  }
  // Step icons, matched on the wording (English or Spanish); the order matters
  var STEPS = [
    [/eco\b|modo eco/i, 'leaf'],
    [/elevator|ascensor|lounge|gym|gimnasio|pool|piscina/i, 'elevator'],
    [/quiet|silencio|noise|ruido/i, 'moon'],
    [/\bpower\b|turn (the unit |it )?(on|off)|switch on|encend|apag/i, 'power'],
    [/\d\d ?(°|c\b)|temperature|temperatura/i, 'temp'],
    [/remote|control remoto/i, 'remote'],
    [/smok|ashtray|fuma|cenicero/i, 'smoke'],
    [/rain|lluvia|cushion|cojín|cojin/i, 'rain'],
    [/trash|recycl|basura|recicla/i, 'bin'],
    [/fridge|refrigerat|nevera/i, 'fridge'],
    [/detergent|detergente/i, 'bottle'],
    [/\bpods?\b|cápsula|capsula|capsule/i, 'pod'],
    [/lint|filter|filtro|pelusa/i, 'filter'],
    [/message|whatsapp|\bhost\b|anfitri/i, 'chat'],
    [/minute|minuto|wait|espera/i, 'clock'],
    [/door|window|puerta|ventana/i, 'door'],
    [/hanger|closet|gancho/i, 'hanger'],
    [/blanket|pillow|towel|linen|sheet|manta|almohada|toalla|sábana|sabana/i, 'linens'],
    [/light|dimmer|lamp|\bluz\b|luces/i, 'bulb'],
    [/curtain|cortina/i, 'curtain'],
    [/log (in|out)|account|streaming|cuenta/i, 'key'],
    [/home button|\bapps\b|inicio/i, 'home'],
    [/luggage|maleta|equipaje/i, 'suitcase'],
    [/wipe|clean|limpi/i, 'sparkle'],
    [/care|cuid|furnish|mueble|artwork/i, 'heart'],
    [/salt|pepper|season|spice|sal\b|pimienta|condiment/i, 'salt'],
    [/railing|baranda/i, 'railing'],
    [/parking|garage|parqueo|estacionamiento/i, 'car'],
    [/cup|taza/i, 'cup'],
    [/fabric|clothes|ropa|load\b|carga/i, 'shirt'],
    [/water|agua|shower|ducha|reservoir/i, 'drop'],
    [/\btv\b|television|televisi/i, 'tv']
  ];
  function step(text) {
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i][0].test(text || '')) return svg(SMALL[STEPS[i][1]], 'cks cks-' + STEPS[i][1]);
    return '';
  }
  function css(triggers) {
    var T = function (sel) { return triggers.map(function (t) { return t + ' ' + sel; }).join(', '); };
    return [
      '.cki, .cks { display: block; overflow: visible; }',
      '.cki * { transform-box: fill-box; transform-origin: center; }',
      T('.cki-air path') + ' { stroke-dasharray: 2.4 2.2; animation: ckiFlow .9s linear infinite; }',
      T('.cki-steam path') + ' { animation: ckiSteam 1.8s ease-in-out infinite; }',
      T('.cki-steam path:nth-child(2)') + ' { animation-delay: .3s; }',
      T('.cki-steam path:nth-child(3)') + ' { animation-delay: .6s; }',
      T('.cki-spin') + ' { animation: ckiSpin 1.6s linear infinite; }',
      T('.cki-spin-slow') + ' { animation: ckiSpin 9s linear infinite; }',
      T('.cki-drip path') + ' { animation: ckiDrip 1s ease-in infinite; }',
      T('.cki-drip path:nth-child(2)') + ' { animation-delay: .25s; }',
      T('.cki-drip path:nth-child(3)') + ' { animation-delay: .5s; }',
      T('.cki-drip path:nth-child(4)') + ' { animation-delay: .4s; }',
      T('.cki-drip path:nth-child(5)') + ' { animation-delay: .7s; }',
      T('.cki-blink') + ' { animation: ckiBlink 1.4s ease-in-out infinite; }',
      T('.cki-glow') + ' { animation: ckiGlow 1.2s ease-in-out infinite alternate; }',
      T('.cki-pop') + ' { animation: ckiPop 1.4s ease-in-out infinite; }',
      T('.cki-pulse') + ' { animation: ckiPop 1.6s ease-in-out infinite; }',
      T('.cki-float') + ' { animation: ckiFloat 2s ease-in-out infinite; }',
      T('.cki-twinkle') + ' { animation: ckiTwinkle 1.6s ease-in-out infinite; }',
      T('.cki-bounce') + ' { animation: ckiBounce 1.4s cubic-bezier(.3,1.6,.5,1) infinite; }',
      T('.cki-ring') + ' { animation: ckiRing 1.2s ease-in-out infinite; }',
      T('.cki-arc') + ' { animation: ckiArc 1.6s ease-in-out infinite; }',
      T('.cki-a2') + ' { animation-delay: .18s; }', T('.cki-a3') + ' { animation-delay: .36s; }',
      T('.cki-dots circle') + ' { animation: ckiArc 1.2s ease-in-out infinite; }',
      T('.cki-dots circle:nth-child(2)') + ' { animation-delay: .2s; }', T('.cki-dots circle:nth-child(3)') + ' { animation-delay: .4s; }',
      '@keyframes ckiFlow { from { stroke-dashoffset: 4.6; } to { stroke-dashoffset: 0; } }',
      '@keyframes ckiSteam { 0% { opacity: 0; transform: translateY(1.5px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateY(-2.5px); } }',
      '@keyframes ckiSpin { to { transform: rotate(360deg); } }',
      '@keyframes ckiDrip { 0% { opacity: 0; transform: translateY(-1px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(3px); } }',
      '@keyframes ckiBlink { 0%, 100% { opacity: 1; } 50% { opacity: .15; } }',
      '@keyframes ckiGlow { from { opacity: .1; } to { opacity: .45; } }',
      '@keyframes ckiPop { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.18); } }',
      '@keyframes ckiFloat { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-1.5px) rotate(-8deg); } }',
      '@keyframes ckiTwinkle { 0%, 100% { transform: scale(.75) rotate(0); opacity: .6; } 50% { transform: scale(1.15) rotate(20deg); opacity: 1; } }',
      '@keyframes ckiBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-2.5px); } }',
      '@keyframes ckiRing { 0%, 50%, 100% { transform: rotate(0); } 10%, 30% { transform: rotate(-14deg); } 20%, 40% { transform: rotate(14deg); } }',
      '@keyframes ckiArc { 0%, 100% { opacity: .25; } 40%, 60% { opacity: 1; } }',
      '@media (prefers-reduced-motion: reduce) { .cki * { animation: none !important; } }'
    ].join('\n');
  }
  root.CKIcons = { icon: icon, appliance: appliance, room: room, contact: contact, step: step, css: css };
})(typeof window !== 'undefined' ? window : this);
