// Initialize the map
var map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [-98, 38.8],
    zoom: 3.8,
    maxBounds: [
        [-125, 24], // Southwest coordinates (longitude, latitude)
        [-66, 50]   // Northeast coordinates
    ]
});

let marker = new maplibregl.Marker();
marker.setLngLat([-93.7, 45.3]);
marker.addTo(map);

// Add navigation controls
map.addControl(new maplibregl.NavigationControl());

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});