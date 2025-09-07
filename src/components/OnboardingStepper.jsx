import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorStore } from '../store/vendorStore.jsx';
import BusinessInfoForm from './BusinessInfoForm.jsx';
import AddressForm from './AddressForm.jsx';
import FileUploader from './FileUploader.jsx';

const OnboardingStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    description: '',
    phone: '',
    website: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    logo: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { createVendor, isLoading } = useVendorStore();

  const steps = [
    { id: 1, title: 'Business Information', description: 'Tell us about your business' },
    { id: 2, title: 'Address', description: 'Where are you located?' },
    { id: 3, title: 'Logo', description: 'Upload your business logo' },
  ];

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required';
      if (!formData.business_type.trim()) newErrors.business_type = 'Business type is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    } else if (currentStep === 2) {
      if (!formData.street.trim()) newErrors.street = 'Street address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    try {
      await createVendor(formData);
      navigate('/vendor/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfoForm
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <AddressForm
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <FileUploader
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Welcome to Vendor Portal</h1>
        <p className="text-secondary-600">Let's set up your vendor profile</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-secondary-300 text-secondary-500'
                }`}
              >
                {step.id}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-secondary-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-secondary-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-secondary-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Profile...' : 'Complete Setup'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingStepper;
