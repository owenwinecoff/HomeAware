# HomeAware

**Live site:** https://owenwinecoff.github.io/HomeAware/

A web application for visualizing hail storm reports across the United States, built by [Winecoff Construction](https://winecoffconstruction.com). HomeAware is an actively developed platform aimed at helping homeowners and contractors identify weather-related property damage risk.

---

## Features

- **Interactive hail map** — every NOAA-reported hail event plotted by location, sized and colored by diameter
- **Year selector** — browse full annual data from 2020 through the current year
- **Live data** — current year pulls from NOAA SPC's rolling daily reports for up-to-date coverage
- **Filters** — filter by month and minimum hail size
- **Location panel** — click anywhere on the map to inspect a location or a specific hail report
- **Background preloading** — all years load silently in the background after the initial year renders

---

## Hail Size Reference

| Color | Size | Reference |
|-------|------|-----------|
| 🔵 Blue | < 1" | Pea |
| 🟡 Yellow | 1" – 2" | Quarter |
| 🟠 Orange | 2" – 3" | Golf ball |
| 🔴 Red | 3" – 5" | Baseball |
| 🟣 Purple | > 5" | Gorilla hail |

---

## Data Sources

All hail data is sourced from the **NOAA Storm Prediction Center (SPC)** Local Storm Reports:

- Annual files: `https://www.spc.noaa.gov/wcm/data/YYYY_hail.csv`
- Daily files: `https://www.spc.noaa.gov/climo/reports/YYMMDD_rpts_hail.csv`
- Current year rolling: `https://www.spc.noaa.gov/climo/reports/currently_hail.csv`

CORS is handled via proxy fallback (corsproxy.io → allorigins.win → direct).

---

## Project Structure
```
HomeAware/
├── pages/
│   └── hail.html       # Hail map page
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── config.js       # Constants, URLs, hail style tiers
│   ├── data.js         # Fetch, parse, and cache NOAA CSV data
│   ├── map.js          # Leaflet map init and marker rendering
│   ├── ui.js           # DOM bindings, tabs, panel, status
│   └── main.js         # App entry point
└── README.md
```

---

## Running Locally

ES modules require an HTTP server — you cannot open the HTML file directly via `file://`.
```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

---

## Tech Stack

- [Leaflet.js](https://leafletjs.com) — map rendering
- [CARTO Dark Matter](https://carto.com/basemaps/) — base tile layer
- [NOAA SPC](https://www.spc.noaa.gov) — hail report data
- Vanilla JS (ES modules, no bundler)
- Hosted on GitHub Pages

---

## Roadmap

- [ ] Reverse geocoding on map click (city/county/state lookup)
- [ ] Property-level damage assessment
- [ ] Insurance claim integration
- [ ] Wind and tornado report layers
- [ ] User accounts and saved locations

---

*HomeAware is a product of Winecoff Construction — currently in active development.*
