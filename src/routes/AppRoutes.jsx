import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.jsx';
import { useVendorStore } from '../store/vendorStore.jsx';

// Layouts
import AuthLayout from '../layouts/AuthLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// Auth Pages
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';

// Dashboard Pages
import Onboarding from '../pages/Onboarding.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Products from '../pages/Products.jsx';
import ProductEdit from '../components/ProductEdit.jsx';
import NewProduct from '../pages/NewProduct.jsx';
import Customers from '../pages/Customers.jsx';
import Events from '../pages/Events.jsx';
import NewEvent from '../pages/NewEvent.jsx';
import Messages from '../pages/Messages.jsx';
import Analytics from '../pages/Analytics.jsx';
import Settings from '../pages/Settings.jsx';

// Components
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const AppRoutes = () => {
  const { isAuthenticated } = useAuthStore();
  const { isOnboarded } = useVendorStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/vendor" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<NewProduct />} />
        <Route path="/vendor/products/:id/edit" element={<ProductEdit />} />
        <Route path="customers" element={<Customers />} />
        <Route path="events" element={<Events />} />
        <Route path="events/new" element={<NewEvent />} />
        <Route path="messages" element={<Messages />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
