import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Student Portal: any email ending with @vitstudent.ac.in
    if (email.endsWith('@vitstudent.ac.in')) {
      setUser({ email, role: 'student' });
      return { success: true, redirect: '/' };
    }

    // Admin Portal: fixed credentials
    if (email === 'admin@gmail.com' && password === 'admin123') {
      setUser({ email, role: 'admin' });
      return { success: true, redirect: '/admin' };
    }

    // Invalid credentials
    if (email.endsWith('@vit.ac.in') || email.endsWith('@vitstudent.ac.in')) {
      return { success: false, message: 'Invalid password. For student accounts, use your VIT student email. For admin, use the provided credentials.' };
    }

    return { success: false, message: 'Access denied. Please use a valid VIT email address or admin credentials.' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
