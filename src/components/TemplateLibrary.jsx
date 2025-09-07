import { useState, useEffect } from 'react';
import { messagesAPI } from '../api/messages.jsx';

const TemplateLibrary = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getTemplates();
      setTemplates(response.results || response);
    } catch (err) {
      setError('Failed to fetch templates');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await messagesAPI.deleteTemplate(templateId);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-secondary-900">Template Library</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          Create New Template
        </button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No templates found</h3>
          <p className="text-secondary-600 mb-4">
            Create your first message template to get started.
          </p>
          <button onClick={() => setShowCreateForm(true)} className="btn-primary">
            Create Your First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div key={template.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-secondary-900">{template.name}</h3>
                  <p className="text-sm text-primary-600 font-medium">{template.category}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-secondary-700 mb-1">Subject:</h4>
                  <p className="text-sm text-secondary-600">{template.subject}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-secondary-700 mb-1">Content:</h4>
                  <p className="text-sm text-secondary-600 line-clamp-3">{template.content}</p>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-secondary-200">
                  <span className="text-xs text-secondary-500">
                    Created {new Date(template.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTemplate(template)}
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Template Form */}
      {(showCreateForm || editingTemplate) && (
        <TemplateForm
          template={editingTemplate}
          onClose={() => {
            setShowCreateForm(false);
            setEditingTemplate(null);
          }}
          onSave={(template) => {
            if (editingTemplate) {
              setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
            } else {
              setTemplates(prev => [...prev, template]);
            }
            setShowCreateForm(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
};

const TemplateForm = ({ template, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    category: template?.category || '',
    subject: template?.subject || '',
    content: template?.content || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Template name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      let savedTemplate;
      
      if (template) {
        savedTemplate = await messagesAPI.updateTemplate(template.id, formData);
      } else {
        savedTemplate = await messagesAPI.createTemplate(formData);
      }
      
      onSave(savedTemplate);
    } catch (error) {
      console.error('Error saving template:', error);
      setErrors({ submit: 'Failed to save template. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-secondary-900">
              {template ? 'Edit Template' : 'Create New Template'}
            </h3>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                Template Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter template name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-secondary-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select category</option>
                <option value="promotional">Promotional</option>
                <option value="event">Event</option>
                <option value="newsletter">Newsletter</option>
                <option value="announcement">Announcement</option>
                <option value="welcome">Welcome</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

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
                placeholder="Enter email subject"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-secondary-700">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.content ? 'border-red-500' : ''}`}
                placeholder="Enter email content"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;
