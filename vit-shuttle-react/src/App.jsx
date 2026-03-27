import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LiveMap from './components/LiveMap';
import Schedules from './pages/Schedules';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
