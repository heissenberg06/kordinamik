import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { jwtDecode } from 'jwt-decode';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we have a token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          // Decode token to get admin info
          const decodedToken = jwtDecode(token);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('accessToken');
            setCurrentAdmin(null);
          } else {
            // Token is valid
            setCurrentAdmin({
              id: decodedToken.id,
              username: decodedToken.username,
            });
          }
        } catch (err) {
          console.error('Error decoding token:', err);
          localStorage.removeItem('accessToken');
          setCurrentAdmin(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // authService.login returns response.data: { status, data: { admin, accessToken } }
      const response = await authService.login(credentials);
      const accessToken = response.data?.accessToken;

      if (!accessToken) {
        setError('Sunucudan geçersiz yanıt alındı');
        setLoading(false);
        return false;
      }

      localStorage.setItem('accessToken', accessToken);

      const decodedToken = jwtDecode(accessToken);
      setCurrentAdmin({
        id: decodedToken.id,
        username: decodedToken.username,
      });

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    // Clear storage and state
    localStorage.removeItem('accessToken');
    setCurrentAdmin(null);
    setLoading(false);
  };

  // Context value
  const value = {
    currentAdmin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
