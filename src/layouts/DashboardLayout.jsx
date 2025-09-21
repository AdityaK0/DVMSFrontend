import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.jsx";
import { useVendorStore } from "../store/vendorStore.jsx";
import { 
  BarChart2, 
  Package, 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Image, 
  Settings 
} from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { vendorProfile } = useVendorStore();

  // const navigation = [
  //   { name: "Dashboard", href: "/vendor/dashboard", icon: "📊" },
  //   { name: "Products", href: "/vendor/products", icon: "📦" },
  //   { name: "Customers", href: "/vendor/customers", icon: "👥" },
  //   { name: "Events", href: "/vendor/events", icon: "🎪" },
  //   { name: "Messages", href: "/vendor/messages", icon: "💬" },
  //   { name: "Analytics", href: "/vendor/analytics", icon: "📈" },
  //   { name: "Showcase", href: "/vendor/portfolio-mangement", icon: "A" },
    
  //   { name: "Settings", href: "/vendor/settings", icon: "⚙️" },

  // ];

  const navigation = [
  { name: "Dashboard", href: "/vendor/dashboard", icon: <BarChart2 size={20} /> },
  { name: "Products", href: "/vendor/products", icon: <Package size={20} /> },
  { name: "Customers", href: "/vendor/customers", icon: <Users size={20} /> },
  { name: "Events", href: "/vendor/events", icon: <Calendar size={20} /> },
  { name: "Messages", href: "/vendor/messages", icon: <MessageCircle size={20} /> },
  { name: "Analytics", href: "/vendor/analytics", icon: <TrendingUp size={20} /> },
  { name: "Showcase", href: "/vendor/portfolio-mangement", icon: <Image size={20} /> },
  { name: "Settings", href: "/vendor/settings", icon: <Settings size={20} /> },
   ];


  const handleLogout = async () => {
    await logout();
    navigate("/vendor/login");
  };

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen flex bg-secondary-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-secondary-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <span className="text-white text-xl">×</span>
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-secondary-900">
                Vendor Portal
              </h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? "bg-primary-100 text-primary-900"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  } group flex items-center px-2 py-5 text-base font-medium rounded-md`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-secondary-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-secondary-900">
                  Vendor Portal
                </h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? "bg-primary-100 text-primary-900"
                        : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            {/* <div className="flex-shrink-0 flex border-t border-secondary-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-700">
                    {user?.username}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {vendorProfile?.business_name || "Vendor"}
                  </p>
                </div>
              </div>
            </div> */}
              <div className="flex-shrink-0 flex border-t border-secondary-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                 <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                 <div className="ml-3">
                   <p className="text-sm font-medium text-secondary-700">{user?.username}</p>
                   <p className="text-xs text-secondary-500">{vendorProfile?.business_name || 'Vendor'}</p>
                </div>
                
               </div>
             </div>

             <div className="flex-shrink-0 flex border-t border-secondary-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                 <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                 <div className="ml-3">
            {/* className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200" */}

                   <p className="text-sm font-medium text-secondary-700 cursor-pointer" onClick={handleLogout}>Logout</p>
                </div>
                
               </div>
             </div>

          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile topbar */}
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-secondary-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-secondary-500 hover:text-secondary-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <span className="text-xl">☰</span>
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Logout button */}
      {/* <div className="fixed bottom-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div> */}
    </div>
  );
};

export default DashboardLayout;

