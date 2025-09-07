import { useState } from 'react';
import MessageForm from '../components/MessageForm.jsx';
import MessageHistoryTable from '../components/MessageHistoryTable.jsx';
import TemplateLibrary from '../components/TemplateLibrary.jsx';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('compose');

  const handleMessageSent = () => {
    // Switch to history tab after sending message
    setActiveTab('history');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900">Messages</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTab('compose')}
            className="btn-primary mr-2"
          >
            Compose Message
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className="btn-secondary"
          >
            Manage Templates
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('compose')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'compose'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Compose Message
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Message History
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Template Library
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'compose' && (
        <MessageForm onMessageSent={handleMessageSent} />
      )}
      
      {activeTab === 'history' && (
        <MessageHistoryTable />
      )}
      
      {activeTab === 'templates' && (
        <TemplateLibrary />
      )}
    </div>
  );
};

export default Messages;
