import { PROXIES, CURRENT_YEAR } from './config.js';

const cache = {};

export async function fetchWithFallback(rawUrl) {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(rawUrl), { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.length < 100 || text.startsWith('<')) continue;
      return text;
    } catch(e) {}
  }
  return null;
}

export function parseAnnualCSV(text, year) {
  const lines = text.trim().split('\n');
  const reports = [];
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split(',');
    try {
      const mo  = parseInt(c[2]);
      const mag = parseFloat(c[10]);
      const lat = parseFloat(c[15]);
      const lon = parseFloat(c[16]);
      if (isNaN(lat) || isNaN(lon) || isNaN(mag) || lat === 0 || lon === 0) continue;
      reports.push({
        date:     c[4]?.trim() || `${year}-??`,
        time:     c[5]?.trim() || '??',
        state:    c[7]?.trim() || '??',
        location: c[11]?.trim() || '',
        lat, lon,
        size:     mag,
        month:    mo,
        comment:  ''
      });
    } catch(e) {}
  }
  return reports;
}

export function parseDailyCSV(text) {
  const lines = text.trim().split('\n');
  const reports = [];
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split(',');
    try {
      const size = parseFloat(c[3]);
      const lat  = parseFloat(c[7]);
      const lon  = parseFloat(c[8]);
      if (isNaN(lat) || isNaN(lon) || isNaN(size) || lat === 0 || lon === 0) continue;
      reports.push({
        date:     'recent',
        time:     c[0]?.trim() || '??',
        state:    c[6]?.trim() || '??',
        location: c[4]?.trim() || '',
        lat, lon, size, month: 0,
        comment:  c[9]?.trim() || ''
      });
    } catch(e) {}
  }
  return reports;
}

export async function loadYear(year) {
  if (cache[year]) return cache[year];

  let reports = [];

  if (year < CURRENT_YEAR) {
    const text = await fetchWithFallback(`https://www.spc.noaa.gov/wcm/data/${year}_hail.csv`);
    if (text) reports = parseAnnualCSV(text, year);
  } else {
    const annualText = await fetchWithFallback(`https://www.spc.noaa.gov/wcm/data/${year}_hail.csv`);
    if (annualText) reports = parseAnnualCSV(annualText, year);

    const today = new Date();
    for (let d = 0; d <= 2; d++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - d);
      const yy = String(dt.getFullYear()).slice(2);
      const mm = String(dt.getMonth()+1).padStart(2,'0');
      const dd = String(dt.getDate()).padStart(2,'0');
      const dailyText = await fetchWithFallback(
        `https://www.spc.noaa.gov/climo/reports/${yy}${mm}${dd}_rpts_hail.csv`
      );
      if (dailyText) reports = reports.concat(parseDailyCSV(dailyText));
    }
  }

  if (reports.length > 0) cache[year] = reports;
  return reports;
}

export function generateSampleData(year) {
  return null;
}