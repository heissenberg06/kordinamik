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
      const response = await authService.login(credentials);
      console.log('Login successful, full response:', response);
      
      // Get the token from the response
      let accessToken = null;
      
      // Check different possible response structures
      if (response.data?.accessToken) {
        accessToken = response.data.accessToken;
      } else if (response.data?.data?.accessToken) {
        accessToken = response.data.data.accessToken;
      } else {
        console.error('Unexpected response structure:', response);
        setError('Unexpected response from server');
        setLoading(false);
        return false;
      }
      
      // Store the token
      localStorage.setItem('accessToken', accessToken);
      
      // Decode the token and set the current admin
      try {
        const decodedToken = jwtDecode(accessToken);
        console.log('Decoded token:', decodedToken);
        
        setCurrentAdmin({
          id: decodedToken.id || decodedToken.sub,
          username: decodedToken.username || decodedToken.name,
        });
        
        setLoading(false);
        return true;
      } catch (tokenError) {
        console.error('Token decode error:', tokenError);
        setError('Error processing authentication token');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Login error in context:', err);
      setError(err.response?.data?.message || 'Login failed');
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
    localStorage.removeItem('refreshToken');
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
