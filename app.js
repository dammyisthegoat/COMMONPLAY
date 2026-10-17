(() => {
  'use strict';

  const STORAGE = {
    joins: 'commonplay-demo-joined-v1',
    custom: 'commonplay-demo-events-v1',
    profile: 'commonplay-player-profile-v1'
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isoLocalDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const dateOffset = (offset) => {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    return isoLocalDate(date);
  };
  const safeRead = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  };
  const safeWrite = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* Private browsing can disable storage. */ }
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const toSlug = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sportGlyph = (sport) => ({
    Football: '<circle cx="32" cy="32" r="23"/><path d="m32 20 10 7-4 12H26l-4-12 10-7ZM22 27 12 24m26 3 10-3M26 39l-7 9m19-9 7 9M32 20v-9"/><path d="m12 24 1-9 8 1m27 8 3-9-8-1"/>',
    Basketball: '<circle cx="32" cy="32" r="23"/><path d="M9 32h46M32 9c12 10 12 36 0 46M32 9C20 19 20 45 32 55M14 18c13 7 23 21 27 35M50 18C37 25 27 39 23 53"/>',
    Tennis: '<circle cx="32" cy="32" r="23"/><path d="M13 18c15 4 29 18 35 31M50 16C35 20 21 34 15 47"/><path d="M8 32h48" stroke-dasharray="2 4" opacity=".3"/>',
    Running: '<circle cx="39" cy="13" r="5"/><path d="m34 24-9 10 12 5 8 12M34 24l12 6 8-3M25 34l-6 13-10 4M37 39l-11 9-1 6M46 30l-6 9 11 4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 15h13M4 21h11M8 27h9" stroke-linecap="round" opacity=".65"/>',
    Volleyball: '<circle cx="32" cy="32" r="23"/><path d="M9 27c17 5 27 1 35-12M20 53c-2-17 4-28 17-39M53 43c-15-11-24-13-43-4M27 9c1 17 8 28 23 34"/>',
    Badminton: '<ellipse cx="32" cy="21" rx="10" ry="14" transform="rotate(22 32 21)"/><path d="m25 33 22 20M19 26l17 7M24 11l18 12M48 16 30 31M23 10l24 15M44 12l-16 17" stroke-linecap="round"/><path d="m42 48 8 8" stroke-width="4" stroke-linecap="round"/>',
    Cycling: '<circle cx="17" cy="42" r="12"/><circle cx="48" cy="42" r="12"/><path d="m17 42 12-23 11 23H17l9-14h17M26 19h-7m19 23 9-23h7" stroke-linecap="round" stroke-linejoin="round"/>',
    Fitness: '<path d="M12 25v14m7-20v26m-7-19H7v6h5m7-6h8m10 0h8m7-7v26m-7-19h5v6h-5M28 28h8" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 22h8v20h-8z"/>',
    Swimming: '<path d="M12 18c7-6 13 6 20 0s13 6 20 0M8 31c7-6 13 6 20 0s13 6 20 0M12 44c7-6 13 6 20 0s13 6 20 0" stroke-linecap="round"/><circle cx="17" cy="12" r="4"/>',
    Padel: '<ellipse cx="29" cy="27" rx="14" ry="19" transform="rotate(24 29 27)"/><path d="m39 42 12 12M23 14l10 26M16 23l24 8M18 34l22-10" stroke-linecap="round"/>'
  });
  const sportArt = (sport, index) => `<div class="event-art art-${toSlug(sport)}" aria-hidden="true"><svg viewBox="0 0 64 64">${sportGlyph(sport) || sportGlyph('Fitness')}</svg><span class="art-num">CP / ${String(index + 1).padStart(2, '0')}</span></div>`;
  const people = [
    { initials: 'TA', name: 'Tobi Adeyemi', role: 'Community host' },
    { initials: 'MA', name: 'Maya Adebayo', role: 'Local player' },
    { initials: 'EO', name: 'Efe Okon', role: 'Game organiser' },
    { initials: 'KN', name: 'Kemi Nwosu', role: 'Local player' },
    { initials: 'BI', name: 'Bolu Ibrahim', role: 'Game organiser' },
    { initials: 'SA', name: 'Seyi Ajayi', role: 'Community host' },
    { initials: 'NO', name: 'Nneka Obi', role: 'Local player' },
    { initials: 'LU', name: 'Luka Usman', role: 'Game organiser' }
  ];
  const initialEvents = [
    { id: 'sunset-football', sport: 'Football', title: 'Sunset five-a-side', subtitle: 'Quick passes, new mates, no pressure.', location: 'Yaba Community Pitch', area: 'Yaba, Lagos', dayOffset: 0, time: '17:30', level: 'All levels', spots: 3, distance: 2.4, capacity: 10, players: 7, host: 'Tobi Adeyemi', hostInitials: 'TA', mapX: 22, mapY: 40, accent: 'olive' },
    { id: 'easy-miles', sport: 'Running', title: 'Easy miles, good company', subtitle: 'An easy pace, open to first-timers.', location: 'Muri Okunola Park', area: 'Victoria Island, Lagos', dayOffset: 1, time: '06:15', level: 'Beginner-friendly', spots: 6, distance: 5.1, capacity: 12, players: 6, host: 'Maya Adebayo', hostInitials: 'MA', mapX: 75, mapY: 61, accent: 'clay' },
    { id: 'tennis-doubles', sport: 'Tennis', title: 'Doubles, no pressure', subtitle: 'Rotating partners and friendly rallies.', location: 'Ikoyi Tennis Courts', area: 'Ikoyi, Lagos', dayOffset: 1, time: '16:00', level: 'Beginner-friendly', spots: 1, distance: 7.2, capacity: 8, players: 7, host: 'Efe Okon', hostInitials: 'EO', mapX: 74, mapY: 27, accent: 'olive' },
    { id: 'afterwork-rally', sport: 'Badminton', title: 'Rally after work', subtitle: 'Bring a racket if you have one. Spares available.', location: 'Yaba Indoor Sports Hall', area: 'Yaba, Lagos', dayOffset: 2, time: '18:30', level: 'All levels', spots: 4, distance: 3.2, capacity: 8, players: 4, host: 'Kemi Nwosu', hostInitials: 'KN', mapX: 30, mapY: 26, accent: 'stone' },
    { id: 'half-court', sport: 'Basketball', title: 'Open run: half court', subtitle: 'Pickup hoops, mixed skill, good energy.', location: 'Lekki Phase 1 Court', area: 'Lekki, Lagos', dayOffset: 3, time: '19:00', level: 'Intermediate', spots: 5, distance: 11.4, capacity: 10, players: 5, host: 'Bolu Ibrahim', hostInitials: 'BI', mapX: 85, mapY: 78, accent: 'stone' },
    { id: 'sand-and-set', sport: 'Volleyball', title: 'Sand & set', subtitle: 'A relaxed beach-side team game.', location: 'Elegushi Beach', area: 'Lekki, Lagos', dayOffset: 4, time: '17:00', level: 'All levels', spots: 2, distance: 16.8, capacity: 12, players: 10, host: 'Seyi Ajayi', hostInitials: 'SA', mapX: 92, mapY: 50, accent: 'clay' },
    { id: 'thursday-seven', sport: 'Football', title: 'Thursday, seven-a-side', subtitle: 'A quicker game for people who love the ball.', location: 'National Stadium Annex', area: 'Surulere, Lagos', dayOffset: 5, time: '18:00', level: 'Advanced', spots: 2, distance: 6.8, capacity: 14, players: 12, host: 'Luka Usman', hostInitials: 'LU', mapX: 46, mapY: 48, accent: 'olive' },
    { id: 'city-cycle', sport: 'Cycling', title: 'The slow Sunday spin', subtitle: 'A social ride with coffee at the halfway mark.', location: 'Ikeja City Mall, meeting point', area: 'Ikeja, Lagos', dayOffset: 6, time: '07:00', level: 'All levels', spots: 8, distance: 18.2, capacity: 14, players: 6, host: 'Nneka Obi', hostInitials: 'NO', mapX: 23, mapY: 75, accent: 'stone' },
    { id: 'lagoon-swim', sport: 'Swimming', title: 'Easy laps, easy company', subtitle: 'A relaxed pool session for swimmers of mixed pace.', location: 'Lekki Leisure Centre', area: 'Lekki, Lagos', dayOffset: 4, time: '09:00', level: 'Beginner-friendly', spots: 5, distance: 13.7, capacity: 10, players: 5, host: 'Maya Adebayo', hostInitials: 'MA', mapX: 81, mapY: 63, accent: 'clay' }
  ];
  const joinedIds = new Set(safeRead(STORAGE.joins, []));
  const storedCustomEvents = safeRead(STORAGE.custom, []);
  const events = initialEvents.map((event) => ({
    ...event,
    date: dateOffset(event.dayOffset),
    joined: joinedIds.has(event.id),
    spots: Math.max(0, event.spots - (joinedIds.has(event.id) ? 1 : 0)),
    isCustom: false
  })).concat(Array.isArray(storedCustomEvents) ? storedCustomEvents.map((event) => ({ ...event, isCustom: true, joined: joinedIds.has(event.id) || Boolean(event.joined) })) : []);

  let activeSport = 'All';
  let activeView = 'list';
  let toastTimer;
  let playerProfile = safeRead(STORAGE.profile, { name: '', city: 'Lagos, Nigeria', sports: [] });

  const eventGrid = $('#events-grid');
  const mapMarkers = $('#map-markers');
  const mapView = $('#map-view');
  const emptyState = $('#empty-state');
  const resultsCount = $('#results-count');
  const resultsLabel = $('#results-label');
  const eventDialog = $('#event-dialog');
  const createDialog = $('#create-dialog');
  const profileDialog = $('#profile-dialog');
  const eventDialogBody = $('#event-dialog-body');
  const toast = $('#toast');
  const toastMessage = $('#toast-message');
  const dateFilter = $('#date-filter');
  const levelFilter = $('#level-filter');
  const distanceFilter = $('#distance-filter');
  const searchInput = $('#event-search');

  function localDate(value) {
    if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    if (!value) return new Date(today);
    const parts = String(value).split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  function eventDate(event) { return localDate(event.date || dateOffset(event.dayOffset || 0)); }
  function dayDistance(event) { return Math.round((eventDate(event) - today) / 86400000); }
  function timeLabel(time) {
    if (!time) return 'Time to be confirmed';
    const match = String(time).match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return String(time);
    const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]));
    return new Intl.DateTimeFormat('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date).toUpperCase();
  }
  function shortDate(event) {
    const date = eventDate(event);
    const difference = dayDistance(event);
    const day = difference === 0 ? 'Today' : difference === 1 ? 'Tomorrow' : new Intl.DateTimeFormat('en-NG', { weekday: 'short' }).format(date);
    return `${day} · ${timeLabel(event.time)}`;
  }
  function longDate(event) {
    return new Intl.DateTimeFormat('en-NG', { weekday: 'long', day: 'numeric', month: 'short' }).format(eventDate(event));
  }
  function dateMatches(event, filter) {
    const distance = dayDistance(event);
    const day = eventDate(event).getDay();
    if (filter === 'today') return distance === 0;
    if (filter === 'tomorrow') return distance === 1;
    if (filter === 'week') return distance >= 0 && distance <= 7;
    if (filter === 'weekend') return distance >= 0 && distance <= 7 && (day === 0 || day === 6);
    return distance >= 0;
  }
  function matchesFilter(event) {
    if (activeSport !== 'All' && event.sport !== activeSport) return false;
    if (!dateMatches(event, dateFilter.value)) return false;
    if (levelFilter.value !== 'All levels' && event.level !== 'All levels' && event.level !== levelFilter.value) return false;
    if (event.distance > Number(distanceFilter.value)) return false;
    const needle = searchInput.value.trim().toLowerCase();
    if (needle && ![event.title, event.subtitle, event.sport, event.location, event.area, event.host].some((value) => String(value || '').toLowerCase().includes(needle))) return false;
    return true;
  }
  function visibleEvents() {
    return events.filter(matchesFilter).sort((a, b) => eventDate(a) - eventDate(b) || String(a.time).localeCompare(String(b.time)));
  }
  function eventCard(event, index) {
    const joined = event.joined || joinedIds.has(event.id);
    const spotsText = event.spots === 0 ? 'Full for now' : `${event.spots} ${event.spots === 1 ? 'spot' : 'spots'} open`;
    return `<article class="event-item" style="animation-delay:${Math.min(index * 20, 120)}ms" data-event-id="${escapeHtml(event.id)}">
      ${sportArt(event.sport, index)}
      <div class="event-main">
        <div class="event-topline"><span class="event-sport-tag">${escapeHtml(event.sport)}</span><span class="event-distance">${Number(event.distance).toFixed(1)} km away</span></div>
        <button class="event-title-button" type="button" data-event-details="${escapeHtml(event.id)}"><h3>${escapeHtml(event.title)}</h3></button>
        <p class="event-subtitle">${escapeHtml(event.subtitle || event.location)}</p>
        <div class="event-info-line"><span>◷ ${escapeHtml(shortDate(event))}</span><b>·</b><span>⌖ ${escapeHtml(event.area || event.location)}</span></div>
        <div class="event-bottomline"><span class="event-spots"><strong>${joined ? 'You’re in' : spotsText}</strong>${event.level === 'All levels' ? ' · Everyone welcome' : ` · ${escapeHtml(event.level)}`}</span><button class="event-action" type="button" data-event-details="${escapeHtml(event.id)}">View event <span aria-hidden="true">↗</span></button></div>
      </div>
    </article>`;
  }
  function renderMap(list) {
    mapMarkers.innerHTML = list.map((event, index) => {
      const pointX = Math.max(7, Math.min(88, Number(event.mapX || (20 + index * 9))));
      const pointY = Math.max(15, Math.min(87, Number(event.mapY || (22 + index * 7))));
      const glyph = sportGlyph(event.sport) ? ({ Football: '✳', Running: '↗', Tennis: '◉', Basketball: '◎', Volleyball: '◌', Badminton: '⌁', Cycling: '↝', Swimming: '≈', Fitness: '＋' }[event.sport] || '✳') : '✳';
      const pinClass = event.accent === 'clay' ? ' marker-clay' : '';
      return `<button class="map-marker${pinClass}" type="button" style="left:${pointX}%;top:${pointY}%" data-event-details="${escapeHtml(event.id)}" aria-label="View ${escapeHtml(event.title)}"><span aria-hidden="true">${glyph}</span><span>${escapeHtml(event.title)}</span></button>`;
    }).join('');
  }
  function render() {
    const list = visibleEvents();
    eventGrid.innerHTML = list.map(eventCard).join('');
    eventGrid.hidden = activeView !== 'list' || list.length === 0;
    mapView.hidden = activeView !== 'map' || list.length === 0;
    emptyState.hidden = list.length !== 0;
    renderMap(list);
    resultsCount.textContent = String(list.length).padStart(2, '0');
    resultsLabel.textContent = list.length === 1 ? 'game worth getting out for' : 'games worth getting out for';
    const everythingCount = $(`.sport-chip[data-sport="All"] span`);
    if (everythingCount) everythingCount.textContent = String(events.length).padStart(2, '0');
    $$('.sport-chip').forEach((button) => {
      const isActive = button.dataset.sport === activeSport;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    $$('[data-view]').forEach((button) => {
      const isActive = button.dataset.view === activeView;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    updateFeaturedEvent();
  }
  function updateFeaturedEvent() {
    const featured = events.find((event) => event.id === 'sunset-football');
    if (!featured) return;
    $('#featured-date').textContent = shortDate(featured);
    $('#featured-spots').textContent = `${featured.spots} ${featured.spots === 1 ? 'spot' : 'spots'}`;
    const joinButton = $('[data-event-join="sunset-football"]');
    if (joinButton) {
      joinButton.disabled = featured.joined || featured.spots < 1;
      const joinLabel = featured.joined ? 'You’re in ✓' : featured.spots < 1 ? 'Game full' : 'Join game';
      joinButton.innerHTML = `<span class="join-label">${escapeHtml(joinLabel)}</span> <span aria-hidden="true">↗</span>`;
      joinButton.setAttribute('aria-label', featured.joined ? 'Already joined featured game' : featured.spots < 1 ? 'Featured game is full' : 'Join featured game');
    }
  }
  function persistCustomEvents() {
    safeWrite(STORAGE.custom, events.filter((event) => event.isCustom));
    safeWrite(STORAGE.joins, [...joinedIds]);
  }
  function notify(message) {
    toastMessage.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
  }
  function showDialog(dialog) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('has-modal');
  }
  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    if (![eventDialog, createDialog, profileDialog].some((item) => item.open)) document.body.classList.remove('has-modal');
  }
  function openEvent(eventId) {
    const event = events.find((item) => item.id === eventId);
    if (!event) return;
    const joined = event.joined || joinedIds.has(event.id);
    const available = event.spots > 0;
    const participantCount = Math.max(0, Number(event.players || 0) + (joined ? 1 : 0));
    const hostInitials = event.hostInitials || String(event.host || 'CP').split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
    eventDialogBody.innerHTML = `
      <div class="event-modal-hero art-${toSlug(event.sport)}"><div><span class="event-modal-sport">${escapeHtml(event.sport)} · COMMUNITY GAME</span><h2 id="event-modal-title">${escapeHtml(event.title)}</h2><p>${escapeHtml(event.subtitle || 'Show up as you are. Come play.')}</p></div></div>
      <div class="event-modal-details">
        <div class="event-modal-detail"><span class="detail-mark" aria-hidden="true">◷</span><span><strong>${escapeHtml(longDate(event))}</strong><small>${escapeHtml(timeLabel(event.time))} · ${escapeHtml(event.duration || '60–90 minutes')}</small></span></div>
        <div class="event-modal-detail"><span class="detail-mark" aria-hidden="true">⌖</span><span><strong>${escapeHtml(event.location)}</strong><small>${escapeHtml(event.area || 'Lagos, Nigeria')}</small></span></div>
        <div class="event-modal-detail"><span class="detail-mark" aria-hidden="true">♧</span><span><strong>${escapeHtml(event.level)}</strong><small>Come with your current skills</small></span></div>
        <div class="event-modal-detail"><span class="detail-mark" aria-hidden="true">＋</span><span><strong>${joined ? 'You’re on the list' : `${event.spots} ${event.spots === 1 ? 'spot' : 'spots'} left`}</strong><small>${participantCount} ${participantCount === 1 ? 'player' : 'players'} planning to play</small></span></div>
      </div>
      <div class="event-modal-bottom"><div class="event-host"><span class="organizer-avatar avatar-olive">${escapeHtml(hostInitials)}</span><span><strong>${escapeHtml(event.host || 'Community host')}</strong><small>Organising this game</small></span></div><button class="button button-dark event-join-button" type="button" data-event-join="${escapeHtml(event.id)}" ${joined || !available ? 'disabled' : ''}>${joined ? 'You’re in ✓' : available ? 'Join game' : 'Game is full'} <span aria-hidden="true">↗</span></button></div>
      <p class="event-demo-note">Commonplay demo event. Joining updates your local demo player card only. It does not reserve a real venue or contact the organiser.</p>`;
    showDialog(eventDialog);
  }
  function joinEvent(eventId) {
    const event = events.find((item) => item.id === eventId);
    if (!event) return;
    if (event.joined || joinedIds.has(event.id)) {
      notify('You’re already on this demo game’s player list.');
      return;
    }
    if (event.spots < 1) {
      notify('This demo game is full. Try another one or host your own.');
      return;
    }
    event.spots = Math.max(0, event.spots - 1);
    event.joined = true;
    joinedIds.add(event.id);
    persistCustomEvents();
    render();
    if (eventDialog.open) openEvent(event.id);
    notify(`You’re in for ${event.title}. Saved to this demo on your device.`);
  }
  function openCreateDialog() {
    const dateField = $('#event-date');
    dateField.min = isoLocalDate(today);
    dateField.value = dateField.value && dateField.value >= isoLocalDate(today) ? dateField.value : dateOffset(1);
    showDialog(createDialog);
    setTimeout(() => $('#event-name').focus(), 80);
  }
  function openProfileDialog() {
    $('#profile-name').value = playerProfile.name || '';
    $('#profile-city').value = playerProfile.city || '';
    $('#profile-avatar').textContent = playerProfile.name ? playerProfile.name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase() : 'YP';
    $$('input[name="preferredSport"]', profileDialog).forEach((input) => { input.checked = (playerProfile.sports || []).includes(input.value); });
    showDialog(profileDialog);
  }
  function updateNavCurrent() {
    const hash = location.hash || '#discover';
    $$('.nav-link').forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === hash || (hash === '#top' && link.getAttribute('href') === '#discover')));
  }

  // Filters and the map/list control.
  $$('.sport-chip').forEach((button) => button.addEventListener('click', () => {
    activeSport = button.dataset.sport;
    render();
  }));
  [dateFilter, levelFilter, distanceFilter].forEach((control) => control.addEventListener('change', render));
  searchInput.addEventListener('input', render);
  $$('[data-view]').forEach((button) => button.addEventListener('click', () => { activeView = button.dataset.view; render(); }));

  // Delegated event actions, including pins and cards rendered from demo data.
  document.addEventListener('click', (event) => {
    const detailsButton = event.target.closest('[data-event-details]');
    const joinButton = event.target.closest('[data-event-join]');
    if (joinButton) {
      event.preventDefault();
      joinEvent(joinButton.dataset.eventJoin);
      return;
    }
    if (detailsButton) {
      event.preventDefault();
      openEvent(detailsButton.dataset.eventDetails);
      return;
    }
    if (event.target.closest('[data-open-create]')) {
      event.preventDefault();
      $$('.nav-open').forEach((nav) => nav.classList.remove('nav-open'));
      $('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      openCreateDialog();
      return;
    }
    if (event.target.closest('[data-open-profile]')) {
      event.preventDefault();
      $$('.nav-open').forEach((nav) => nav.classList.remove('nav-open'));
      $('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      openProfileDialog();
      return;
    }
    if (event.target.closest('[data-close-modal]')) {
      closeDialog(event.target.closest('dialog'));
    }
  });

  [eventDialog, createDialog, profileDialog].forEach((dialog) => {
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(dialog); });
    dialog.addEventListener('close', () => {
      if (![eventDialog, createDialog, profileDialog].some((item) => item.open)) document.body.classList.remove('has-modal');
    });
  });

  $('#create-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dateValue = String(form.get('date') || '');
    const currentProfile = playerProfile.name || 'You';
    if (!dateValue || dateValue < isoLocalDate(today)) {
      notify('Choose today or a future date for your game.');
      return;
    }
    const id = `hosted-${Date.now()}`;
    const customIndex = events.filter((item) => item.isCustom).length;
    const newEvent = {
      id,
      title: String(form.get('title') || '').trim(),
      sport: String(form.get('sport') || 'Football'),
      subtitle: 'A new community game. Bring your energy and say hello.',
      location: String(form.get('location') || '').trim(),
      area: playerProfile.city || 'Lagos, Nigeria',
      date: dateValue,
      time: String(form.get('time') || '17:30'),
      level: String(form.get('level') || 'All levels'),
      spots: Number(form.get('spots') || 5),
      distance: 3.5,
      capacity: Number(form.get('spots') || 5),
      players: 0,
      host: currentProfile,
      hostInitials: currentProfile.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase(),
      mapX: 19 + (customIndex * 13) % 65,
      mapY: 24 + (customIndex * 17) % 52,
      accent: customIndex % 2 ? 'olive' : 'clay',
      isCustom: true,
      joined: false
    };
    if (!newEvent.title || !newEvent.location) return;
    events.unshift(newEvent);
    persistCustomEvents();
    activeSport = 'All';
    dateFilter.value = 'any';
    levelFilter.value = 'All levels';
    distanceFilter.value = '99';
    searchInput.value = '';
    activeView = 'list';
    render();
    closeDialog(createDialog);
    event.currentTarget.reset();
    $('#event-time').value = '17:30';
    $('#discover').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    notify('Your game is live in this browser demo. No real players were notified.');
  });

  $('#profile-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    playerProfile = {
      name: String(form.get('name') || '').trim(),
      city: String(form.get('city') || '').trim(),
      sports: $$('input[name="preferredSport"]:checked', profileDialog).map((input) => input.value)
    };
    safeWrite(STORAGE.profile, playerProfile);
    closeDialog(profileDialog);
    notify('Your player card has been saved on this device.');
  });

  $('#profile-name').addEventListener('input', (event) => {
    const value = event.target.value.trim();
    $('#profile-avatar').textContent = value ? value.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase() : 'YP';
  });
  $('.menu-toggle').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const nav = button.closest('.app-nav');
    const open = nav.classList.toggle('nav-open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  $$('.nav-link, .brand, .back-top').forEach((link) => link.addEventListener('click', () => {
    $('.app-nav')?.classList.remove('nav-open');
    $('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    setTimeout(updateNavCurrent, 0);
  }));
  window.addEventListener('hashchange', updateNavCurrent);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      $('.app-nav')?.classList.remove('nav-open');
      $('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });

  // Keep the event list tidy on first reveal without relying on a library.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    $$('.section-heading, .how-heading, .community-inner').forEach((node) => observer.observe(node));
  }

  render();
  updateNavCurrent();
})();
