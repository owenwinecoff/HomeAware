import { YEARS, CURRENT_YEAR } from './config.js';
import { loadYear, generateSampleData } from './data.js';
import { initMap, renderMarkers } from './map.js';
import { buildYearTabs, tabEls, setStatus, openPanel, closePanel } from './ui.js';

const cache    = {};
let activeYear = null;

const map = initMap();

L.DomEvent.disableClickPropagation(document.getElementById('info-panel'));

// ── Map click → open panel with coords ──
map.on('click', e => openPanel(e.latlng.lat, e.latlng.lng));

// ── Marker popup open → open panel with report data ──
map.on('popupopen', e => {
  const r = e.popup._source?._report;
  if (r) openPanel(r.lat, r.lon, r);
});

// ── Panel close ──
document.getElementById('panel-close').addEventListener('click', e => {
  L.DomEvent.stopPropagation(e);
  closePanel();
});

// ── Filters ──
document.getElementById('month-filter').addEventListener('change', redraw);
document.getElementById('size-filter').addEventListener('input', function() {
  const v = parseFloat(this.value);
  document.getElementById('size-val').textContent = v === 0 ? 'Any' : v.toFixed(2) + '"';
  redraw();
});

function redraw() {
  if (!activeYear || !cache[activeYear]) return;
  const month   = document.getElementById('month-filter').value;
  const minSize = parseFloat(document.getElementById('size-filter').value);
  const count   = renderMarkers(cache[activeYear], month, minSize);
  document.getElementById('total-count').textContent = count.toLocaleString();
}

// ── Select year ──
async function selectYear(year) {
  Object.values(tabEls).forEach(b => b.classList.remove('active'));
  tabEls[year].classList.add('active');
  activeYear = year;
  document.getElementById('year-display').textContent = year;
  closePanel();

  tabEls[year].classList.add('loading');
  setStatus(`⏳ Loading ${year}…`);

  let reports = await loadYear(year);

  tabEls[year].classList.remove('loading');

  if (!reports.length) {
    reports = generateSampleData(year);
    setStatus(`⚠ ${year}: CORS blocked — sample data`, 'warn');
  } else {
    setStatus(`✓ ${year}: ${reports.length.toLocaleString()} reports`, 'ok');
    document.getElementById(`badge-${year}`)?.classList.add('loaded');
  }

  cache[year] = reports;

  const max = Math.max(...reports.map(r => r.size));
  document.getElementById('max-size').textContent = max.toFixed(2) + '"';

  redraw();
}

// ── Boot ──
buildYearTabs(selectYear);
selectYear(CURRENT_YEAR);

setTimeout(() => {
  YEARS.filter(y => y !== CURRENT_YEAR).forEach((y, i) => {
    setTimeout(() => loadYear(y).then(reports => {
      if (reports.length) {
        cache[y] = reports;
        document.getElementById(`badge-${y}`)?.classList.add('loaded');
      }
    }), i * 800);
  });
}, 2000);