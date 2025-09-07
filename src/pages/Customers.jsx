import { useState } from 'react';
import CustomerTable from '../components/CustomerTable.jsx';
import CSVUploader from '../components/CSVUploader.jsx';

const Customers = () => {
  const [activeTab, setActiveTab] = useState('list');

  const handleUploadSuccess = () => {
    // Refresh the customer list or show success message
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900">Customers</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTab('upload')}
            className="btn-primary mr-2"
          >
            Upload CSV
          </button>
          <button className="btn-secondary">
            Add Customer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Customer List
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            CSV Upload
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' ? (
        <CustomerTable />
      ) : (
        <CSVUploader onUploadSuccess={handleUploadSuccess} />
      )}
    </div>
  );
};

export default Customers;
