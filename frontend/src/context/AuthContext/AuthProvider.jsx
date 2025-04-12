import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './context';
import { API_BASE_URL } from '../../constants/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verify token with server
  const verifyToken = useCallback(async (token) => {
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await verifyToken(token);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [verifyToken]);

  const login = useCallback(async (token) => {
    try {
      const userData = await verifyToken(token);
      if (userData) {
        localStorage.setItem('token', token);
        setUser(userData);
        clearError();
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      setError('Login failed: ' + error.message);
      localStorage.removeItem('token');
    }
  }, [verifyToken, clearError]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    clearError();
  }, [clearError]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}