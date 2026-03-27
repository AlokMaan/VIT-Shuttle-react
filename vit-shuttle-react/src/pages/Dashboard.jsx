import { Link } from 'react-router-dom';
import { BUSES, ROUTES, STOPS } from '../data/campusData';
import './Dashboard.css';

export default function Dashboard() {
  const activeBuses = BUSES.filter(b => b.status === 'moving').length;
  const avgSpeed = Math.round(BUSES.reduce((a, b) => a + b.speed, 0) / BUSES.length);
  const avgOcc = Math.round(BUSES.reduce((a, b) => a + b.occ, 0) / BUSES.length);

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="section-tag"><span className="material-symbols-outlined">monitoring</span> FLEET DASHBOARD</div>
        <h1>Fleet <span className="gradient-text">Command Center</span></h1>
        <p>Real-time overview of all campus shuttle operations, fleet status, and performance metrics.</p>
      </div>

      <div className="section-content">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card glass-card">
            <div className="card-glow cyan"></div>
            <span className="stat-icon material-symbols-outlined">directions_bus</span>
            <span className="stat-value">{BUSES.length}</span>
            <span className="stat-label">Total Fleet</span>
            <span className="stat-trend up"><span className="material-symbols-outlined">trending_up</span> All online</span>
          </div>
          <div className="stat-card glass-card">
            <div className="card-glow green"></div>
            <span className="stat-icon material-symbols-outlined" style={{color: 'var(--secondary)', background: 'rgba(0,253,135,0.08)'}}>speed</span>
            <span className="stat-value">{avgSpeed} <small>km/h</small></span>
            <span className="stat-label">Avg Speed</span>
            <span className="stat-trend up"><span className="material-symbols-outlined">trending_up</span> On track</span>
          </div>
          <div className="stat-card glass-card">
            <div className="card-glow purple"></div>
            <span className="stat-icon material-symbols-outlined" style={{color: 'var(--tertiary)', background: 'rgba(172,137,255,0.08)'}}>group</span>
            <span className="stat-value">{avgOcc}%</span>
            <span className="stat-label">Avg Occupancy</span>
          </div>
          <div className="stat-card glass-card">
            <div className="card-glow yellow"></div>
            <span className="stat-icon material-symbols-outlined" style={{color: '#fbbf24', background: 'rgba(251,191,36,0.08)'}}>location_on</span>
            <span className="stat-value">{STOPS.length}</span>
            <span className="stat-label">Active Stops</span>
          </div>
        </div>

        {/* Fleet Table */}
        <div className="glass-card" style={{marginBottom: 'var(--space-8)'}}>
          <div className="card-glow cyan"></div>
          <h3 className="card-title"><span className="material-symbols-outlined">directions_bus</span> Fleet Status</h3>
          <div className="fleet-table-wrap">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Bus ID</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Speed</th>
                  <th>ETA</th>
                  <th>Occupancy</th>
                </tr>
              </thead>
              <tbody>
                {BUSES.map(bus => {
                  const route = ROUTES[bus.route];
                  return (
                    <tr key={bus.id}>
                      <td className="fleet-table-id"><div className={`fleet-dot ${bus.status === 'moving' ? 'active' : 'idle'}`}></div>{bus.id}</td>
                      <td><span style={{color: route?.color, fontWeight: 600}}>{route?.name}</span></td>
                      <td><span className={`table-status ${bus.status}`}>{bus.status === 'moving' ? 'In Transit' : 'At Stop'}</span></td>
                      <td>{bus.speed} km/h</td>
                      <td style={{color: 'var(--secondary)', fontWeight: 600}}>{bus.eta}</td>
                      <td>
                        <div className="table-occ">
                          <div className="table-occ-bar"><div className="table-occ-fill" style={{width: `${bus.occ}%`, background: `linear-gradient(90deg, ${route?.color}, ${route?.color}88)`}}></div></div>
                          <span>{bus.occupancyLabel}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Cards */}
        <h3 className="card-title" style={{marginBottom: 'var(--space-5)'}}>
          <span className="material-symbols-outlined">route</span> Route Performance
        </h3>
        <div className="route-cards-grid">
          {Object.entries(ROUTES).map(([key, route]) => {
            const routeBuses = BUSES.filter(b => b.route === key);
            return (
              <div key={key} className="route-perf-card glass-card">
                <div className="route-perf-accent" style={{background: `linear-gradient(90deg, ${route.color}, ${route.color}88)`}}></div>
                <div className="route-perf-header">
                  <h4 style={{color: route.color}}>{route.name}</h4>
                  <span className="route-perf-buses">{routeBuses.length} buses</span>
                </div>
                <p className="route-perf-desc">{route.description}</p>
                <div className="route-perf-stops">
                  {route.stops.map((s, i) => (
                    <span key={s}>
                      {STOPS.find(st => st.id === s)?.name || s}
                      {i < route.stops.length - 1 && <span className="material-symbols-outlined" style={{fontSize: 14, color: route.color}}>chevron_right</span>}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
