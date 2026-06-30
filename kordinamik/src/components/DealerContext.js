import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create dealer context
const DealerContext = createContext();

export const useDealer = () => useContext(DealerContext);

export const DealerProvider = ({ children }) => {
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: fetch profile with existing token
  const fetchDealerProfile = async () => {
    const token = localStorage.getItem('dealerToken');
    if (!token) return null;

    const response = await axios.get(`${API_BASE_URL}/dealer/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data.status === 'success') {
      setDealer(response.data.data);
      return response.data.data;
    }
    return null;
  };

  // Check if dealer is logged in on component mount
  useEffect(() => {
    const checkDealerAuth = async () => {
      const token = localStorage.getItem('dealerToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        await fetchDealerProfile();
      } catch (err) {
        console.error('Error checking dealer authentication:', err);
        // Clear token if invalid
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('dealerToken');
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkDealerAuth();
  }, []);

  // Login dealer
  const login = async (credentials) => {
    try {
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/dealer/login`, credentials);
      
      if (response.data.status === 'success') {
        const { dealer, accessToken } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('dealerToken', accessToken);
        
        // Set dealer state
        setDealer(dealer);
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Dealer login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Register dealer
  const register = async (registrationData) => {
    try {
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/dealer/register`, registrationData);
      
      if (response.data.status === 'success') {
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Dealer registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Logout dealer
  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/dealer/logout`);
    } catch (err) {
      console.error('Dealer logout error:', err);
    } finally {
      // Clear token and dealer state
      localStorage.removeItem('dealerToken');
      setDealer(null);
    }
  };

  // Get auth header for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('dealerToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Context value
  const value = {
    dealer,
    loading,
    error,
    login,
    register,
    logout,
    getAuthHeader,
    fetchDealerProfile,
    isAuthenticated: !!dealer
  };

  return (
    <DealerContext.Provider value={value}>
      {children}
    </DealerContext.Provider>
  );
};

export default DealerContext;
