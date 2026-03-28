/* Home page JS — Preview map with satellite + road routes */
document.addEventListener('DOMContentLoaded', () => {
    // Counter animation for hero stats
    const statEls = document.querySelectorAll('.stat-value[data-target]');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                window.animateCounter && window.animateCounter(el, parseInt(el.dataset.target));
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statEls.forEach(el => obs.observe(el));

    // Parallax orbs
    window.addEventListener('mousemove', (e) => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        document.querySelectorAll('.hero-orb').forEach((orb, i) => {
            const f = (i + 1) * 12;
            orb.style.transform = `translate(${mx * f}px, ${my * f}px)`;
        });
    });

    // ── PREVIEW MINI MAP (satellite tile, road-following routes) ──────────────
    const mapEl = document.getElementById('preview-map');
    if (!mapEl || typeof L === 'undefined') return;

    const map = L.map('preview-map', {
        center: [12.9692, 79.1559],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        keyboard: false,
        doubleClickZoom: false
    });

    // Satellite tile
    L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 20 }
    ).addTo(map);

    // ── ROAD-FOLLOWING ROUTE LINES ───────────────────────────────────────────
    // Alpha — Main Gate → entrance road → SJT → TT
    const alpha = [
        [12.97160, 79.15950], [12.97108, 79.15855], [12.97040, 79.15680],
        [12.96988, 79.15605], [12.96945, 79.15566], [12.96900, 79.15555],
        [12.96920, 79.15472], [12.96925, 79.15440], [12.97000, 79.15440],
        [12.96980, 79.15310]
    ];
    // Bravo — Men's Hostel → entrance road → SJT → Library → Ladies Hostel
    const bravo = [
        [12.97250, 79.16250], [12.97116, 79.15966], [12.97040, 79.15680],
        [12.96968, 79.15626], [12.96900, 79.15555], [12.96835, 79.15550],
        [12.96750, 79.15592], [12.96625, 79.15800]
    ];
    // Charlie — PRP → Library → Foodys → Annex
    const charlie = [
        [12.96700, 79.15800], [12.96722, 79.15702], [12.96718, 79.15545],
        [12.96690, 79.15438], [12.96800, 79.15374], [12.96940, 79.15428],
        [12.97000, 79.15440]
    ];
    // Delta — Outdoor Stadium → Indoor → Admin Block
    const delta = [
        [12.96600, 79.15100], [12.96670, 79.15280], [12.96712, 79.15403],
        [12.96800, 79.15448], [12.96948, 79.15482], [12.97005, 79.15630]
    ];

    // Draw glow + main line for each route
    [
        { path: alpha,   color: '#00e5ff' },
        { path: bravo,   color: '#39ff14' },
        { path: charlie, color: '#a879ff' },
        { path: delta,   color: '#ffab00' }
    ].forEach(r => {
        // glow
        L.polyline(r.path, { color: r.color, weight: 10, opacity: 0.18, lineCap: 'round' }).addTo(map);
        // main
        L.polyline(r.path, { color: r.color, weight: 4,  opacity: 0.95, lineCap: 'round' }).addTo(map);
    });

    // ── CAMPUS BOUNDARY ───────────────────────────────────────────────────────
    L.polygon([
        [12.9740, 79.1490], [12.9740, 79.1640],
        [12.9645, 79.1640], [12.9645, 79.1490]
    ], {
        color: '#a879ff', weight: 1.8, opacity: 0.65,
        fillColor: '#a879ff', fillOpacity: 0.04, dashArray: '10 5'
    }).addTo(map);

    // ── KEY STOPS ─────────────────────────────────────────────────────────────
    [
        { pos: [12.9716, 79.1595], c: '#00e5ff', r: 7 },  // Main Gate
        { pos: [12.9690, 79.1555], c: '#00e5ff', r: 6 },  // SJT
        { pos: [12.9698, 79.1531], c: '#00e5ff', r: 5 },  // TT
        { pos: [12.9683, 79.1555], c: '#39ff14', r: 6 },  // Library
        { pos: [12.9725, 79.1625], c: '#39ff14', r: 6 },  // Men's Hostel
        { pos: [12.9662, 79.1580], c: '#39ff14', r: 5 },  // Ladies Hostel
        { pos: [12.9669, 79.1544], c: '#a879ff', r: 5 },  // Foodys
        { pos: [12.9700, 79.1580], c: '#a879ff', r: 5 },  // PRP
        { pos: [12.9700, 79.1544], c: '#a879ff', r: 6 },  // Annex
        { pos: [12.9700, 79.1563], c: '#ffab00', r: 5 },  // Admin Block
        { pos: [12.9660, 79.1510], c: '#ffab00', r: 5 },  // Outdoor Stadium
    ].forEach(s => {
        L.circleMarker(s.pos, {
            radius: s.r, fillColor: s.c, color: '#fff',
            weight: 2, fillOpacity: 1
        }).addTo(map);
    });

    // Live bus preview dots (animated)
    const busDots = [
        { pos: [12.9705, 79.1580], c: '#00e5ff' },
        { pos: [12.9694, 79.1558], c: '#39ff14' },
        { pos: [12.9688, 79.1520], c: '#a879ff' },
        { pos: [12.9668, 79.1528], c: '#ffab00' },
    ];
    busDots.forEach(b => {
        const m = L.circleMarker(b.pos, {
            radius: 9, fillColor: b.c, color: '#fff',
            weight: 2.5, fillOpacity: 1
        }).addTo(map);
        // Outer pulse ring
        L.circleMarker(b.pos, {
            radius: 16, fillColor: 'transparent',
            color: b.c, weight: 1.5, opacity: 0.4
        }).addTo(map);
    });

    // Campus label
    L.marker([12.9692, 79.1559], {
        icon: L.divIcon({
            className: '',
            html: `<div style="
                font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:800;
                color:#fff;text-shadow:0 0 6px #000,0 0 18px rgba(168,121,255,0.9);
                white-space:nowrap;pointer-events:none;
                background:rgba(0,0,0,0.6);padding:3px 8px;
                border-radius:12px;border:1px solid rgba(168,121,255,0.5);
            ">🎓 VIT Vellore Campus</div>`,
            iconSize: [180, 22], iconAnchor: [90, 11]
        })
    }).addTo(map);

    // Click to open full map
    map.on('click', () => { window.location.href = 'map.html'; });
    mapEl.style.cursor = 'pointer';
    mapEl.title = 'Click to open Live Tracker';
});
