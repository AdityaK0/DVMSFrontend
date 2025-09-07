import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useVendorStore } from '../store/vendorStore.jsx';

const AnalyticsCharts = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const { vendorProfile, getAnalytics } = useVendorStore();

  useEffect(() => {
    if (vendorProfile?.id) {
      fetchAnalytics();
    }
  }, [vendorProfile?.id, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics(vendorProfile.id);
      setAnalytics(response);
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockAnalytics = {
    sales_over_time: [
      { date: '2024-01-01', sales: 1200, orders: 45 },
      { date: '2024-01-02', sales: 1900, orders: 67 },
      { date: '2024-01-03', sales: 3000, orders: 89 },
      { date: '2024-01-04', sales: 2800, orders: 76 },
      { date: '2024-01-05', sales: 1890, orders: 54 },
      { date: '2024-01-06', sales: 2390, orders: 78 },
      { date: '2024-01-07', sales: 3490, orders: 98 },
    ],
    product_performance: [
      { name: 'T-Shirts', sales: 4000, percentage: 40 },
      { name: 'Hoodies', sales: 3000, percentage: 30 },
      { name: 'Caps', sales: 2000, percentage: 20 },
      { name: 'Accessories', sales: 1000, percentage: 10 },
    ],
    customer_growth: [
      { month: 'Jan', customers: 120 },
      { month: 'Feb', customers: 150 },
      { month: 'Mar', customers: 180 },
      { month: 'Apr', customers: 220 },
      { month: 'May', customers: 280 },
      { month: 'Jun', customers: 320 },
    ],
    event_attendance: [
      { event: 'Summer Fest', attendance: 5000, revenue: 15000 },
      { event: 'Food Fair', attendance: 3000, revenue: 9000 },
      { event: 'Art Show', attendance: 1200, revenue: 3600 },
      { event: 'Music Night', attendance: 800, revenue: 2400 },
    ],
  };

  const data = analytics || mockAnalytics;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchAnalytics} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-secondary-900">Analytics Dashboard</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-32"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Sales Over Time */}
      <div className="card">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Sales Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.sales_over_time}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="sales"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Sales ($)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Product Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.product_performance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {data.product_performance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Customer Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.customer_growth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="New Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Event Attendance */}
      <div className="card">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Event Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.event_attendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="event" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="attendance"
                fill="#3b82f6"
                name="Attendance"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#10b981"
                name="Revenue ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">$24,500</div>
          <div className="text-sm text-secondary-600">Total Revenue</div>
          <div className="text-xs text-green-600 mt-1">+12% from last month</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">1,234</div>
          <div className="text-sm text-secondary-600">Total Orders</div>
          <div className="text-xs text-green-600 mt-1">+8% from last month</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">$19.85</div>
          <div className="text-sm text-secondary-600">Average Order Value</div>
          <div className="text-xs text-red-600 mt-1">-2% from last month</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">4.2%</div>
          <div className="text-sm text-secondary-600">Conversion Rate</div>
          <div className="text-xs text-green-600 mt-1">+0.5% from last month</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
