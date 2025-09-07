import { useState } from 'react';
import EventForm from '../components/EventForm.jsx';
import FestivalTemplates from '../components/FestivalTemplates.jsx';

const NewEvent = () => {
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setUseTemplate(false);
  };

  if (useTemplate) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setUseTemplate(false)}
            className="text-primary-600 hover:text-primary-500 font-medium mb-4"
          >
            ← Back to custom form
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">Choose a Template</h1>
          <p className="text-secondary-600">Select a festival template to get started quickly</p>
        </div>
        <FestivalTemplates onTemplateSelect={handleTemplateSelect} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Create New Event</h1>
        <p className="text-secondary-600">Create a new event or festival</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setUseTemplate(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              !useTemplate
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
            }`}
          >
            Custom Event
          </button>
          <button
            onClick={() => setUseTemplate(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              useTemplate
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
            }`}
          >
            Use Template
          </button>
        </div>
      </div>

      <EventForm selectedTemplate={selectedTemplate} />
    </div>
  );
};

export default NewEvent;
