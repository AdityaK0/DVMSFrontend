import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../api/events.jsx';

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    expected_attendees: '',
    image_url: '',
    status: 'upcoming',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
  }, [id, isEdit]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const event = await eventsAPI.getById(id);
      setFormData({
        name: event.name || '',
        description: event.description || '',
        start_date: event.start_date ? event.start_date.split('T')[0] : '',
        end_date: event.end_date ? event.end_date.split('T')[0] : '',
        location: event.location || '',
        expected_attendees: event.expected_attendees || '',
        image_url: event.image_url || '',
        status: event.status || 'upcoming',
      });
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (formData.expected_attendees && formData.expected_attendees < 0) {
      newErrors.expected_attendees = 'Expected attendees must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const eventData = {
        ...formData,
        expected_attendees: formData.expected_attendees ? parseInt(formData.expected_attendees) : null,
      };

      if (isEdit) {
        await eventsAPI.update(id, eventData);
      } else {
        await eventsAPI.create(eventData);
      }

      navigate('/vendor/events');
    } catch (error) {
      console.error('Error saving event:', error);
      setErrors({ submit: 'Failed to save event. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">
          {isEdit ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-secondary-600">
          {isEdit ? 'Update your event information' : 'Create a new event or festival'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your event"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-secondary-700">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.start_date ? 'border-red-500' : ''}`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                )}
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-secondary-700">
                  End Date *
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.end_date ? 'border-red-500' : ''}`}
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-secondary-700">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.location ? 'border-red-500' : ''}`}
                placeholder="Enter event location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expected_attendees" className="block text-sm font-medium text-secondary-700">
                  Expected Attendees
                </label>
                <input
                  type="number"
                  id="expected_attendees"
                  name="expected_attendees"
                  min="0"
                  value={formData.expected_attendees}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.expected_attendees ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {errors.expected_attendees && (
                  <p className="mt-1 text-sm text-red-600">{errors.expected_attendees}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-secondary-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-secondary-700">
                Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="https://example.com/event-image.jpg"
              />
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/vendor/events')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
