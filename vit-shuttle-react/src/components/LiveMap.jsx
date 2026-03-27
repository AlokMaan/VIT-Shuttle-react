import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VIT_CENTER, DEFAULT_ZOOM, STOPS, ROUTES, BUSES, TILE_CONFIGS, CAMPUS_BOUNDARY } from '../data/campusData';
import './LiveMap.css';

// =============================================
// BUS ICON COMPONENT
// =============================================
function createBusIcon(color, label, angle = 0) {
  return L.divIcon({
    className: 'bus-marker-icon',
    html: `<div class="bus-marker" style="--bus-color: ${color}; transform: rotate(${angle}deg);">
      <div class="bus-marker-inner">${label}</div>
      <div class="bus-marker-ring"></div>
      <div class="bus-trail"></div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

// =============================================
// MAP CONTROLLER — Changes tile layer
// =============================================
function MapLayerController({ tileType }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }
    const cfg = TILE_CONFIGS[tileType];
    const layer = L.tileLayer(cfg.url, { maxZoom: cfg.maxZoom, attribution: cfg.attribution });
    layer.addTo(map);
    layerRef.current = layer;
  }, [tileType, map]);

  return null;
}

// =============================================
// FLY TO COMPONENT
// =============================================
function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 18, { duration: 1 });
  }, [center, zoom, map]);
  return null;
}

// =============================================
// ANIMATED BUS MARKERS — Fast road-following movement
// =============================================
function AnimatedBusMarkers({ buses, routes, selectedRoute, onBusClick }) {
  const map = useMap();
  const markersRef = useRef({});
  const stateRef = useRef({});
  const animFrameRef = useRef(null);

  useEffect(() => {
    // Initialize bus states
    buses.forEach((bus, idx) => {
      const route = routes[bus.route];
      if (!route) return;
      const startIdx = Math.floor((idx * 7) % route.path.length);
      stateRef.current[bus.id] = {
        pathProgress: startIdx,
        direction: 1,
        currentLat: route.path[startIdx][0],
        currentLng: route.path[startIdx][1],
        targetLat: route.path[startIdx][0],
        targetLng: route.path[startIdx][1],
        angle: 0,
        speed: 0.008 + Math.random() * 0.006, // Vary speeds
        bus,
        route: bus.route,
      };

      const icon = createBusIcon(route.color, route.label);
      const marker = L.marker([route.path[startIdx][0], route.path[startIdx][1]], { icon, zIndexOffset: 1000 });
      
      marker.on('click', () => onBusClick(bus));
      marker.addTo(map);
      markersRef.current[bus.id] = marker;
    });

    // Animation loop — runs at 60fps for smooth movement
    let lastTime = performance.now();
    
    const animate = (time) => {
      const delta = (time - lastTime) / 1000; // seconds
      lastTime = time;

      Object.entries(stateRef.current).forEach(([busId, state]) => {
        const route = routes[state.route];
        if (!route) return;
        const path = route.path;

        // Move along the path — FAST and smooth
        state.pathProgress += state.direction * state.speed * delta * 60;

        // Bounce at ends
        if (state.pathProgress >= path.length - 1) {
          state.pathProgress = path.length - 1;
          state.direction = -1;
        }
        if (state.pathProgress <= 0) {
          state.pathProgress = 0;
          state.direction = 1;
        }

        // Interpolate between waypoints
        const idx = Math.floor(state.pathProgress);
        const frac = state.pathProgress - idx;
        const nextIdx = Math.min(idx + 1, path.length - 1);

        const lat = path[idx][0] + (path[nextIdx][0] - path[idx][0]) * frac;
        const lng = path[idx][1] + (path[nextIdx][1] - path[idx][1]) * frac;

        // Calculate heading angle
        const dLat = path[nextIdx][0] - path[idx][0];
        const dLng = path[nextIdx][1] - path[idx][1];
        const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);

        state.currentLat = lat;
        state.currentLng = lng;
        state.angle = angle;

        // Update marker position
        const marker = markersRef.current[busId];
        if (marker) {
          marker.setLatLng([lat, lng]);
          // Update icon with rotation
          marker.setIcon(createBusIcon(route.color, route.label, angle));
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      Object.values(markersRef.current).forEach(m => map.removeLayer(m));
      markersRef.current = {};
      stateRef.current = {};
    };
  }, [buses, routes, map, onBusClick]);

  // Handle route filtering visibility
  useEffect(() => {
    Object.values(markersRef.current).forEach((marker) => {
      // Find bus ID from marker
    });
    buses.forEach(bus => {
      const marker = markersRef.current[bus.id];
      if (marker) {
        if (selectedRoute === 'all' || bus.route === selectedRoute) {
          marker.setOpacity(1);
        } else {
          marker.setOpacity(0.12);
        }
      }
    });
  }, [selectedRoute, buses]);

  return null;
}

// =============================================
// EXPORT FOR REUSE
// =============================================
// =============================================
// MAIN LIVE MAP COMPONENT
// =============================================
export default function LiveMap() {
  const [tileType, setTileType] = useState('dark');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [flyTarget, setFlyTarget] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const handleBusClick = useCallback((bus) => {
    setSelectedBus(bus);
  }, []);

  const handleStopClick = (stop) => {
    setFlyTarget({ center: [stop.lat, stop.lng], zoom: 18 });
  };

  const filteredStops = selectedRoute === 'all' 
    ? STOPS 
    : STOPS.filter(s => s.routes.includes(selectedRoute));

  return (
    <div className="map-page-wrapper">
      {/* Leaflet Map */}
      <MapContainer
        center={VIT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="main-map"
        zoomControl={true}
        attributionControl={true}
      >
        <MapLayerController tileType={tileType} />
        {flyTarget && <FlyTo center={flyTarget.center} zoom={flyTarget.zoom} />}

        {/* Campus Boundary */}
        <Polygon
          positions={CAMPUS_BOUNDARY}
          pathOptions={{
            color: '#6dddff',
            weight: 1.5,
            opacity: 0.25,
            fillColor: '#6dddff',
            fillOpacity: 0.02,
            dashArray: '8 4'
          }}
        >
          <Popup><strong>VIT Vellore Campus</strong></Popup>
        </Polygon>

        {/* Route Polylines */}
        {Object.entries(ROUTES).map(([key, route]) => (
          <Polyline
            key={key}
            positions={route.path}
            pathOptions={{
              color: route.color,
              weight: selectedRoute === 'all' || selectedRoute === key ? 4 : 1.5,
              opacity: selectedRoute === 'all' ? 0.55 : selectedRoute === key ? 0.85 : 0.08,
              dashArray: '6 4',
              smoothFactor: 1.5,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        ))}

        {/* Glow effect for highlighted route */}
        {selectedRoute !== 'all' && ROUTES[selectedRoute] && (
          <Polyline
            positions={ROUTES[selectedRoute].path}
            pathOptions={{
              color: ROUTES[selectedRoute].color,
              weight: 10,
              opacity: 0.15,
              smoothFactor: 1.5,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        {/* Stop Markers */}
        {STOPS.map(stop => {
          const isVisible = selectedRoute === 'all' || stop.routes.includes(selectedRoute);
          return (
            <CircleMarker
              key={stop.id}
              center={[stop.lat, stop.lng]}
              radius={isVisible ? 7 : 4}
              pathOptions={{
                fillColor: stop.color,
                color: stop.color,
                weight: 2,
                opacity: isVisible ? 0.9 : 0.12,
                fillOpacity: isVisible ? 0.7 : 0.08,
              }}
              eventHandlers={{
                click: () => handleStopClick(stop)
              }}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="material-symbols-outlined" style={{ color: stop.color, fontSize: 20 }}>{stop.icon}</span>
                    <strong style={{ fontSize: '0.95rem', fontFamily: 'Space Grotesk' }}>{stop.name}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: stop.color, fontWeight: 600, marginBottom: 4 }}>
                    {stop.routes.map(r => ROUTES[r]?.name).join(' • ')}
                  </div>
                  <div style={{ fontSize: '0.82rem' }}>
                    ETA: <strong>{stop.eta}</strong>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Animated Buses */}
        <AnimatedBusMarkers
          buses={BUSES}
          routes={ROUTES}
          selectedRoute={selectedRoute}
          onBusClick={handleBusClick}
        />
      </MapContainer>

      {/* Speed Control */}
      <div className="speed-control">
        <span className="material-symbols-outlined">speed</span>
        <span className="speed-label">Speed</span>
        <div className="speed-buttons">
          <button className={`speed-btn${speedMultiplier === 0.5 ? ' active' : ''}`} onClick={() => setSpeedMultiplier(0.5)}>0.5x</button>
          <button className={`speed-btn${speedMultiplier === 1 ? ' active' : ''}`} onClick={() => setSpeedMultiplier(1)}>1x</button>
          <button className={`speed-btn${speedMultiplier === 2 ? ' active' : ''}`} onClick={() => setSpeedMultiplier(2)}>2x</button>
          <button className={`speed-btn${speedMultiplier === 3 ? ' active' : ''}`} onClick={() => setSpeedMultiplier(3)}>3x</button>
        </div>
      </div>

      {/* Map Type Switcher */}
      <div className="map-type-switcher">
        <div className="switcher-label">
          <span className="material-symbols-outlined">layers</span> Map Style
        </div>
        <div className="switcher-options">
          {Object.entries(TILE_CONFIGS).map(([key, cfg]) => (
            <button
              key={key}
              className={`map-type-btn${tileType === key ? ' active' : ''}`}
              onClick={() => setTileType(key)}
            >
              <span className="material-symbols-outlined">{cfg.icon}</span>
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Route Filter */}
      <div className="route-filter">
        <div className="filter-label">
          <span className="material-symbols-outlined">filter_alt</span> Routes
        </div>
        <button className={`route-filter-btn${selectedRoute === 'all' ? ' active' : ''}`} onClick={() => setSelectedRoute('all')}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>select_all</span> All Routes
        </button>
        {Object.entries(ROUTES).map(([key, route]) => (
          <button
            key={key}
            className={`route-filter-btn${selectedRoute === key ? ' active' : ''}`}
            style={{ '--route-accent': route.color }}
            onClick={() => setSelectedRoute(key)}
          >
            <span className="route-filter-dot" style={{ background: route.color }}></span>
            {route.name}
          </button>
        ))}
      </div>

      {/* Route Info Banner */}
      {selectedRoute !== 'all' && ROUTES[selectedRoute] && (
        <div className="route-info-banner" style={{ '--banner-color': ROUTES[selectedRoute].color }}>
          <span className="material-symbols-outlined">route</span>
          <div className="route-info-text">
            <strong>{ROUTES[selectedRoute].name}</strong>
            <span>{ROUTES[selectedRoute].description}</span>
          </div>
          <button className="route-info-close" onClick={() => setSelectedRoute('all')}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`map-sidebar${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
        <div className="sidebar-content">
          {/* Live Stats Bar */}
          <div className="sidebar-live-stats">
            <div className="live-stat">
              <div className="live-stat-value">{BUSES.filter(b => b.status === 'moving').length}</div>
              <div className="live-stat-label">Active</div>
            </div>
            <div className="live-stat">
              <div className="live-stat-value">{STOPS.length}</div>
              <div className="live-stat-label">Stops</div>
            </div>
            <div className="live-stat">
              <div className="live-stat-value">{Object.keys(ROUTES).length}</div>
              <div className="live-stat-label">Routes</div>
            </div>
          </div>

          <h3 className="sidebar-title">
            <span className="material-symbols-outlined">location_on</span> Active Stops
            <span className="sidebar-count">{filteredStops.length}</span>
          </h3>
          <div className="stop-list">
            {filteredStops.map(stop => (
              <div key={stop.id} className="stop-card" onClick={() => handleStopClick(stop)}>
                <div className="stop-header">
                  <span className="stop-icon material-symbols-outlined" style={{ color: stop.color }}>{stop.icon}</span>
                  <div>
                    <span className="stop-name">{stop.name}</span>
                    <span className="stop-status active">Active</span>
                  </div>
                </div>
                <div className="stop-meta">
                  <span className="material-symbols-outlined">schedule</span>
                  ETA: <strong>{stop.eta}</strong>
                </div>
                <div className="stop-routes">
                  {stop.routes.map(r => (
                    <span key={r} className={`route-chip ${r}`}>{ROUTES[r]?.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className="sidebar-title" style={{ marginTop: '1.5rem' }}>
            <span className="material-symbols-outlined">directions_bus</span> Live Buses
            <span className="sidebar-count">{BUSES.length}</span>
          </h3>
          <div className="bus-list">
            {BUSES.map(bus => {
              const route = ROUTES[bus.route];
              return (
                <div key={bus.id} className="bus-card" onClick={() => handleBusClick(bus)}>
                  <div className="bus-header">
                    <div className={`fleet-dot ${bus.status === 'moving' ? 'active' : 'idle'}`}></div>
                    <span className="bus-id">{bus.id}</span>
                  </div>
                  <span className="bus-route" style={{ color: route?.color }}>{route?.name}</span>
                  <span className="bus-speed">{bus.speed > 0 ? `${bus.speed} km/h` : 'At stop'}</span>
                  <div className="bus-occ-mini">
                    <div className="bus-occ-bar">
                      <div className="bus-occ-fill" style={{ width: `${bus.occ}%`, background: `linear-gradient(90deg, ${route?.color}, ${route?.color}88)` }}></div>
                    </div>
                    <span>{bus.occupancyLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Bus Popup */}
      {selectedBus && (
        <div className="bus-info-popup">
          <div className="popup-close" onClick={() => setSelectedBus(null)}>
            <span className="material-symbols-outlined">close</span>
          </div>
          <div className="popup-header">
            <div className={`fleet-dot ${selectedBus.status === 'moving' ? 'active' : 'idle'}`}></div>
            <span className="popup-bus-id">{selectedBus.id}</span>
            <span className="popup-status" data-status={selectedBus.status}>
              {selectedBus.status === 'moving' ? 'In Transit' : 'At Stop'}
            </span>
          </div>
          <div className="popup-body">
            <div className="popup-row">
              <span><span className="material-symbols-outlined" style={{ fontSize: 16 }}>route</span> Route</span>
              <span style={{ color: ROUTES[selectedBus.route]?.color }}>{ROUTES[selectedBus.route]?.name}</span>
            </div>
            <div className="popup-row">
              <span><span className="material-symbols-outlined" style={{ fontSize: 16 }}>speed</span> Speed</span>
              <span>{selectedBus.speed} km/h</span>
            </div>
            <div className="popup-row">
              <span><span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span> ETA</span>
              <span className="popup-eta-value">{selectedBus.eta}</span>
            </div>
            <div className="popup-row">
              <span><span className="material-symbols-outlined" style={{ fontSize: 16 }}>group</span> Occupancy</span>
              <div className="popup-occ">
                <div className="popup-occ-bar">
                  <div className="popup-occ-fill" style={{ width: `${selectedBus.occ}%` }}></div>
                </div>
                <span>{selectedBus.occupancyLabel}</span>
              </div>
            </div>
          </div>
          <div className="popup-desc">{ROUTES[selectedBus.route]?.description}</div>
        </div>
      )}
    </div>
  );
}

// Export components for reuse
export { AnimatedBusMarkers, createBusIcon };
