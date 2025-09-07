import { useState, useEffect } from 'react';
import { useVendorStore } from '../store/vendorStore.jsx';
import { useAuthStore } from '../store/authStore.jsx';

const ProfileForm = () => {
  const { vendorProfile, updateVendor, isLoading } = useVendorStore();
  const { user } = useAuthStore();
  
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
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (vendorProfile) {
      setFormData({
        business_name: vendorProfile.business_name || '',
        business_type: vendorProfile.business_type || '',
        description: vendorProfile.description || '',
        phone: vendorProfile.phone || '',
        website: vendorProfile.website || '',
        street: vendorProfile.street || '',
        city: vendorProfile.city || '',
        state: vendorProfile.state || '',
        zip_code: vendorProfile.zip_code || '',
        country: vendorProfile.country || '',
      });
    }
  }, [vendorProfile]);

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

    if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required';
    if (!formData.business_type.trim()) newErrors.business_type = 'Business type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await updateVendor(vendorProfile.id, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Business Profile</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-700">Business Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-secondary-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.business_name ? 'border-red-500' : ''}`}
                  placeholder="Enter business name"
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="business_type" className="block text-sm font-medium text-secondary-700">
                  Business Type *
                </label>
                <select
                  id="business_type"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.business_type ? 'border-red-500' : ''}`}
                >
                  <option value="">Select business type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail Store</option>
                  <option value="service">Service Provider</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
                {errors.business_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700">
                Business Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your business"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-secondary-700">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-700">Address Information</h4>
            
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-secondary-700">
                Street Address *
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.street ? 'border-red-500' : ''}`}
                placeholder="Enter street address"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-secondary-700">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-secondary-700">
                  State/Province *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.state ? 'border-red-500' : ''}`}
                  placeholder="Enter state/province"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div>
                <label htmlFor="zip_code" className="block text-sm font-medium text-secondary-700">
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.zip_code ? 'border-red-500' : ''}`}
                  placeholder="Enter ZIP/postal code"
                />
                {errors.zip_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.zip_code}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-secondary-700">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.country ? 'border-red-500' : ''}`}
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IN">India</option>
                <option value="other">Other</option>
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-700">Account Information</h4>
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-secondary-700">Username:</span>
                  <p className="text-secondary-600">{user?.username}</p>
                </div>
                <div>
                  <span className="font-medium text-secondary-700">Email:</span>
                  <p className="text-secondary-600">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-600">Profile updated successfully!</p>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
