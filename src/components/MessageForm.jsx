import { useState, useEffect } from 'react';
import { messagesAPI } from '../api/messages.jsx';

const MessageForm = ({ onMessageSent }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipient_type: 'all',
    recipient_ids: [],
    template_id: '',
  });
  const [templates, setTemplates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTemplates();
    fetchCustomers();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await messagesAPI.getTemplates();
      setTemplates(response.results || response);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      // This would typically come from customers API
      const mockCustomers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
      ];
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      message: template.content,
      template_id: template.id,
    }));
  };

  const handleCustomerSelect = (customerId) => {
    setFormData(prev => ({
      ...prev,
      recipient_ids: prev.recipient_ids.includes(customerId)
        ? prev.recipient_ids.filter(id => id !== customerId)
        : [...prev.recipient_ids, customerId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.recipient_type === 'selected' && formData.recipient_ids.length === 0) {
      newErrors.recipient_ids = 'Please select at least one customer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const messageData = {
        subject: formData.subject,
        message: formData.message,
        recipient_type: formData.recipient_type,
        recipient_ids: formData.recipient_type === 'selected' ? formData.recipient_ids : null,
      };

      await messagesAPI.send(messageData);
      
      if (onMessageSent) {
        onMessageSent();
      }

      // Reset form
      setFormData({
        subject: '',
        message: '',
        recipient_type: 'all',
        recipient_ids: [],
        template_id: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Send Campaign Message</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Selection */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Send to:
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recipient_type"
                  value="all"
                  checked={formData.recipient_type === 'all'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                />
                <span className="ml-2 text-sm text-secondary-700">All customers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recipient_type"
                  value="selected"
                  checked={formData.recipient_type === 'selected'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                />
                <span className="ml-2 text-sm text-secondary-700">Selected customers</span>
              </label>
            </div>
            
            {formData.recipient_type === 'selected' && (
              <div className="mt-3 max-h-32 overflow-y-auto border border-secondary-300 rounded-lg p-3">
                {customers.map(customer => (
                  <label key={customer.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={formData.recipient_ids.includes(customer.id)}
                      onChange={() => handleCustomerSelect(customer.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      {customer.name} ({customer.email})
                    </span>
                  </label>
                ))}
              </div>
            )}
            
            {errors.recipient_ids && (
              <p className="mt-1 text-sm text-red-600">{errors.recipient_ids}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-secondary-700">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`input-field mt-1 ${errors.subject ? 'border-red-500' : ''}`}
              placeholder="Enter message subject"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-secondary-700">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className={`input-field mt-1 ${errors.message ? 'border-red-500' : ''}`}
              placeholder="Enter your message"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>

      {/* Templates */}
      {templates.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Message Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <div key={template.id} className="border border-secondary-200 rounded-lg p-4">
                <h4 className="font-medium text-secondary-900 mb-2">{template.name}</h4>
                <p className="text-sm text-secondary-600 mb-2">{template.subject}</p>
                <p className="text-xs text-secondary-500 line-clamp-2">{template.content}</p>
                <button
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-500"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageForm;
