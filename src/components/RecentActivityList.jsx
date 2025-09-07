const RecentActivityList = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'product',
      message: 'New product "Summer Collection T-Shirt" added',
      timestamp: '2 hours ago',
      icon: '📦',
    },
    {
      id: 2,
      type: 'customer',
      message: 'Customer "John Doe" registered',
      timestamp: '4 hours ago',
      icon: '👤',
    },
    {
      id: 3,
      type: 'event',
      message: 'Event "Summer Festival 2024" created',
      timestamp: '1 day ago',
      icon: '🎪',
    },
    {
      id: 4,
      type: 'message',
      message: 'Campaign message sent to 150 customers',
      timestamp: '2 days ago',
      icon: '💬',
    },
    {
      id: 5,
      type: 'analytics',
      message: 'Monthly sales report generated',
      timestamp: '3 days ago',
      icon: '📊',
    },
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-secondary-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center">
                <span className="text-sm">{activity.icon}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-secondary-900">{activity.message}</p>
              <p className="text-xs text-secondary-500">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-secondary-200">
        <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
          View all activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivityList;
