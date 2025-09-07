const DashboardStatsCard = ({ title, value, change, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-md ${colorClasses[color]} flex items-center justify-center`}>
            <span className="text-white text-lg">{icon}</span>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-semibold text-secondary-900">{value}</p>
          {change && (
            <p className={`text-sm ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change} from last month
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCard;
