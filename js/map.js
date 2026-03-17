// Leaflet loaded as global via CDN script tag in HTML

let markersLayer = null;

export function initMap() {
  const map = L.map('map', { center: [38, -96], zoom: 4, preferCanvas: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  return map;
}

function hailStyle(s) {
  if (s < 1)  return { color: '#14a7e1ff', r: 2  };
  if (s < 2)  return { color: '#eab00fff', r: 2.5  };
  if (s < 3)  return { color: '#eb5611ff', r: 3.5  };
  if (s < 5)  return { color: '#c70c0cff', r: 8 };
  return        { color: '#38014aff',  r: 12 };
}

export function renderMarkers(reports, month, minSize) {
  markersLayer.clearLayers();

  const filtered = reports.filter(r =>
    (month === 'all' || r.month === parseInt(month)) && r.size >= minSize
  );

  filtered.forEach(r => {
    const { color, r: radius } = hailStyle(r.size);
    L.circleMarker([r.lat, r.lon], {
      radius,
      fillColor:   color,
      color:       'rgba(0,0,0,0.2)',
      weight:      0.5,
      fillOpacity: 0.72
    })
    .bindPopup(
      `<b>⚪ ${r.size.toFixed(2)}" Hail</b>` +
      `📅 ${r.date}&nbsp;&nbsp;🕐 ${r.time} UTC<br>` +
      `📍 ${r.location || '—'}, ${r.state}<br>` +
      `💬 ${r.comment || '—'}`
    )
    .addTo(markersLayer);
  });

  return filtered.length;
}