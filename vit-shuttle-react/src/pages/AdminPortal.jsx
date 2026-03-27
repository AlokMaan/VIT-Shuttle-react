import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BUSES, ROUTES } from '../data/campusData';
import './AdminPortal.css';

export default function AdminPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Protect Route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-wrapper admin-portal">
      <div className="admin-header glass-card">
        <div className="admin-header-content">
          <div>
            <h1>Admin <span className="gradient-text">Console</span></h1>
            <p>Managing fleet operations for {user.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary logout-btn">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </div>

      <div className="section-content admin-grid">
        {/* Quick Actions */}
        <div className="admin-section glass-card">
          <h3 className="card-title"><span className="material-symbols-outlined">bolt</span> Quick Actions</h3>
          <div className="quick-actions-btns">
            <button className="action-btn">
              <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>add_circle</span>
              Add New Bus
            </button>
            <button className="action-btn">
              <span className="material-symbols-outlined" style={{color: 'var(--secondary)'}}>route</span>
              Modify Routes
            </button>
            <button className="action-btn">
              <span className="material-symbols-outlined" style={{color: '#fbbf24'}}>campaign</span>
              Broadcast Alert
            </button>
            <button className="action-btn">
              <span className="material-symbols-outlined" style={{color: 'var(--error)'}}>emergency</span>
              Emergency Stop
            </button>
          </div>
        </div>

        {/* Fleet Management */}
        <div className="admin-section glass-card fleet-management">
          <h3 className="card-title"><span className="material-symbols-outlined">directions_bus</span> Active Fleet Control</h3>
          <div className="fleet-admin-list">
            {BUSES.map(bus => {
              const route = ROUTES[bus.route];
              return (
                <div key={bus.id} className="fleet-admin-item">
                  <div className="fleet-admin-info">
                    <div className={`fleet-dot ${bus.status === 'moving' ? 'active' : 'idle'}`}></div>
                    <span className="bus-id">{bus.id}</span>
                    <span className="bus-route" style={{color: route?.color}}>{route?.name}</span>
                  </div>
                  <div className="fleet-admin-controls">
                    <select className="control-select" defaultValue={bus.status}>
                      <option value="moving">Active</option>
                      <option value="stopped">At Stop</option>
                      <option value="offline">Offline / Maintenance</option>
                    </select>
                    <button className="control-btn icon-only">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* System Logs */}
        <div className="admin-section glass-card sys-logs">
          <h3 className="card-title"><span className="material-symbols-outlined">terminal</span> System Logs</h3>
          <div className="log-console">
            <div className="log-entry info"><span className="time">[14:15:02]</span> System active. All routes nominal.</div>
            <div className="log-entry warn"><span className="time">[14:18:45]</span> [VIT-BUS-03] Speed detected &gt; 40km/h on internal road.</div>
            <div className="log-entry info"><span className="time">[14:22:15]</span> [Admin: {user.email}] Logged into console.</div>
            <div className="log-entry req"><span className="time">[14:25:00]</span> WebSocket connection established to fleet trackers.</div>
            <div className="cursor-blink">_</div>
          </div>
        </div>
      </div>
    </div>
  );
}
