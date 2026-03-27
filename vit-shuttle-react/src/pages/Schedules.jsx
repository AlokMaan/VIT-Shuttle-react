import { ROUTES, STOPS } from '../data/campusData';
import './Schedules.css';

const SCHEDULE_DATA = {
  alpha: [
    { time: '07:00 AM', from: 'Main Gate', to: 'Technology Tower', freq: '15 min' },
    { time: '07:30 AM', from: 'Main Gate', to: 'Technology Tower', freq: '15 min' },
    { time: '08:00 AM', from: 'Main Gate', to: 'Technology Tower', freq: '10 min' },
    { time: '08:30 AM', from: 'Technology Tower', to: 'Main Gate', freq: '10 min' },
    { time: '09:00 AM', from: 'Main Gate', to: 'Technology Tower', freq: '15 min' },
    { time: '12:00 PM', from: 'Main Gate', to: 'Technology Tower', freq: '12 min' },
    { time: '05:00 PM', from: 'Technology Tower', to: 'Main Gate', freq: '10 min' },
  ],
  bravo: [
    { time: '07:15 AM', from: "Men's Hostel Zone", to: 'Ladies Hostel', freq: '12 min' },
    { time: '08:00 AM', from: "Men's Hostel Zone", to: 'Ladies Hostel', freq: '10 min' },
    { time: '09:00 AM', from: 'Ladies Hostel', to: "Men's Hostel Zone", freq: '12 min' },
    { time: '12:30 PM', from: "Men's Hostel Zone", to: 'Ladies Hostel', freq: '15 min' },
    { time: '05:30 PM', from: 'Ladies Hostel', to: "Men's Hostel Zone", freq: '10 min' },
  ],
  charlie: [
    { time: '07:30 AM', from: 'PRP Block', to: 'Annex Building', freq: '15 min' },
    { time: '08:30 AM', from: 'PRP Block', to: 'Annex Building', freq: '12 min' },
    { time: '10:00 AM', from: 'Annex Building', to: 'PRP Block', freq: '15 min' },
    { time: '01:00 PM', from: 'PRP Block', to: 'Annex Building', freq: '12 min' },
    { time: '04:30 PM', from: 'Annex Building', to: 'PRP Block', freq: '10 min' },
  ],
  delta: [
    { time: '07:00 AM', from: 'Outdoor Stadium', to: 'Admin Block', freq: '15 min' },
    { time: '08:15 AM', from: 'Outdoor Stadium', to: 'Admin Block', freq: '12 min' },
    { time: '11:00 AM', from: 'Admin Block', to: 'Outdoor Stadium', freq: '15 min' },
    { time: '04:00 PM', from: 'Outdoor Stadium', to: 'Admin Block', freq: '10 min' },
    { time: '06:00 PM', from: 'Admin Block', to: 'Outdoor Stadium', freq: '12 min' },
  ],
};

export default function Schedules() {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="section-tag"><span className="material-symbols-outlined">event_note</span> SCHEDULES</div>
        <h1>Smart <span className="gradient-text">Route Timetables</span></h1>
        <p>Complete schedules for all VIT campus shuttle routes with frequency and timing information.</p>
      </div>

      <div className="section-content">
        <div className="schedules-grid">
          {Object.entries(ROUTES).map(([key, route]) => (
            <div key={key} className="route-card">
              <div className="route-card-accent" style={{background: `linear-gradient(90deg, ${route.color}, ${route.color}88)`}}></div>
              <div className="route-card-content">
                <div className="route-header">
                  <span className="route-name" style={{color: route.color}}>{route.name}</span>
                  <span className="route-status online"><span className="status-dot"></span> Active</span>
                </div>
                <div className="route-path-bar">
                  <span className="route-from">{route.stops[0] && STOPS.find(s => s.id === route.stops[0])?.name}</span>
                  <span className="material-symbols-outlined route-arrow" style={{color: route.color}}>arrow_forward</span>
                  <span className="route-to">{route.stops[route.stops.length-1] && STOPS.find(s => s.id === route.stops[route.stops.length-1])?.name}</span>
                </div>
                <p className="route-desc">{route.description}</p>
                <div className="schedule-table-wrap">
                  <table className="schedule-table">
                    <thead>
                      <tr><th>Time</th><th>From</th><th>To</th><th>Freq</th></tr>
                    </thead>
                    <tbody>
                      {(SCHEDULE_DATA[key] || []).map((s, i) => (
                        <tr key={i}>
                          <td className="sched-time">{s.time}</td>
                          <td>{s.from}</td>
                          <td>{s.to}</td>
                          <td className="sched-freq">Every {s.freq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
