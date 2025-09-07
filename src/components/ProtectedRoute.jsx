import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.jsx';
import { useVendorStore } from '../store/vendorStore.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const { isOnboarded } = useVendorStore();
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/vendor/login" state={{ from: location }} replace />;
  }

  if (!isOnboarded && location.pathname !== '/vendor/onboarding') {
    // Redirect to onboarding if not onboarded
    return <Navigate to="/vendor/onboarding" replace />;
  }

  if (isOnboarded && location.pathname === '/vendor/onboarding') {
    // Redirect to dashboard if already onboarded
    return <Navigate to="/vendor/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
