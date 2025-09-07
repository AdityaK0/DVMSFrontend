const StatsCard = ({ title, value, change, changeType = 'positive', icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
  };

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-secondary-600',
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-semibold text-secondary-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeColorClasses[changeType]}`}>
              {change} from last period
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
