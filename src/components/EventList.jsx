import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../api/events.jsx';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      setEvents(response.results || response);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchEvents} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900">Events & Festivals</h1>
        <Link to="/vendor/events/new" className="btn-primary mt-4 sm:mt-0">
          Create New Event
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-secondary-700 mb-1">
              Search Events
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Search by name or description..."
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎪</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No events found</h3>
          <p className="text-secondary-600 mb-4">
            {searchTerm || filterStatus 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first event or festival.'
            }
          </p>
          <Link to="/vendor/events/new" className="btn-primary">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 text-4xl">🎪</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium text-secondary-900 line-clamp-1">
                    {event.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                
                <p className="text-sm text-secondary-600 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-sm text-secondary-600">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    <span>Start: {formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>{event.location}</span>
                  </div>
                  {event.expected_attendees && (
                    <div className="flex items-center">
                      <span className="mr-2">👥</span>
                      <span>{event.expected_attendees} expected attendees</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Link
                    to={`/vendor/events/${event.id}/edit`}
                    className="flex-1 btn-secondary text-center text-sm"
                  >
                    Edit
                  </Link>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-600">{events.length}</p>
            <p className="text-sm text-secondary-600">Total Events</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {events.filter(e => e.status === 'upcoming').length}
            </p>
            <p className="text-sm text-secondary-600">Upcoming</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {events.filter(e => e.status === 'active').length}
            </p>
            <p className="text-sm text-secondary-600">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">
              {events.filter(e => e.status === 'completed').length}
            </p>
            <p className="text-sm text-secondary-600">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
