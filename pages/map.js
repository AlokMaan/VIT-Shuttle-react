/**
 * VIT ShuttleAI — Live Campus Tracker
 * Satellite Map | Road-Following Routes | Driver Info | Live Animation
 */

document.addEventListener('DOMContentLoaded', () => {
    const VIT_CENTER = [12.9692, 79.1559];
    const DEFAULT_ZOOM = 17;

    // ─── DRIVER DATA ─────────────────────────────────────────────────────────
    const DRIVERS = {
        'VIT-BUS-01': { name: 'Rajesh Kumar',   phone: '+91 98401 11001', rating: 4.9, trips: 1240, avatar: '👨‍✈️' },
        'VIT-BUS-07': { name: 'Suresh Babu',    phone: '+91 98401 11007', rating: 4.8, trips: 980,  avatar: '🧑‍✈️' },
        'VIT-BUS-12': { name: 'Murugan P.',     phone: '+91 98401 11012', rating: 4.7, trips: 875,  avatar: '👨‍✈️' },
        'VIT-BUS-04': { name: 'Karthik S.',     phone: '+91 98401 11004', rating: 5.0, trips: 1560, avatar: '🧑‍✈️' },
    };

    // ─── STOPS ───────────────────────────────────────────────────────────────
    const STOPS = [
        { id: 'main-gate',     name: 'Main Gate',         lat: 12.97160, lng: 79.15950, routes: ['alpha'],             color: '#00e5ff', eta: '2 min' },
        { id: 'sjt',           name: 'SJT Block',         lat: 12.96900, lng: 79.15555, routes: ['alpha', 'bravo'],    color: '#00e5ff', eta: '10 min' },
        { id: 'tt',            name: 'TT Complex',        lat: 12.96980, lng: 79.15310, routes: ['alpha'],             color: '#00e5ff', eta: '08:35 AM' },
        { id: 'mens-hostel',   name: "Men's Hostel",      lat: 12.97250, lng: 79.16250, routes: ['bravo'],             color: '#39ff14', eta: '7 min' },
        { id: 'library',       name: 'Library',           lat: 12.96835, lng: 79.15550, routes: ['bravo', 'charlie'],  color: '#39ff14', eta: '12 min' },
        { id: 'ladies-hostel', name: 'Ladies Hostel',     lat: 12.96625, lng: 79.15800, routes: ['bravo'],             color: '#39ff14', eta: '11 min' },
        { id: 'foodys',        name: 'Foodys / GDN',      lat: 12.96690, lng: 79.15425, routes: ['charlie'],           color: '#a879ff', eta: '9 min' },
        { id: 'prp',           name: 'PRP Block',         lat: 12.96700, lng: 79.15800, routes: ['charlie'],           color: '#a879ff', eta: '14 min' },
        { id: 'annex',         name: 'Annex Block',       lat: 12.97000, lng: 79.15440, routes: ['alpha', 'charlie'],  color: '#a879ff', eta: '6 min' },
        { id: 'admin',         name: 'Admin Block',       lat: 12.97005, lng: 79.15630, routes: ['delta'],             color: '#ffab00', eta: '5 min' },
        { id: 'indoor',        name: 'Indoor Stadium',    lat: 12.96670, lng: 79.15280, routes: ['delta'],             color: '#ffab00', eta: '8 min' },
        { id: 'outdoor',       name: 'Outdoor Stadium',   lat: 12.96600, lng: 79.15100, routes: ['delta'],             color: '#ffab00', eta: '3 min' },
        { id: 'cs-block',      name: 'CS / CDL Block',    lat: 12.96930, lng: 79.15560, routes: ['alpha'],             color: '#00e5ff', eta: '5 min' },
        { id: 'gdn',           name: 'Greenos (GDN)',     lat: 12.96720, lng: 79.15395, routes: ['charlie'],           color: '#a879ff', eta: '10 min' },
    ];

    // ─── ROUTES (road-following, based on satellite image) ──────────────────
    // Roads from satellite: main highway runs E-W at ~12.9685-12.9690
    // Campus internal road loops connect buildings along defined paths
    const ROUTES = {
        alpha: {
            name: 'Route Alpha — Main Gate → SJT → TT',
            shortName: 'Alpha',
            color: '#00e5ff',
            // Enters from Main Gate, follows entrance road SW to Admin, turns to SJT, west to TT
            path: [
                [12.97160, 79.15950], // Main Gate (start)
                [12.97148, 79.15930],
                [12.97132, 79.15905],
                [12.97118, 79.15878],
                [12.97108, 79.15855],
                [12.97098, 79.15828],
                [12.97088, 79.15802], // Entrance road curves SW
                [12.97078, 79.15778],
                [12.97068, 79.15752],
                [12.97058, 79.15728],
                [12.97048, 79.15704],
                [12.97040, 79.15680], // Admin block junction
                [12.97028, 79.15660],
                [12.97015, 79.15640],
                [12.97002, 79.15622],
                [12.96988, 79.15605],
                [12.96975, 79.15590],
                [12.96960, 79.15578],
                [12.96945, 79.15566],
                [12.96930, 79.15558], // SJT junction
                [12.96915, 79.15555],
                [12.96900, 79.15555], // SJT stop
                [12.96905, 79.15542],
                [12.96910, 79.15525],
                [12.96915, 79.15508],
                [12.96918, 79.15490],
                [12.96920, 79.15472],
                [12.96922, 79.15455],
                [12.96925, 79.15440], // turns west
                [12.96940, 79.15440],
                [12.96960, 79.15440],
                [12.96980, 79.15438],
                [12.97000, 79.15440], // Annex
                [12.96998, 79.15420],
                [12.96995, 79.15400],
                [12.96992, 79.15380],
                [12.96990, 79.15360],
                [12.96985, 79.15340],
                [12.96982, 79.15320],
                [12.96980, 79.15310], // TT Complex (end)
            ]
        },
        bravo: {
            name: "Route Bravo — Men's Hostel → SJT → Ladies Hostel",
            shortName: 'Bravo',
            color: '#39ff14',
            // Hostel road SW → Main entrance road → SJT → south road → Library → Ladies Hostel
            path: [
                [12.97250, 79.16250], // Men's Hostel (start)
                [12.97238, 79.16218],
                [12.97225, 79.16188],
                [12.97210, 79.16158],
                [12.97195, 79.16128],
                [12.97180, 79.16100],
                [12.97165, 79.16072],
                [12.97150, 79.16044],
                [12.97138, 79.16018],
                [12.97126, 79.15992],
                [12.97116, 79.15966], // joins entrance road
                [12.97108, 79.15940],
                [12.97100, 79.15915],
                [12.97094, 79.15890],
                [12.97086, 79.15865],
                [12.97078, 79.15840],
                [12.97070, 79.15815],
                [12.97062, 79.15790],
                [12.97053, 79.15766],
                [12.97044, 79.15742],
                [12.97035, 79.15718],
                [12.97025, 79.15696], // Admin junction
                [12.97012, 79.15676],
                [12.96998, 79.15658],
                [12.96983, 79.15641],
                [12.96968, 79.15626],
                [12.96953, 79.15612],
                [12.96938, 79.15600],
                [12.96922, 79.15584],
                [12.96908, 79.15570],
                [12.96900, 79.15555], // SJT stop
                [12.96890, 79.15553],
                [12.96878, 79.15552],
                [12.96865, 79.15551],
                [12.96851, 79.15550],
                [12.96835, 79.15550], // Library stop
                [12.96820, 79.15552],
                [12.96806, 79.15558],
                [12.96792, 79.15566],
                [12.96778, 79.15574],
                [12.96764, 79.15582],
                [12.96750, 79.15592],
                [12.96736, 79.15604],
                [12.96722, 79.15616],
                [12.96708, 79.15630],
                [12.96696, 79.15645],
                [12.96684, 79.15662],
                [12.96672, 79.15680],
                [12.96662, 79.15698],
                [12.96652, 79.15718],
                [12.96644, 79.15738],
                [12.96638, 79.15758],
                [12.96632, 79.15778],
                [12.96628, 79.15798],
                [12.96625, 79.15800], // Ladies Hostel (end)
            ]
        },
        charlie: {
            name: 'Route Charlie — PRP → Foodys → Annex',
            shortName: 'Charlie',
            color: '#a879ff',
            // Southern campus: PRP north along south road → Library → Foodys → GDN → Annex
            path: [
                [12.96700, 79.15800], // PRP (start)
                [12.96706, 79.15780],
                [12.96712, 79.15762],
                [12.96716, 79.15742],
                [12.96720, 79.15722],
                [12.96722, 79.15702],
                [12.96724, 79.15682],
                [12.96726, 79.15662],
                [12.96726, 79.15642],
                [12.96726, 79.15622],
                [12.96724, 79.15602],
                [12.96722, 79.15582],
                [12.96720, 79.15562],
                [12.96718, 79.15545], // Library junction
                [12.96715, 79.15530],
                [12.96712, 79.15518],
                [12.96708, 79.15506],
                [12.96704, 79.15494],
                [12.96700, 79.15482],
                [12.96696, 79.15470],
                [12.96693, 79.15458],
                [12.96690, 79.15438], // Foodys stop
                [12.96693, 79.15426],
                [12.96700, 79.15416],
                [12.96710, 79.15406],
                [12.96722, 79.15398],
                [12.96736, 79.15390],
                [12.96750, 79.15384],
                [12.96765, 79.15378],
                [12.96782, 79.15374],
                [12.96800, 79.15374],
                [12.96818, 79.15376],
                [12.96836, 79.15380],
                [12.96854, 79.15386],
                [12.96872, 79.15392],
                [12.96890, 79.15400],
                [12.96908, 79.15408],
                [12.96924, 79.15418],
                [12.96940, 79.15428],
                [12.96956, 79.15434],
                [12.96972, 79.15438],
                [12.96988, 79.15440],
                [12.97000, 79.15440], // Annex (end)
            ]
        },
        delta: {
            name: 'Route Delta — Outdoor → Indoor → Admin',
            shortName: 'Delta',
            color: '#ffab00',
            // Stadium road N → Indoor → west road NE → Annex → Admin Block
            path: [
                [12.96600, 79.15100], // Outdoor Stadium (start)
                [12.96610, 79.15118],
                [12.96620, 79.15135],
                [12.96630, 79.15152],
                [12.96640, 79.15168],
                [12.96650, 79.15185],
                [12.96658, 79.15202],
                [12.96665, 79.15220],
                [12.96668, 79.15238],
                [12.96670, 79.15256],
                [12.96670, 79.15280], // Indoor Stadium stop
                [12.96672, 79.15300],
                [12.96675, 79.15318],
                [12.96679, 79.15336],
                [12.96684, 79.15354],
                [12.96692, 79.15372],
                [12.96700, 79.15388],
                [12.96712, 79.15403],
                [12.96724, 79.15416],
                [12.96736, 79.15428],
                [12.96750, 79.15438],
                [12.96765, 79.15442],
                [12.96782, 79.15446],
                [12.96800, 79.15448], // Annex junction
                [12.96820, 79.15449],
                [12.96840, 79.15450],
                [12.96860, 79.15452],
                [12.96880, 79.15454],
                [12.96900, 79.15458],
                [12.96918, 79.15464],
                [12.96934, 79.15472],
                [12.96948, 79.15482],
                [12.96960, 79.15494],
                [12.96970, 79.15508],
                [12.96979, 79.15522],
                [12.96986, 79.15538],
                [12.96993, 79.15554],
                [12.96998, 79.15570],
                [12.97002, 79.15588],
                [12.97004, 79.15606],
                [12.97005, 79.15625],
                [12.97005, 79.15630], // Admin Block (end)
            ]
        }
    };

    // ─── BUS DATA (with driver names & staggered start positions) ────────────
    const BUSES = [
        { id: 'VIT-BUS-01', route: 'alpha',   speed: 22, occ: '65%', pathProgress: 2 },
        { id: 'VIT-BUS-07', route: 'bravo',   speed: 18, occ: '80%', pathProgress: 5 },
        { id: 'VIT-BUS-12', route: 'charlie', speed: 20, occ: '45%', pathProgress: 3 },
        { id: 'VIT-BUS-04', route: 'delta',   speed: 15, occ: '30%', pathProgress: 8 },
    ];

    // ─── SATELLITE TILE (only one tile — pure satellite) ─────────────────────
    const satelliteTile = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 20, attribution: '© Esri | © VIT ShuttleAI' }
    );

    // ─── INIT MAP ─────────────────────────────────────────────────────────────
    const map = L.map('main-map', {
        center: VIT_CENTER,
        zoom: DEFAULT_ZOOM,
        layers: [satelliteTile],
        zoomControl: true,
        attributionControl: true
    });
    map.zoomControl.setPosition('bottomright');

    // ─── ANIMATED GLOWING ROUTE LINES ────────────────────────────────────────
    const routePolylines = {};
    const routeLayerGroup = L.layerGroup().addTo(map);

    Object.entries(ROUTES).forEach(([key, route]) => {
        // Shadow glow layer (wider, more transparent)
        L.polyline(route.path, {
            color: route.color,
            weight: 12,
            opacity: 0.18,
            lineCap: 'round',
            lineJoin: 'round',
            smoothFactor: 1
        }).addTo(routeLayerGroup);

        // Main animated route line
        const polyline = L.polyline(route.path, {
            color: route.color,
            weight: 5,
            opacity: 0.92,
            lineCap: 'round',
            lineJoin: 'round',
            smoothFactor: 1
        });
        polyline.addTo(routeLayerGroup);
        routePolylines[key] = polyline;
    });

    // ─── ANIMATED STOP MARKERS ────────────────────────────────────────────────
    const stopMarkers = {};
    const stopLayerGroup = L.layerGroup().addTo(map);

    STOPS.forEach(stop => {
        // Outer glow ring
        L.circleMarker([stop.lat, stop.lng], {
            radius: 14, fillColor: 'transparent',
            color: stop.color, weight: 2, opacity: 0.35, fillOpacity: 0
        }).addTo(stopLayerGroup);

        const marker = L.circleMarker([stop.lat, stop.lng], {
            radius: 8, fillColor: stop.color,
            color: '#fff', weight: 2.5, opacity: 1, fillOpacity: 1
        });

        const stopRouteNames = stop.routes.map(r => `<span style="color:${ROUTES[r]?.color || '#fff'};font-weight:700;">${ROUTES[r]?.shortName || r}</span>`).join(' · ');
        marker.bindPopup(`
            <div style="min-width:170px;font-family:'Space Grotesk',sans-serif;">
                <div style="font-size:1rem;font-weight:700;color:#1a1030;margin-bottom:4px;">📍 ${stop.name}</div>
                <div style="font-size:0.78rem;margin-bottom:6px;">${stopRouteNames}</div>
                <div style="font-size:0.82rem;color:#444;">
                    Next bus: <strong style="color:${stop.color}">${stop.eta}</strong>
                </div>
            </div>
        `);
        marker.addTo(stopLayerGroup);
        stopMarkers[stop.id] = marker;
    });

    // ─── ADVANCED ANIMATED BUS MARKERS ───────────────────────────────────────
    const busMarkers = {};
    const busLayerGroup = L.layerGroup().addTo(map);

    function createBusIcon(bus, color) {
        const driver = DRIVERS[bus.id];
        const num = bus.id.split('-')[2];
        const iconId = 'bus-icon-' + bus.id;
        return L.divIcon({
            className: '',
            html: `
            <div id="${iconId}" style="
                position:relative;
                width:44px; height:44px;
                display:flex; align-items:center; justify-content:center;
            ">
                <!-- Outer pulse ring -->
                <div style="
                    position:absolute; inset:-8px; border-radius:50%;
                    border:2.5px solid ${color};
                    animation:busRing 1.8s ease-out infinite;
                    opacity:0.7;
                "></div>
                <!-- Mid ring -->
                <div style="
                    position:absolute; inset:-2px; border-radius:50%;
                    border:1.5px solid ${color}80;
                    animation:busRing 1.8s ease-out 0.6s infinite;
                "></div>
                <!-- Bus body -->
                <div class="bus-body" style="
                    width:40px; height:40px; border-radius:50%;
                    background:${color};
                    border:3px solid #fff;
                    display:flex; flex-direction:column;
                    align-items:center; justify-content:center;
                    box-shadow:0 0 20px ${color}, 0 0 40px ${color}66, 0 4px 12px rgba(0,0,0,0.6);
                    position:relative; z-index:2;
                    cursor:pointer;
                ">
                    <span style="font-size:14px;line-height:1;">${driver.avatar}</span>
                    <span style="font-family:'Space Grotesk',sans-serif;font-size:8px;font-weight:800;color:#060010;line-height:1.1;">${num}</span>
                </div>
                <!-- Direction arrow -->
                <div class="bus-arrow" style="
                    position:absolute; width:0; height:0;
                    top:-2px; left:50%; margin-left:-5px;
                    border-left:5px solid transparent;
                    border-right:5px solid transparent;
                    border-bottom:9px solid ${color};
                    filter:drop-shadow(0 0 4px ${color});
                    transform-origin:5px 11px;
                "></div>
            </div>`,
            iconSize: [44, 44],
            iconAnchor: [22, 22]
        });
    }

    function buildBusPopup(bus) {
        const driver = DRIVERS[bus.id];
        const route  = ROUTES[bus.route];
        const stars  = '⭐'.repeat(Math.floor(driver.rating));
        return `
        <div style="min-width:240px;font-family:'Space Grotesk',sans-serif;">
            <!-- Driver card header -->
            <div style="
                display:flex;align-items:center;gap:12px;
                background:${route.color}18;border-radius:10px;
                padding:10px 12px;margin-bottom:10px;
                border:1px solid ${route.color}40;
            ">
                <div style="font-size:2.5rem;line-height:1;">${driver.avatar}</div>
                <div>
                    <div style="font-size:1rem;font-weight:800;color:#1a1030;">${driver.name}</div>
                    <div style="font-size:0.72rem;color:#555;font-weight:500;">${bus.id} &nbsp;·&nbsp; <span style="color:${route.color};font-weight:700;">${route.shortName}</span></div>
                    <div style="font-size:0.72rem;margin-top:2px;">${stars} <span style="color:#555;">${driver.rating}/5</span></div>
                </div>
            </div>
            <!-- Live stats -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <div style="background:#f5f6fa;border-radius:8px;padding:8px;text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:${route.color};">${bus.speed}<span style="font-size:0.65rem;color:#666;"> km/h</span></div>
                    <div style="font-size:0.65rem;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Speed</div>
                </div>
                <div style="background:#f5f6fa;border-radius:8px;padding:8px;text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:#2ecc71;">${bus.occ}</div>
                    <div style="font-size:0.65rem;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Occupancy</div>
                </div>
            </div>
            <!-- Route name -->
            <div style="font-size:0.78rem;color:#444;padding:6px 8px;background:#f5f6fa;border-radius:8px;margin-bottom:8px;font-weight:600;">
                🗺️ ${route.name}
            </div>
            <!-- Trips -->
            <div style="font-size:0.72rem;color:#666;text-align:center;">
                🏆 ${driver.trips.toLocaleString()} completed trips
            </div>
        </div>`;
    }

    BUSES.forEach(bus => {
        const route = ROUTES[bus.route];
        const startPos = route.path[Math.min(bus.pathProgress, route.path.length - 1)];

        const marker = L.marker(startPos, {
            icon: createBusIcon(bus, route.color),
            zIndexOffset: 1000
        });
        marker.bindPopup(buildBusPopup(bus), { maxWidth: 280 });
        marker.addTo(busLayerGroup);

        // Store references to DOM elements for efficient animation updates
        const iconEl = marker.getElement();
        const arrowEl = iconEl ? iconEl.querySelector('.bus-arrow') : null;
        const bodyEl = iconEl ? iconEl.querySelector('.bus-body') : null;

        busMarkers[bus.id] = { marker, bus, progress: bus.pathProgress, direction: 1, arrowEl, bodyEl };
    });

    // ─── LIVE BUS ANIMATION (60fps smooth path following) ────────────────────
    let lastTime = performance.now();

    function animateBuses(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta
        lastTime = now;

        Object.values(busMarkers).forEach(bm => {
            const route = ROUTES[bm.bus.route];
            const path  = route.path;
            const maxP  = path.length - 1;

            // Fast, smooth animation — no speed control
            bm.progress += bm.direction * 0.028 * (dt / 0.016);

            if (bm.progress >= maxP) { bm.progress = maxP; bm.direction = -1; }
            else if (bm.progress <= 0) { bm.progress = 0;   bm.direction =  1; }

            const i0  = Math.floor(bm.progress);
            const i1  = Math.min(i0 + 1, maxP);
            const f   = bm.progress - i0;
            const lat = path[i0][0] + (path[i1][0] - path[i0][0]) * f;
            const lng = path[i0][1] + (path[i1][1] - path[i0][1]) * f;

            // Heading angle
            const dLat = path[i1][0] - path[i0][0];
            const dLng = path[i1][1] - path[i0][1];
            const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);

            // Update marker position only (no icon recreation)
            bm.marker.setLatLng([lat, lng]);

            // Lazily get DOM element references (may not exist at creation time)
            if (!bm.arrowEl || !bm.bodyEl) {
                const el = bm.marker.getElement();
                if (el) {
                    bm.arrowEl = el.querySelector('.bus-arrow');
                    bm.bodyEl = el.querySelector('.bus-body');
                }
            }

            // Update arrow rotation via direct DOM manipulation
            if (bm.arrowEl) {
                bm.arrowEl.style.transform = `rotate(${angle}deg)`;
            }
        });

        requestAnimationFrame(animateBuses);
    }
    requestAnimationFrame(animateBuses);

    // ─── CAMPUS BOUNDARY ─────────────────────────────────────────────────────
    L.polygon([
        [12.9740, 79.1490], [12.9740, 79.1640],
        [12.9645, 79.1640], [12.9645, 79.1490],
    ], {
        color: '#a879ff', weight: 2.5, opacity: 0.7,
        fillColor: '#a879ff', fillOpacity: 0.04, dashArray: '10 5'
    }).addTo(map).bindPopup('<strong style="color:#1a1030;font-size:1rem;">🎓 VIT Vellore Campus</strong><br><span style="color:#555;font-size:0.8rem;">12.9692° N, 79.1559° E</span>');

    // Campus label overlay
    L.marker(VIT_CENTER, {
        icon: L.divIcon({
            className: '',
            html: `<div style="
                font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:800;
                color:#fff; text-shadow:0 0 8px #000, 0 0 20px rgba(168,121,255,0.9);
                white-space:nowrap;letter-spacing:0.06em;pointer-events:none;
                background:rgba(0,0,0,0.55);padding:4px 10px;border-radius:20px;
                border:1.5px solid rgba(168,121,255,0.5);backdrop-filter:blur(4px);
            ">🎓 VIT Vellore Campus</div>`,
            iconSize: [200, 28],
            iconAnchor: [100, 14]
        })
    }).addTo(map);

    // ─── ROUTE FILTER ─────────────────────────────────────────────────────────
    document.querySelectorAll('.route-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const route = btn.dataset.route;
            document.querySelectorAll('.route-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (route === 'all') {
                Object.values(routePolylines).forEach(p => p.setStyle({ opacity: 0.92 }));
                Object.values(stopMarkers).forEach(m => m.setStyle({ opacity: 1, fillOpacity: 1 }));
                Object.values(busMarkers).forEach(bm => bm.marker.setOpacity(1));
            } else {
                Object.entries(routePolylines).forEach(([key, p]) =>
                    p.setStyle({ opacity: key === route ? 0.95 : 0.08 }));
                STOPS.forEach(stop => {
                    const m = stopMarkers[stop.id];
                    const inRoute = stop.routes.includes(route);
                    if (m) m.setStyle({ opacity: inRoute ? 1 : 0.12, fillOpacity: inRoute ? 1 : 0.1 });
                });
                Object.values(busMarkers).forEach(bm =>
                    bm.marker.setOpacity(bm.bus.route === route ? 1 : 0.12));
            }
        });
    });


    // ─── SIDEBAR TOGGLE ──────────────────────────────────────────────────────
    const sidebar = document.getElementById('map-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }

    // ─── CLICK STOP → FLY TO ─────────────────────────────────────────────────
    document.querySelectorAll('.stop-card').forEach(card => {
        card.addEventListener('click', () => {
            const stop = STOPS.find(s => s.id === card.dataset.stop);
            if (stop) {
                map.flyTo([stop.lat, stop.lng], 19, { duration: 1.2 });
                stopMarkers[stop.id]?.openPopup();
            }
        });
    });

    // ─── CLICK BUS CARD → FLY TO BUS ────────────────────────────────────────
    document.querySelectorAll('.bus-card').forEach(card => {
        card.addEventListener('click', () => {
            const busId = card.dataset.bus;
            const bm = busMarkers[busId];
            if (bm) {
                const pos = bm.marker.getLatLng();
                map.flyTo(pos, 19, { duration: 1.2 });
                bm.marker.openPopup();
            }
        });
    });

    // ─── NAV EFFECT: "Advanced Intuitive Navigation" ─────────────────────────
    // Show a sweeping radar scan on map open
    setTimeout(() => {
        const scanEl = document.getElementById('nav-scan');
        if (scanEl) scanEl.classList.add('active');
        setTimeout(() => { if (scanEl) scanEl.classList.remove('active'); }, 2200);
    }, 800);

    console.log('🛰️ VIT ShuttleAI — Satellite Live Tracker activated');
});
