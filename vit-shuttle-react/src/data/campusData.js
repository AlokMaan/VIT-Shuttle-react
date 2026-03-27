/**
 * VIT Vellore Campus — Accurate Road-Following Route Data
 * All coordinates follow actual campus roads between blocks.
 * Routes include granular waypoints for smooth, road-wise shuttle animation.
 */

export const VIT_CENTER = [12.9692, 79.1559];
export const DEFAULT_ZOOM = 16;

// =============================================
// VIT VELLORE CAMPUS STOPS (Real coordinates)
// All major blocks, hostels, facilities
// =============================================
export const STOPS = [
  { id: 'main-gate',     name: 'Main Gate Terminus',    lat: 12.9716, lng: 79.1595, routes: ['alpha'],             color: '#6dddff', icon: 'door_front',      eta: '2 min' },
  { id: 'admin',         name: 'Admin Block',           lat: 12.9705, lng: 79.1565, routes: ['alpha', 'delta'],    color: '#6dddff', icon: 'corporate_fare',  eta: '5 min' },
  { id: 'sjt',           name: 'SJT Academic Block',    lat: 12.9690, lng: 79.1555, routes: ['alpha', 'bravo'],    color: '#6dddff', icon: 'school',          eta: '10 min' },
  { id: 'tt',            name: 'Technology Tower',      lat: 12.9698, lng: 79.1530, routes: ['alpha'],             color: '#6dddff', icon: 'apartment',       eta: '08:35 AM' },
  { id: 'cs-block',      name: 'CDMM (CS Block)',       lat: 12.9685, lng: 79.1560, routes: ['alpha'],             color: '#6dddff', icon: 'memory',          eta: '5 min' },
  { id: 'mens-hostel',   name: "Men's Hostel Zone",     lat: 12.9725, lng: 79.1625, routes: ['bravo'],             color: '#00fd87', icon: 'hotel',           eta: '7 min' },
  { id: 'library',       name: 'Central Library',       lat: 12.9680, lng: 79.1550, routes: ['bravo', 'charlie'],  color: '#00fd87', icon: 'local_library',   eta: '12 min' },
  { id: 'ladies-hostel', name: 'Ladies Hostel',         lat: 12.9660, lng: 79.1580, routes: ['bravo'],             color: '#00fd87', icon: 'apartment',       eta: '11 min' },
  { id: 'foodys',        name: 'Foodys / Darling',      lat: 12.9672, lng: 79.1542, routes: ['charlie'],           color: '#ac89ff', icon: 'restaurant',      eta: '9 min' },
  { id: 'gdn',           name: 'Greenos (GDN)',         lat: 12.9675, lng: 79.1535, routes: ['charlie'],           color: '#ac89ff', icon: 'park',            eta: '10 min' },
  { id: 'prp',           name: 'PRP Block',             lat: 12.9670, lng: 79.1580, routes: ['charlie'],           color: '#ac89ff', icon: 'domain',          eta: '14 min' },
  { id: 'annex',         name: 'Annex Building',        lat: 12.9700, lng: 79.1540, routes: ['alpha', 'charlie'],  color: '#ac89ff', icon: 'business',        eta: '6 min' },
  { id: 'indoor',        name: 'Indoor Stadium',        lat: 12.9670, lng: 79.1520, routes: ['delta'],             color: '#fbbf24', icon: 'sports_tennis',   eta: '8 min' },
  { id: 'outdoor',       name: 'Outdoor Stadium',       lat: 12.9660, lng: 79.1510, routes: ['delta'],             color: '#fbbf24', icon: 'sports_soccer',   eta: '3 min' },
  { id: 'mb',            name: 'MB (Mech Block)',       lat: 12.9695, lng: 79.1570, routes: ['delta'],             color: '#fbbf24', icon: 'precision_manufacturing', eta: '4 min' },
  { id: 'smc',           name: 'SMV (Commerce)',        lat: 12.9688, lng: 79.1575, routes: ['bravo'],             color: '#00fd87', icon: 'account_balance', eta: '6 min' },
];

// =============================================
// ROAD-FOLLOWING ROUTES — Granular waypoints
// Each route has many intermediate GPS coordinates
// following actual campus roads and turns.
// More waypoints = smoother, realistic movement.
// =============================================
export const ROUTES = {
  alpha: {
    name: 'Route Alpha',
    label: 'A',
    color: '#6dddff',
    description: 'Main Gate → Admin → SJT → CDMM → Annex → TT',
    stops: ['main-gate', 'admin', 'sjt', 'cs-block', 'annex', 'tt'],
    // Dense road-following path with curves
    path: [
      // Main Gate - start at entrance road
      [12.97160, 79.15950],
      [12.97148, 79.15930],
      [12.97135, 79.15905],
      [12.97120, 79.15880],
      // Curve along the main entrance road heading west
      [12.97108, 79.15855],
      [12.97095, 79.15830],
      [12.97085, 79.15808],
      [12.97078, 79.15785],
      // Approaching Admin Block roundabout
      [12.97070, 79.15760],
      [12.97065, 79.15735],
      [12.97058, 79.15710],
      [12.97055, 79.15685],
      [12.97050, 79.15660], // Admin Block area
      // Turn south towards SJT - campus inner ring road
      [12.97040, 79.15645],
      [12.97028, 79.15630],
      [12.97015, 79.15615],
      [12.97000, 79.15600],
      [12.96985, 79.15588],
      [12.96968, 79.15575],
      [12.96950, 79.15565],
      [12.96935, 79.15558],
      [12.96920, 79.15555],
      [12.96900, 79.15550], // SJT Academic Block
      // Continue south to CDMM/CS Block
      [12.96888, 79.15555],
      [12.96875, 79.15558],
      [12.96862, 79.15562],
      [12.96850, 79.15600], // CDMM (CS Block)
      // Head west towards Annex
      [12.96862, 79.15575],
      [12.96878, 79.15560],
      [12.96895, 79.15545],
      [12.96910, 79.15530],
      [12.96928, 79.15518],
      [12.96945, 79.15505],
      [12.96960, 79.15490],
      [12.96975, 79.15475],
      [12.96988, 79.15458],
      [12.97000, 79.15440],
      [12.97000, 79.15400], // Annex Building
      // Continue to TT Complex
      [12.96995, 79.15380],
      [12.96990, 79.15360],
      [12.96985, 79.15340],
      [12.96980, 79.15320],
      [12.96980, 79.15300], // Technology Tower
    ]
  },
  bravo: {
    name: 'Route Bravo',
    label: 'B',
    color: '#00fd87',
    description: "Men's Hostel → Admin → SJT → Library → SMV → Ladies Hostel",
    stops: ['mens-hostel', 'admin', 'sjt', 'library', 'smc', 'ladies-hostel'],
    path: [
      // Men's Hostel area - eastern campus
      [12.97250, 79.16250],
      [12.97238, 79.16228],
      [12.97225, 79.16200],
      [12.97210, 79.16178],
      [12.97195, 79.16155],
      // Road heading west along hostel district
      [12.97180, 79.16130],
      [12.97168, 79.16105],
      [12.97155, 79.16080],
      [12.97140, 79.16055],
      [12.97128, 79.16030],
      [12.97118, 79.16005],
      [12.97108, 79.15980],
      // Approaching central campus road junction
      [12.97098, 79.15955],
      [12.97088, 79.15930],
      [12.97078, 79.15905],
      [12.97068, 79.15880],
      [12.97062, 79.15855],
      [12.97058, 79.15830],
      [12.97055, 79.15805],
      [12.97052, 79.15780],
      [12.97050, 79.15755],
      [12.97048, 79.15730],
      // Past Admin towards SJT
      [12.97038, 79.15700],
      [12.97025, 79.15680],
      [12.97010, 79.15660],
      [12.96995, 79.15640],
      [12.96975, 79.15620],
      [12.96955, 79.15600],
      [12.96935, 79.15585],
      [12.96918, 79.15570],
      [12.96900, 79.15555], // SJT
      // Turn south to Library road
      [12.96888, 79.15548],
      [12.96872, 79.15542],
      [12.96858, 79.15538],
      [12.96842, 79.15535],
      [12.96828, 79.15532],
      [12.96812, 79.15530],
      [12.96800, 79.15500], // Library
      // Continue east towards SMV and Ladies Hostel
      [12.96800, 79.15520],
      [12.96795, 79.15545],
      [12.96790, 79.15570],
      [12.96885, 79.15750], // SMV Commerce
      // Road curves southeast
      [12.96780, 79.15600],
      [12.96770, 79.15625],
      [12.96758, 79.15650],
      [12.96745, 79.15672],
      [12.96730, 79.15695],
      [12.96715, 79.15718],
      [12.96700, 79.15740],
      [12.96685, 79.15758],
      [12.96668, 79.15775],
      [12.96650, 79.15788],
      [12.96620, 79.15800], // Ladies Hostel
    ]
  },
  charlie: {
    name: 'Route Charlie',
    label: 'C',
    color: '#ac89ff',
    description: 'PRP → Library → Foodys → GDN → Annex',
    stops: ['prp', 'library', 'foodys', 'gdn', 'annex'],
    path: [
      // PRP Block - eastern academic zone
      [12.96700, 79.15800],
      [12.96705, 79.15778],
      [12.96710, 79.15755],
      [12.96715, 79.15732],
      [12.96718, 79.15710],
      // Road west through academic blocks
      [12.96720, 79.15688],
      [12.96722, 79.15665],
      [12.96725, 79.15642],
      [12.96728, 79.15620],
      [12.96730, 79.15598],
      [12.96732, 79.15575],
      [12.96738, 79.15555],
      [12.96748, 79.15538],
      [12.96758, 79.15525],
      [12.96770, 79.15515],
      [12.96782, 79.15508],
      [12.96800, 79.15500], // Library
      // Continue south to Foodys area
      [12.96790, 79.15490],
      [12.96778, 79.15478],
      [12.96768, 79.15465],
      [12.96755, 79.15452],
      [12.96742, 79.15440],
      [12.96730, 79.15428],
      [12.96720, 79.15420], // Foodys / Darling
      // Road through to GDN
      [12.96728, 79.15408],
      [12.96735, 79.15395],
      [12.96742, 79.15382],
      [12.96748, 79.15370],
      [12.96750, 79.15350], // GDN Greenos
      // Road north to Annex
      [12.96760, 79.15345],
      [12.96775, 79.15340],
      [12.96790, 79.15338],
      [12.96808, 79.15340],
      [12.96825, 79.15345],
      [12.96842, 79.15350],
      [12.96860, 79.15358],
      [12.96878, 79.15365],
      [12.96895, 79.15372],
      [12.96912, 79.15378],
      [12.96930, 79.15385],
      [12.96948, 79.15390],
      [12.96965, 79.15395],
      [12.96980, 79.15398],
      [12.97000, 79.15400], // Annex Building
    ]
  },
  delta: {
    name: 'Route Delta',
    label: 'D',
    color: '#fbbf24',
    description: 'Outdoor Stadium → Indoor → MB (Mech) → Admin',
    stops: ['outdoor', 'indoor', 'mb', 'admin'],
    path: [
      // Outdoor Stadium - southwest campus
      [12.96600, 79.15100],
      [12.96608, 79.15118],
      [12.96618, 79.15135],
      [12.96628, 79.15152],
      [12.96638, 79.15168],
      [12.96648, 79.15182],
      [12.96658, 79.15195],
      // Road northeast past Indoor Stadium
      [12.96668, 79.15210],
      [12.96678, 79.15225],
      [12.96688, 79.15238],
      [12.96700, 79.15200], // Indoor Stadium
      // Continue north on campus perimeter road
      [12.96718, 79.15268],
      [12.96730, 79.15285],
      [12.96742, 79.15302],
      [12.96755, 79.15318],
      [12.96768, 79.15335],
      [12.96780, 79.15352],
      [12.96792, 79.15370],
      [12.96805, 79.15388],
      [12.96818, 79.15408],
      [12.96832, 79.15428],
      [12.96845, 79.15448],
      [12.96858, 79.15468],
      [12.96870, 79.15488],
      [12.96882, 79.15508],
      [12.96895, 79.15530],
      [12.96908, 79.15550],
      [12.96920, 79.15565],
      [12.96932, 79.15580],
      [12.96945, 79.15598],
      [12.96950, 79.15700], // MB (Mech Block)
      // Continue northeast to Admin Block
      [12.96968, 79.15628],
      [12.96980, 79.15642],
      [12.96992, 79.15655],
      [12.97005, 79.15668],
      [12.97018, 79.15678],
      [12.97032, 79.15688],
      [12.97045, 79.15695],
      [12.97050, 79.15660], // Admin Block
    ]
  }
};

// =============================================
// SHUTTLE BUS DATA
// =============================================
export const BUSES = [
  { id: 'VIT-BUS-01', route: 'alpha',   speed: 25, eta: '4 min',    occ: 65, occupancyLabel: '65%', status: 'moving' },
  { id: 'VIT-BUS-03', route: 'alpha',   speed: 20, eta: '8 min',    occ: 45, occupancyLabel: '45%', status: 'moving' },
  { id: 'VIT-BUS-07', route: 'bravo',   speed: 22, eta: '7 min',    occ: 80, occupancyLabel: '80%', status: 'moving' },
  { id: 'VIT-BUS-09', route: 'bravo',   speed: 18, eta: '12 min',   occ: 55, occupancyLabel: '55%', status: 'moving' },
  { id: 'VIT-BUS-12', route: 'charlie', speed: 19, eta: '11 min',   occ: 42, occupancyLabel: '42%', status: 'moving' },
  { id: 'VIT-BUS-15', route: 'charlie', speed: 15, eta: '6 min',    occ: 70, occupancyLabel: '70%', status: 'moving' },
  { id: 'VIT-BUS-04', route: 'delta',   speed: 0,  eta: 'At stop',  occ: 20, occupancyLabel: '20%', status: 'stopped' },
  { id: 'VIT-BUS-18', route: 'delta',   speed: 21, eta: '9 min',    occ: 58, occupancyLabel: '58%', status: 'moving' },
];

// =============================================
// MAP TILE LAYER CONFIGS
// =============================================
export const TILE_CONFIGS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20,
    icon: 'dark_mode',
    label: 'Dark'
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    icon: 'map',
    label: 'Street'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19,
    icon: 'satellite_alt',
    label: 'Satellite'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
    icon: 'terrain',
    label: 'Terrain'
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20,
    icon: 'light_mode',
    label: 'Light'
  }
};

// Campus boundary (VIT Vellore)
export const CAMPUS_BOUNDARY = [
  [12.9740, 79.1490],
  [12.9740, 79.1640],
  [12.9645, 79.1640],
  [12.9645, 79.1490],
];
