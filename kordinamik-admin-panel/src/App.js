import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './utils/theme';

// Auth provider
import { AuthProvider } from './contexts/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import SimpleProductForm from './pages/SimpleProductForm';
import DealerApplications from './pages/DealerApplications';
import Dealers from './pages/Dealers';
import Orders from './pages/Orders';
import WarrantyList from './pages/WarrantyList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/products" element={<ProductList />} />
              <Route path="/dashboard/products/new" element={<SimpleProductForm />} />
              <Route path="/dashboard/products/edit/:id" element={<SimpleProductForm />} />
              <Route path="/dashboard/dealer-applications" element={<DealerApplications />} />
              <Route path="/dashboard/dealers" element={<Dealers />} />
              <Route path="/dashboard/orders" element={<Orders />} />
              <Route path="/dashboard/warranty" element={<WarrantyList />} />
              </Route>
            </Route>
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;