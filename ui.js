import { YEARS, CURRENT_YEAR } from './config.js';

export const tabEls = {};

export function buildYearTabs(onSelect) {
  const tabContainer = document.getElementById('year-tabs');
  const cacheBadges  = document.getElementById('cache-badges');

  YEARS.forEach(y => {
    const btn = document.createElement('button');
    btn.className   = 'year-tab' + (y === CURRENT_YEAR ? ' recent' : '');
    btn.textContent = y === CURRENT_YEAR ? `${y} ●` : y;
    btn.title       = y === CURRENT_YEAR ? 'Current year — includes recent reports' : `Full year ${y}`;
    btn.addEventListener('click', () => onSelect(y));
    tabContainer.appendChild(btn);
    tabEls[y] = btn;

    const badge = document.createElement('span');
    badge.className   = 'cache-badge';
    badge.id          = `badge-${y}`;
    badge.textContent = y;
    cacheBadges.appendChild(badge);
  });
}

export function setStatus(msg, cls = '') {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className   = cls;
}

export function openPanel(lat, lon, report = null) {
  const panel    = document.getElementById('info-panel');
  const title    = document.getElementById('panel-title');
  const subtitle = document.getElementById('panel-subtitle');
  const body     = document.getElementById('panel-body');

  if (report) {
    title.textContent    = `${report.size.toFixed(2)}" Hail`;
    subtitle.textContent = `${report.location || 'Unknown'}, ${report.state}`;
  } else {
    title.textContent    = 'Location Info';
    subtitle.textContent = `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
  }

  body.innerHTML = '';
  panel.classList.add('open');
}

export function closePanel() {
  document.getElementById('info-panel').classList.remove('open');
}