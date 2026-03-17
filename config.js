export const CURRENT_YEAR = new Date().getFullYear();

export const YEARS = [];
for (let y = 2020; y <= CURRENT_YEAR; y++) YEARS.push(y);

export const PROXIES = [
  url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  url => url
];