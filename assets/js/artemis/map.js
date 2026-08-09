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

function makeIcon(score, dim) {
    const bg = scoreColor(score);
    const fg = score > 0.55 ? '#000' : '#333'; // always dark text; bg stays light-to-green
    const dimCls = dim ? 'dim' : '';
    return L.divIcon({
        className: '',
        html: `<div class="score-marker ${dimCls}" style="background:${bg};color:${fg}">${score.toFixed(2)}</div>`,
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
        <h3>${escHtml(loc.name)}</h3>
        ${rows}
    </div>`;
}

function escHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// SCORES_DATA is defined in scores.js (var SCORES_DATA = [...])
const locations = window.SCORES_DATA || [];
if (!locations.length) {
    alert('No data found. Make sure scores.js is in the same folder and defines SCORES_DATA.');
} else {
    const bounds = [];
    const markers = []; // { marker, score }

    locations.forEach(loc => {
        if (loc.lat == null || loc.lon == null) return;
        const score = Number(loc.score ?? 0);
        const marker = L.marker([loc.lat, loc.lon], { icon: makeIcon(score, false) })
            .bindPopup(buildPopup(loc), { maxWidth: 400 })
            .addTo(map);
        markers.push({ marker, score });
        bounds.push([loc.lat, loc.lon]);
    });

    if (bounds.length) {
        map.fitBounds(bounds, { padding: [40, 40] });
        map.setZoom(map.getZoom() + 2);
    }

    const slider = document.getElementById('threshold');
    const sliderVal = document.getElementById('threshold-val');

    function applyThreshold(t) {
        markers.forEach(({ marker, score }) => {
            marker.setIcon(makeIcon(score, score < t));
        });
    }

    slider.addEventListener('input', () => {
        const t = parseFloat(slider.value);
        sliderVal.textContent = t.toFixed(2);
        applyThreshold(t);
    });

    applyThreshold(parseFloat(slider.value));
}