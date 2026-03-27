import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState({ type: '', message: '' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setError({ type: '', message: '' });

    const result = login(studentEmail, studentPassword);
    if (result.success) {
      navigate(result.redirect || '/');
    } else {
      setError({ type: 'student', message: result.message });
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError({ type: '', message: '' });

    const result = login(adminEmail, adminPassword);
    if (result.success) {
      navigate(result.redirect || '/admin');
    } else {
      setError({ type: 'admin', message: result.message });
    }
  };

  return (
    <div className="page-wrapper login-page">
      <div className="login-bg-effects">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
      </div>

      <div className="login-container">
        <div className="login-header fade-in">
          <div className="login-badge">
            <span className="material-symbols-outlined">person_2</span>
            Dual Portal Access
          </div>
          <h1>Welcome to <span className="gradient-text">VIT Shuttle</span></h1>
          <p>Choose your portal to continue</p>
        </div>

        <div className="login-portals">
          {/* Student Portal */}
          <div className={`portal-card glass-card ${error.type === 'student' ? 'shake' : ''}`}>
            <div className="portal-header">
              <div className="portal-icon student">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <h3>Student Portal</h3>
                <p>For VIT Students</p>
              </div>
            </div>

            {error.type === 'student' && (
              <div className="login-error small">
                <span className="material-symbols-outlined">error</span>
                {error.message}
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="student-email">Student Email</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
                    id="student-email"
                    placeholder="name@vitstudent.ac.in"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <span className="input-hint">Must end with @vitstudent.ac.in</span>
              </div>

              <div className="form-group">
                <label htmlFor="student-password">Password</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">lock</span>
                  <input
                    type="password"
                    id="student-password"
                    placeholder="••••••••"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary login-btn">
                <span className="material-symbols-outlined">login</span>
                Access Portal
              </button>
            </form>
          </div>

          {/* Admin Portal */}
          <div className={`portal-card glass-card ${error.type === 'admin' ? 'shake' : ''}`}>
            <div className="portal-header">
              <div className="portal-icon admin">
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </div>
              <div>
                <h3>Admin Portal</h3>
                <p>For Administrators</p>
              </div>
            </div>

            {error.type === 'admin' && (
              <div className="login-error small">
                <span className="material-symbols-outlined">error</span>
                {error.message}
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="admin-email">Admin Email</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
                    id="admin-email"
                    placeholder="admin@gmail.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined">lock</span>
                  <input
                    type="password"
                    id="admin-password"
                    placeholder="admin123"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <span className="input-hint">Default: admin123</span>
              </div>

              <button type="submit" className="btn-primary login-btn admin">
                <span className="material-symbols-outlined">admin_settings</span>
                Admin Access
              </button>
            </form>
          </div>
        </div>

        <div className="login-footer">
          <p>Need help? <a href="#">Contact IT Support</a></p>
          <p className="copyright">© 2025 VIT Shuttle. Secure Access Only.</p>
        </div>
      </div>
    </div>
  );
}
