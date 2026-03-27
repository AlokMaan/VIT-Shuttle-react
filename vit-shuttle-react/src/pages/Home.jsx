import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { VIT_CENTER, STOPS, ROUTES, BUSES } from '../data/campusData';
import { AnimatedBusMarkers } from '../components/LiveMap';
import AnimateOnScroll from '../components/AnimateOnScroll';
import './Home.css';

// =============================================
// AI INSIGHTS GENERATOR
// =============================================
function generateAIInsight() {
  const insights = [
    { icon: 'trending_up', text: 'AI predicts +2 min delay at Main Gate in 5 min', color: '#ff716c' },
    { icon: 'wave', text: 'High demand expected at Library (85% occupancy)', color: '#ac89ff' },
    { icon: 'check_circle', text: 'Route Alpha: All buses on schedule', color: '#00fd87' },
    { icon: 'schedule', text: 'Bravo route frequency increased to 8 min', color: '#6dddff' },
    { icon: 'wb_sunny', text: 'Weather impact: 12% slowdown on outdoor routes', color: '#fbbf24' },
    { icon: 'group', text: 'Peak demand forecast: 1:30 PM - 2:30 PM', color: '#ac89ff' },
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

// =============================================
// INTERACTIVE HERO BACKGROUND (Mouse-reactive)
// =============================================
function InteractiveHeroBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Track mouse position
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Grid points for wave effect
    const gridSize = 40;
    const cols = Math.ceil(canvas.width / gridSize) + 2;
    const rows = Math.ceil(canvas.height / gridSize) + 2;

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // Draw interactive wave grid
      ctx.strokeStyle = 'rgba(109, 221, 255, 0.06)';
      ctx.lineWidth = 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = (i - 1) * gridSize;
          const baseY = (j - 1) * gridSize;

          // Mouse influence
          const dx = mouseRef.current.x - baseX;
          const dy = mouseRef.current.y - baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / 200);

          // Wave offset based on time and position
          const waveOffset = Math.sin(baseX * 0.01 + time) * 3 + Math.cos(baseY * 0.01 + time) * 3;
          const mouseOffset = influence * 15;

          const x = baseX + waveOffset * (1 + influence * 0.5);
          const y = baseY + waveOffset * (1 + influence * 0.5);

          // Draw point
          ctx.beginPath();
          ctx.arc(x, y, influence > 0.3 ? 2 : 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(109, 221, 255, ${0.1 + influence * 0.4})`;
          ctx.fill();

          // Connect nearby points
          if (i > 0) {
            const prevX = ((i - 1) - 1) * gridSize + Math.sin(((i - 1) - 1) * 0.01 + time) * 3;
            const prevY = baseY + Math.cos((j - 1) * 0.01 + time) * 3;
            const d = Math.sqrt((x - prevX) ** 2 + (y - prevY) ** 2);
            if (d < gridSize * 1.5) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(prevX, prevY);
              ctx.strokeStyle = `rgba(109, 221, 255, ${0.03 + influence * 0.1})`;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-hero-bg" />;
}

// =============================================
// PARTICLE SYSTEM (for preview map)
// =============================================
function ParticleSystem({ count = 30 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 190 : 120,
    }));

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.alpha})`;
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(109, 221, 255, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

// =============================================
// AI INSIGHTS PANEL
// =============================================
function AIInsightsPanel({ insight, onRefresh }) {
  return (
    <div className="ai-insights-panel">
      <div className="ai-header">
        <span className="material-symbols-outlined">smart_toy</span>
        <span>AI Insights</span>
        <button className="ai-refresh" onClick={onRefresh} title="Refresh">
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>
      <div className="ai-insight-card" style={{ '--insight-color': insight.color }}>
        <span className="material-symbols-outlined" style={{ color: insight.color }}>{insight.icon}</span>
        <span className="ai-insight-text">{insight.text}</span>
      </div>
      <div className="ai-status-bar">
        <div className="ai-status-indicator active"></div>
        <span>Live prediction active</span>
      </div>
    </div>
  );
}

// =============================================
// LIVE STATS COUNTER (AUTO-INCREMENT)
// =============================================
function LiveStatCounter({ target, suffix = '', interval = 2000 }) {
  const [value, setValue] = useState(() => Math.floor(target * 0.8) + Math.floor(Math.random() * target * 0.2));
  const incrementRef = useRef(null);

  useEffect(() => {
    // Periodically increment/decrement slightly
    incrementRef.current = setInterval(() => {
      setValue(prev => {
        const change = Math.random() > 0.3 ? 1 : -1;
        const newVal = prev + change;
        // Keep between 80% and 100% of target
        if (newVal < target * 0.8) return Math.min(prev + 1, target);
        if (newVal > target) return target;
        return newVal;
      });
    }, interval);

    return () => clearInterval(incrementRef.current);
  }, [target, interval]);

  return <span className="stat-value">{value}{suffix}</span>;
}

export default function Home() {
  const statsRef = useRef(null);
  const [aiInsight, setAiInsight] = useState(generateAIInsight);
  const [servedDaily, setServedDaily] = useState(1500);

  // Auto-refresh AI insight every 10 seconds
  useEffect(() => {
    const insightInterval = setInterval(() => {
      setAiInsight(generateAIInsight());
    }, 10000);
    return () => clearInterval(insightInterval);
  }, []);

  // Auto-increment served daily counter
  useEffect(() => {
    const servedInterval = setInterval(() => {
      setServedDaily(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    return () => clearInterval(servedInterval);
  }, []);

  // Animate stats counters on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-value[data-target]');
          counters.forEach(el => {
            const target = parseInt(el.dataset.target.replace(/,/g, ''));
            const isComma = el.dataset.comma === 'true';
            let cur = 0;
            const steps = 50, inc = target / steps, dt = 1600 / steps;
            const suffix = el.dataset.suffix || '';
            const timer = setInterval(() => {
              cur += inc;
              if (cur >= target) { cur = target; clearInterval(timer); }
              let v = Math.round(cur);
              el.textContent = (isComma ? v.toLocaleString() : v) + suffix;
            }, dt);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-wrapper">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-effects">
          <InteractiveHeroBackground />
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="material-symbols-outlined">auto_awesome</span>
            AI-Powered Campus Transit
          </div>
          <h1 className="hero-title">
            Navigate <span className="gradient-text">VIT Campus</span><br />
            Like Never Before
          </h1>
          <p className="hero-subtitle">
            Real-time shuttle tracking, intelligent route planning, and predictive alerts — all powered by AI. Your campus commute, reimagined.
          </p>
          <div className="hero-stats" ref={statsRef}>
            <div className="stat-item">
              <span className="stat-value" data-target="8">8</span>
              <span className="stat-label">LIVE BUSES</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value" id="served-daily">{servedDaily.toLocaleString()}</span>
              <span className="stat-label">SERVED DAILY</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value" data-target="4">4</span>
              <span className="stat-label">ROUTES</span>
            </div>
          </div>

          {/* Auto-increment served daily counter */}
          <style>{`
            @keyframes servedPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            #served-daily { animation: servedPulse 2s ease-in-out infinite; }
          `}</style>
          <div className="hero-actions">
            <Link to="/map" className="btn-primary">
              <span className="material-symbols-outlined">explore</span> Open Live Map
            </Link>
            <Link to="/schedules" className="btn-secondary">
              <span className="material-symbols-outlined">schedule</span> View Schedules
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="shuttle-card-3d">
            <div className="shuttle-card-header">
              <div className="shuttle-pulse"></div>
              <span className="shuttle-id">VIT-BUS-01</span>
              <span className="shuttle-route-tag">Route Alpha</span>
            </div>
            <div className="shuttle-card-body">
              <div className="shuttle-metric">
                <span className="metric-label">Speed</span>
                <span className="metric-value">25 <small>km/h</small></span>
              </div>
              <div className="shuttle-metric">
                <span className="metric-label">ETA Main Gate</span>
                <span className="metric-value accent">4 <small>min</small></span>
              </div>
              <div className="shuttle-metric">
                <span className="metric-label">Occupancy</span>
                <div className="occupancy-bar"><div className="occupancy-fill" style={{width:'65%'}}></div></div>
                <span className="metric-value small">65%</span>
              </div>
            </div>
            <div className="shuttle-card-footer">
              <span className="material-symbols-outlined">location_on</span> Near SJT Academic Block
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span className="material-symbols-outlined">keyboard_double_arrow_down</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <AnimateOnScroll>
          <div className="section-content">
            <div className="features-header">
              <div className="section-tag"><span className="material-symbols-outlined">bolt</span> FEATURES</div>
              <h2>Everything You Need for <span className="gradient-text">Smart Commute</span></h2>
            </div>
            <div className="features-grid">
              <Link to="/map" className="feature-card">
                <div className="feature-icon cyan"><span className="material-symbols-outlined">satellite_alt</span></div>
                <h3>Real-Time Map</h3>
                <p>Live GPS tracking on real VIT campus map with satellite, street, and dark mode views.</p>
              </Link>
              <Link to="/dashboard" className="feature-card">
                <div className="feature-icon green"><span className="material-symbols-outlined">monitoring</span></div>
                <h3>Fleet Dashboard</h3>
                <p>Complete fleet overview — speed, occupancy, ETA, and on-schedule metrics at a glance.</p>
              </Link>
              <Link to="/schedules" className="feature-card">
                <div className="feature-icon purple"><span className="material-symbols-outlined">event_note</span></div>
                <h3>Smart Schedules</h3>
                <p>All route timetables with real-time next bus countdown and frequency tracking.</p>
              </Link>
              <Link to="/alerts" className="feature-card">
                <div className="feature-icon yellow"><span className="material-symbols-outlined">notifications_active</span></div>
                <h3>Live Alerts</h3>
                <p>Instant notifications for delays, route changes, and fleet status updates.</p>
              </Link>
              <div className="feature-card">
                <div className="feature-icon cyan"><span className="material-symbols-outlined">smart_toy</span></div>
                <h3>Road-Wise Tracking</h3>
                <p>Shuttles follow actual campus roads — every turn, every block, every route mapped precisely.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon green"><span className="material-symbols-outlined">speed</span></div>
                <h3>Fast Simulation</h3>
                <p>60fps smooth animation with adjustable speed controls for instant campus overview.</p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Campus Map Preview */}
      <section className="preview-section">
        <AnimateOnScroll>
          <div className="section-content">
            <div className="preview-grid">
              <div className="glass-card preview-map-card">
              <div className="card-glow cyan"></div>
              <h3 className="card-title"><span className="material-symbols-outlined">map</span> Live AI-Powered Map</h3>
              <div className="preview-map-wrap">
                <div className="map-with-overlay">
                  <MapContainer
                    center={VIT_CENTER}
                    zoom={15}
                    className="preview-map"
                    zoomControl={false}
                    scrollWheelZoom={false}
                    dragging={true}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                    {/* Route Polylines */}
                    {Object.entries(ROUTES).map(([key, route]) => (
                      <Polyline
                        key={key}
                        positions={route.path}
                        pathOptions={{
                          color: route.color,
                          weight: 2,
                          opacity: 0.4,
                          dashArray: '6 4'
                        }}
                      />
                    ))}

                    {/* Stop Markers */}
                    {STOPS.slice(0, 8).map(stop => (
                      <CircleMarker
                        key={stop.id}
                        center={[stop.lat, stop.lng]}
                        radius={4}
                        pathOptions={{
                          fillColor: stop.color,
                          color: stop.color,
                          weight: 1,
                          opacity: 0.8,
                          fillOpacity: 0.6
                        }}
                      >
                        <Popup>
                          <div style={{ minWidth: 150, fontSize: '0.85rem' }}>
                            <strong>{stop.name}</strong><br />
                            <span style={{ color: stop.color }}>{ROUTES[stop.routes[0]]?.name}</span><br />
                            ETA: <strong>{stop.eta}</strong>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}

                    {/* Animated Buses (Limited Subset for Preview) */}
                    <AnimatedBusMarkers
                      buses={BUSES.slice(0, 3)} // Show only first 3 buses on preview
                      routes={ROUTES}
                      selectedRoute="all"
                      onBusClick={() => {}}
                    />
                  </MapContainer>

                  {/* AI Insights Overlay */}
                  <div className="ai-overlay">
                    <AIInsightsPanel
                      insight={aiInsight}
                      onRefresh={() => setAiInsight(generateAIInsight())}
                    />
                  </div>

                  {/* Particle Background */}
                  <ParticleSystem count={25} />

                  {/* Route Filter (Mini) */}
                  <div className="mini-route-filter">
                    <button className="mini-route-btn active">All</button>
                    <button className="mini-route-btn" style={{ color: '#6dddff' }}>A</button>
                    <button className="mini-route-btn" style={{ color: '#00fd87' }}>B</button>
                    <button className="mini-route-btn" style={{ color: '#ac89ff' }}>C</button>
                  </div>
                </div>
              </div>
              <Link to="/map" className="btn-ghost" style={{marginTop: 'var(--space-4)'}}>
                <span className="material-symbols-outlined">open_in_new</span> Open Full Live Map
              </Link>
            </div>

            <div className="glass-card preview-fleet-card">
              <div className="card-glow green"></div>
              <h3 className="card-title"><span className="material-symbols-outlined">shutter_speed</span> Active Fleet</h3>
              <div className="fleet-list">
                {BUSES.slice(0, 4).map(bus => {
                  const route = ROUTES[bus.route];
                  return (
                    <div key={bus.id} className="fleet-item">
                      <div className="fleet-item-header">
                        <div className={`fleet-dot ${bus.status === 'moving' ? 'active' : 'idle'}`}></div>
                        <span className="fleet-bus-id">{bus.id}</span>
                        <span className="fleet-route-chip" style={{color: route?.color, background: `${route?.color}15`}}>{route?.name}</span>
                      </div>
                      <div className="fleet-item-metrics">
                        <span className="fleet-metric accent">
                          <span className="material-symbols-outlined">schedule</span> ETA {bus.eta}
                        </span>
                        <div className="fleet-occupancy">
                          <div className="fleet-occ-bar">
                            <div className="fleet-occ-fill" style={{width: `${bus.occ}%`}}></div>
                          </div>
                          <span>{bus.occupancyLabel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link to="/dashboard" className="btn-ghost" style={{marginTop: 'var(--space-4)'}}>
                <span className="material-symbols-outlined">open_in_new</span> Open Dashboard
              </Link>
            </div>
          </div>
        </div>
        </AnimateOnScroll>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo"><span className="material-symbols-outlined">directions_bus</span><span>VIT Shuttle</span></div>
            <p className="footer-tagline">Vellore Institute of Technology</p>
            <p className="footer-desc">AI-powered campus transit for the modern student.</p>
          </div>
          <div className="footer-links-group">
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/map">Live Map</Link>
            <Link to="/schedules">Schedules</Link>
          </div>
          <div className="footer-links-group">
            <h4>Resources</h4>
            <Link to="/alerts">Alerts</Link>
            <a href="#">Privacy Policy</a>
            <a href="#">Service Status</a>
          </div>
          <div className="footer-links-group">
            <h4>Contact</h4>
            <a href="#">Contact Admin</a>
            <div className="footer-emergency">
              <span className="material-symbols-outlined">emergency_share</span>
              <div>
                <span>Emergency Hotline</span>
                <a href="tel:0416-220-2020" className="emergency-number">0416-220-2020</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 VIT Shuttle. Optimized for Vellore Campus.</p>
        </div>
      </footer>
    </div>
  );
}
