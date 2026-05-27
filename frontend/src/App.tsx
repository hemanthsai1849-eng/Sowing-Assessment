import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Dashboard from '@/pages/Dashboard';
import FallowAnalysis from '@/pages/FallowAnalysis';
import EPantaComparison from '@/pages/EPantaComparison';
import RiverBasinIntelligence from '@/pages/RiverBasinIntelligence';
import SpatialAnalysis from '@/pages/SpatialAnalysis';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import '@/styles/globals.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fallow-analysis"
            element={
              <ProtectedRoute>
                <FallowAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/epanta-comparison"
            element={
              <ProtectedRoute>
                <EPantaComparison />
              </ProtectedRoute>
            }
          />
          <Route
            path="/river-basins"
            element={
              <ProtectedRoute>
                <RiverBasinIntelligence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spatial-analysis"
            element={
              <ProtectedRoute>
                <SpatialAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
