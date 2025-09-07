import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore.jsx';

const PreferencesForm = () => {
  const { user } = useAuthStore();
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    event_reminders: true,
    order_updates: true,
    language: 'en',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load user preferences from localStorage or API
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Save preferences to localStorage (in real app, this would be an API call)
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Preferences</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Preferences */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-700">Notification Preferences</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="email_notifications" className="text-sm font-medium text-secondary-700">
                    Email Notifications
                  </label>
                  <p className="text-xs text-secondary-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  id="email_notifications"
                  name="email_notifications"
                  checked={preferences.email_notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="sms_notifications" className="text-sm font-medium text-secondary-700">
                    SMS Notifications
                  </label>
                  <p className="text-xs text-secondary-500">Receive notifications via SMS</p>
                </div>
                <input
                  type="checkbox"
                  id="sms_notifications"
                  name="sms_notifications"
                  checked={preferences.sms_notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="marketing_emails" className="text-sm font-medium text-secondary-700">
                    Marketing Emails
                  </label>
                  <p className="text-xs text-secondary-500">Receive promotional and marketing emails</p>
                </div>
                <input
                  type="checkbox"
                  id="marketing_emails"
                  name="marketing_emails"
                  checked={preferences.marketing_emails}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="event_reminders" className="text-sm font-medium text-secondary-700">
                    Event Reminders
                  </label>
                  <p className="text-xs text-secondary-500">Get reminded about upcoming events</p>
                </div>
                <input
                  type="checkbox"
                  id="event_reminders"
                  name="event_reminders"
                  checked={preferences.event_reminders}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="order_updates" className="text-sm font-medium text-secondary-700">
                    Order Updates
                  </label>
                  <p className="text-xs text-secondary-500">Receive updates about order status</p>
                </div>
                <input
                  type="checkbox"
                  id="order_updates"
                  name="order_updates"
                  checked={preferences.order_updates}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Display Preferences */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-700">Display Preferences</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-secondary-700">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={preferences.language}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-secondary-700">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={preferences.timezone}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div>
                <label htmlFor="date_format" className="block text-sm font-medium text-secondary-700">
                  Date Format
                </label>
                <select
                  id="date_format"
                  name="date_format"
                  value={preferences.date_format}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-secondary-700">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={preferences.currency}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-600">Preferences saved successfully!</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreferencesForm;
