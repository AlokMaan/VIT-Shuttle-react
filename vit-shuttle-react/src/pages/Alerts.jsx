import './Alerts.css';

const ALERTS = [
  { type: 'warning', icon: 'warning', title: 'Route Alpha Delay', time: '2 min ago', text: 'VIT-BUS-01 experiencing 5-minute delay near Admin Block due to road maintenance. Expected to resume normal schedule by 08:45 AM.', tags: ['Route Alpha', 'Delay', 'VIT-BUS-01'] },
  { type: 'success', icon: 'check_circle', title: 'Route Bravo Restored', time: '15 min ago', text: 'Route Bravo service fully restored. All buses are now running on schedule with normal frequency.', tags: ['Route Bravo', 'Resolved'] },
  { type: 'info', icon: 'info', title: 'New Stop: MB (Mech Block)', time: '1 hour ago', text: 'A new stop has been added at the Mechanical Engineering Block on Route Delta. Effective immediately.', tags: ['Route Delta', 'New Stop'] },
  { type: 'error', icon: 'error', title: 'VIT-BUS-04 Temporarily Offline', time: '30 min ago', text: 'VIT-BUS-04 has been pulled for scheduled maintenance. Expected return to service by 02:00 PM today.', tags: ['Route Delta', 'Maintenance'] },
  { type: 'info', icon: 'campaign', title: 'Extended Hours This Weekend', time: '3 hours ago', text: 'Shuttle services will operate extended hours (6 AM to 11 PM) this Saturday for the annual tech fest at VIT Vellore.', tags: ['All Routes', 'Weekend'] },
  { type: 'warning', icon: 'cloud', title: 'Weather Advisory', time: '4 hours ago', text: 'Heavy rain expected this afternoon. Shuttle services may experience minor delays. Outdoor Stadium stop might be temporarily closed.', tags: ['Weather', 'Advisory'] },
  { type: 'success', icon: 'speed', title: 'Fleet Upgrade Complete', time: '1 day ago', text: 'GPS tracking system upgraded to v2.5 across all buses. Expect more accurate real-time positioning and faster updates on the live map.', tags: ['System', 'Upgrade'] },
];

export default function Alerts() {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="section-tag"><span className="material-symbols-outlined">notifications_active</span> LIVE ALERTS</div>
        <h1>Campus Transit <span className="gradient-text">Updates</span></h1>
        <p>Stay informed with real-time alerts, service updates, and important notifications about VIT campus shuttle services.</p>
      </div>

      <div className="section-content">
        <div className="alerts-list">
          {ALERTS.map((alert, i) => (
            <div key={i} className={`alert-card ${alert.type}`}>
              <div className={`alert-icon-wrap ${alert.type}`}>
                <span className="material-symbols-outlined">{alert.icon}</span>
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <span className="alert-title">{alert.title}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <p className="alert-text">{alert.text}</p>
                <div className="alert-tags">
                  {alert.tags.map((tag, j) => (
                    <span key={j} className="alert-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
