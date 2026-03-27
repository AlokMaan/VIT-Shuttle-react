import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState('--:--:--');
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const h = String(ist.getHours()).padStart(2, '0');
      const m = String(ist.getMinutes()).padStart(2, '0');
      const s = String(ist.getSeconds()).padStart(2, '0');
      setClock(`${h}:${m}:${s}`);
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="main-nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand">
          <Logo size="medium" showText={true} />
          <span className="brand-badge">VIT</span>
        </NavLink>

        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
          <NavLink to="/" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)} end>Home</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/map" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Live Map</NavLink>
          <NavLink to="/schedules" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Schedules</NavLink>
          <NavLink to="/alerts" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Alerts</NavLink>
        </div>

        <div className="nav-actions">
          <NavLink to={user ? "/admin" : "/login"} className="nav-link admin-link" style={{display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px', fontSize: '0.85rem', fontWeight: '600'}}>
            <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>{user ? "admin_panel_settings" : "login"}</span>
            {user ? "Admin" : "Sign In"}
          </NavLink>
          <div className="ist-clock">
            <span className="clock-label">IST</span>
            <span className="clock-time">{clock}</span>
          </div>
          <NavLink to="/map" className="nav-cta">
            <span className="material-symbols-outlined">my_location</span>
            Track Shuttle
          </NavLink>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
