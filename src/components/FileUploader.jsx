import { useState } from 'react';

const FileUploader = ({ formData, errors, updateFormData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

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

  const handleFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    updateFormData({ logo: file });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    updateFormData({ logo: null });
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-secondary-900">Business Logo</h3>
      
      <div className="text-center">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-secondary-300 hover:border-secondary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Logo preview"
                className="mx-auto h-32 w-32 object-contain rounded-lg"
              />
              <div>
                <p className="text-sm text-secondary-600">Logo uploaded successfully</p>
                <button
                  type="button"
                  onClick={removeFile}
                  className="mt-2 text-sm text-red-600 hover:text-red-500"
                >
                  Remove logo
                </button>
              </div>
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
                <p className="text-xs text-secondary-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          )}
        </div>
        
        {errors.logo && (
          <p className="mt-2 text-sm text-red-600">{errors.logo}</p>
        )}
      </div>

      <div className="text-center text-sm text-secondary-500">
        <p>Upload your business logo to help customers recognize your brand</p>
      </div>
    </div>
  );
};

export default FileUploader;
