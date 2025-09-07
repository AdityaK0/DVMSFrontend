import { useState } from 'react';
import { customersAPI } from '../api/customers.jsx';

const CSVUploader = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadResult(null);

      const result = await customersAPI.uploadCSV(file);
      setUploadResult(result);
      
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload CSV file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,phone\nJohn Doe,john@example.com,+1234567890\nJane Smith,jane@example.com,+0987654321';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-secondary-900 mb-2">Upload Customer CSV</h3>
        <p className="text-sm text-secondary-600">
          Upload a CSV file to import multiple customers at once.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-300 hover:border-secondary-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="text-center">
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm text-secondary-600">Uploading and processing CSV...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 text-secondary-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-secondary-600">
                  <span className="font-medium text-primary-600 hover:text-primary-500">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-secondary-500">CSV files up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Download */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={downloadTemplate}
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          Download CSV template
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadResult && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-600">
            Successfully uploaded CSV! {uploadResult.created || 0} customers imported.
          </p>
          {uploadResult.errors && uploadResult.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-yellow-600">
                {uploadResult.errors.length} rows had errors and were skipped.
              </p>
            </div>
          )}
        </div>
      )}

      {/* CSV Format Info */}
      <div className="mt-6 bg-secondary-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-secondary-900 mb-2">CSV Format Requirements:</h4>
        <ul className="text-xs text-secondary-600 space-y-1">
          <li>• First row should contain headers: name, email, phone</li>
          <li>• Each row represents one customer</li>
          <li>• Email addresses must be valid</li>
          <li>• Phone numbers are optional</li>
          <li>• Maximum file size: 10MB</li>
        </ul>
      </div>
    </div>
  );
};

export default CSVUploader;
