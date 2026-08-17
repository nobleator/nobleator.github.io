const map = L.map('map');
L.maplibreGL({
    style: 'https://tiles.openfreemap.org/styles/positron'
}).addTo(map);

function scoreColor(v) {
    // white (255,255,255) -> green (34,197,94) linear interpolation
    const r = Math.round(255 + (34 - 255) * v);
    const g = Math.round(255 + (197 - 255) * v);
    const b = Math.round(255 + (94 - 255) * v);
    return `rgb(${r},${g},${b})`;
}

function makeIcon(score) {
    const bg = scoreColor(score);
    const fg = score > 0.55 ? '#000' : '#333'; // always dark text; bg stays light-to-green
    return L.divIcon({
        className: '',
        html: `<div class="score-marker" style="background:${bg};color:${fg}">${score.toFixed(2)}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
    });
}

function buildPopup(loc) {
    const rows = (loc.details || []).map(d => {
        const indent = '&nbsp;'.repeat(d.depth * 4);
        const sc = Number(d.score).toFixed(3);
        const zCls = Number(d.score) === 0 ? 'zero' : '';
        return `<div class="tree-row">
            <span class="tree-label">${indent}${escHtml(d.label)}</span>
            <span class="tree-score ${zCls}">${sc}</span>
        </div>`;
    }).join('');

    return `<div class="score-popup">
        <h3>${escHtml(loc.name)} (efficient: ${loc.paretoEfficient})</h3>
        ${rows}
    </div>`;
}

function escHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const paretoCheckbox = document.getElementById('pareto-checkbox');
const scoreRadios = document.querySelectorAll('input[name="score-set"]');

let markers = [];
let hasFitBounds = false;

function applyFilters() {
    const paretoOnly = paretoCheckbox.checked;
    markers.forEach(({ marker, score, paretoEfficient }) => {
        if (paretoOnly && !paretoEfficient) {
            map.removeLayer(marker);
        } else {
            marker.addTo(map);
            marker.setIcon(makeIcon(score));
        }
    });
}

function clearMarkers() {
    markers.forEach(({ marker }) => map.removeLayer(marker));
    markers = [];
}

function loadScores(url) {
    clearMarkers();

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return res.json();
        })
        .then(locations => {
            if (!locations.length) {
                alert('No data found.');
                return;
            }

            const bounds = [];

            locations.forEach(loc => {
                if (loc.lat == null || loc.lon == null) return;
                const score = Number(loc.score ?? 0);
                const paretoEfficient = !!loc.paretoEfficient;
                const marker = L.marker([loc.lat, loc.lon], { icon: makeIcon(score) })
                    .bindPopup(buildPopup(loc), { maxWidth: 400 })
                    .addTo(map);
                markers.push({ marker, score, paretoEfficient });
                bounds.push([loc.lat, loc.lon]);
            });

            if (bounds.length && !hasFitBounds) {
                map.fitBounds(bounds, { padding: [40, 40] });
                map.zoomIn(2);
                hasFitBounds = true;
            }

            applyFilters();
        })
        .catch(err => alert('Failed to load scores: ' + err.message));
}

paretoCheckbox.addEventListener('change', applyFilters);

scoreRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.checked) loadScores(radio.value);
    });
});

const initialRadio = document.querySelector('input[name="score-set"]:checked');
loadScores(initialRadio ? initialRadio.value : '/assets/js/artemis/scores-a.json');