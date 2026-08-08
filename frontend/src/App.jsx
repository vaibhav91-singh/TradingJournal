import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import API_BASE_URL from './api/config';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated on initial load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/status`, { withCredentials: true });
      setIsAuthenticated(res.data.authenticated);
    } catch (err) {
      console.error('Failed to check auth status', err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-textMuted flex-col gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  // Render Dashboard if authenticated, else render Home page
  return isAuthenticated ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Home />
  );
}
