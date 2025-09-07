import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
            Vendor Management Portal
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Manage your business efficiently
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
