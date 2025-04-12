import { useState } from 'react';
import { AuthContext } from './AuthContext/context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? true : null;
  });

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}