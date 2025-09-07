import { useState, useEffect } from 'react';
import { messagesAPI } from '../api/messages.jsx';

const MessageHistoryTable = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('sent_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getHistory();
      setMessages(response.results || response);
    } catch (err) {
      setError('Failed to fetch message history');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const searchLower = searchTerm.toLowerCase();
    return (
      message.subject?.toLowerCase().includes(searchLower) ||
      message.message?.toLowerCase().includes(searchLower)
    );
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading message history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchMessages} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-secondary-900 mb-4 sm:mb-0">
            Message History ({messages.length})
          </h2>
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Search messages..."
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                  onClick={() => handleSort('subject')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Subject</span>
                    <span>{getSortIcon('subject')}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider cursor-pointer hover:bg-secondary-100"
                  onClick={() => handleSort('sent_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Sent</span>
                    <span>{getSortIcon('sent_at')}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {sortedMessages.map((message) => (
                <tr key={message.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-secondary-900">
                      {message.subject}
                    </div>
                    <div className="text-sm text-secondary-500 line-clamp-1">
                      {message.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">
                      {message.recipient_count || 0} recipients
                    </div>
                    <div className="text-sm text-secondary-500">
                      {message.recipient_type === 'all' ? 'All customers' : 'Selected customers'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">
                      {formatDate(message.sent_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        View
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No messages found</h3>
            <p className="text-secondary-600">
              {searchTerm 
                ? 'Try adjusting your search criteria.'
                : 'Start by sending your first campaign message.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageHistoryTable;
