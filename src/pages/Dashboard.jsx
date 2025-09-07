import { useVendorStore } from '../store/vendorStore.jsx';
import DashboardStatsCard from '../components/DashboardStatsCard.jsx';
import RecentActivityList from '../components/RecentActivityList.jsx';

const Dashboard = () => {
  const { vendorProfile } = useVendorStore();

  const stats = [
    {
      title: 'Total Products',
      value: '24',
      change: '+12%',
      icon: '📦',
      color: 'primary',
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+8%',
      icon: '👥',
      color: 'green',
    },
    {
      title: 'Events This Month',
      value: '5',
      change: '+2',
      icon: '🎪',
      color: 'yellow',
    },
    {
      title: 'Messages Sent',
      value: '456',
      change: '+15%',
      icon: '💬',
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {vendorProfile?.business_name || 'Vendor'}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivityList />
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              📦 Add New Product
            </button>
            <button className="w-full btn-secondary text-left">
              👥 Import Customers
            </button>
            <button className="w-full btn-secondary text-left">
              🎪 Create Event
            </button>
            <button className="w-full btn-secondary text-left">
              💬 Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="card">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Business Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-secondary-700 mb-2">Business Information</h4>
            <div className="space-y-2 text-sm text-secondary-600">
              <p><span className="font-medium">Name:</span> {vendorProfile?.business_name || 'Not set'}</p>
              <p><span className="font-medium">Type:</span> {vendorProfile?.business_type || 'Not set'}</p>
              <p><span className="font-medium">Phone:</span> {vendorProfile?.phone || 'Not set'}</p>
              <p><span className="font-medium">Website:</span> {vendorProfile?.website || 'Not set'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-secondary-700 mb-2">Address</h4>
            <div className="text-sm text-secondary-600">
              <p>{vendorProfile?.street || 'Not set'}</p>
              <p>{vendorProfile?.city}, {vendorProfile?.state} {vendorProfile?.zip_code}</p>
              <p>{vendorProfile?.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
