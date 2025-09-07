import { useState, useEffect } from 'react';
import { eventsAPI } from '../api/events.jsx';

const FestivalTemplates = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getTemplates();
      setTemplates(response.results || response);
    } catch (err) {
      setError('Failed to fetch templates');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const defaultTemplates = [
    {
      id: 1,
      name: 'Summer Music Festival',
      description: 'A vibrant outdoor music festival with multiple stages, food vendors, and activities.',
      category: 'Music',
      duration_days: 3,
      expected_attendees: 5000,
      features: ['Multiple stages', 'Food vendors', 'Camping area', 'VIP section'],
    },
    {
      id: 2,
      name: 'Food & Wine Festival',
      description: 'Culinary celebration featuring local chefs, wineries, and food vendors.',
      category: 'Food & Drink',
      duration_days: 2,
      expected_attendees: 2000,
      features: ['Cooking demonstrations', 'Wine tastings', 'Local vendors', 'Live music'],
    },
    {
      id: 3,
      name: 'Art & Craft Fair',
      description: 'Showcase of local artists and craftspeople with workshops and demonstrations.',
      category: 'Arts & Crafts',
      duration_days: 1,
      expected_attendees: 1000,
      features: ['Artist booths', 'Workshops', 'Live demonstrations', 'Children activities'],
    },
    {
      id: 4,
      name: 'Sports Tournament',
      description: 'Multi-sport tournament with various competitions and family activities.',
      category: 'Sports',
      duration_days: 2,
      expected_attendees: 1500,
      features: ['Multiple sports', 'Awards ceremony', 'Food vendors', 'Family zone'],
    },
    {
      id: 5,
      name: 'Cultural Heritage Festival',
      description: 'Celebration of local culture with traditional performances, food, and crafts.',
      category: 'Cultural',
      duration_days: 1,
      expected_attendees: 3000,
      features: ['Cultural performances', 'Traditional food', 'Artisan crafts', 'Educational booths'],
    },
  ];

  const displayTemplates = templates.length > 0 ? templates : defaultTemplates;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchTemplates} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Festival Templates</h2>
        <p className="text-secondary-600">Choose a template to get started with your event</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTemplates.map(template => (
          <div key={template.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-secondary-900">{template.name}</h3>
                <p className="text-sm text-primary-600 font-medium">{template.category}</p>
              </div>
              
              <p className="text-sm text-secondary-600">{template.description}</p>
              
              <div className="space-y-2 text-sm text-secondary-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{template.duration_days} day{template.duration_days > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected attendees:</span>
                  <span>{template.expected_attendees?.toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-secondary-700 mb-2">Features:</h4>
                <ul className="text-xs text-secondary-600 space-y-1">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={() => onTemplateSelect(template)}
                className="w-full btn-primary"
              >
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-secondary-600">
          Don't see what you're looking for? You can always create a custom event from scratch.
        </p>
      </div>
    </div>
  );
};

export default FestivalTemplates;
