const BusinessInfoForm = ({ formData, errors, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-secondary-900">Business Information</h3>
      
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
          placeholder="Enter your business name"
        />
        {errors.business_name && (
          <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
        )}
      </div>
      <div>
        <label htmlFor="business_email" className="block text-sm font-medium text-secondary-700">
          Business Email *
        </label>
        <input
          type="text"
          id="business_email"
          name="business_email"
          value={formData.business_email}
          onChange={handleChange}
          className={`input-field mt-1 ${errors.business_email ? 'border-red-500' : ''}`}
          placeholder="Enter your business email"
        />
        {errors.business_email && (
          <p className="mt-1 text-sm text-red-600">{errors.business_email}</p>
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
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="other">Other</option>
          {/* <option value="retail">Retail Store</option>
          <option value="service">Service Provider</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option> */}
        </select>
        {errors.business_type && (
          <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>
        )}
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
          placeholder="Describe your business and what you offer"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="business_phone" className="block text-sm font-medium text-secondary-700">
          Business Phone Number *
        </label>
        <input
          type="tel"
          id="business_phone"
          name="business_phone"
          value={formData.business_phone}
          onChange={handleChange}
          className={`input-field mt-1 ${errors.business_phone ? 'border-red-500' : ''}`}
          placeholder="Enter your Business phone number"
        />
        {errors.business_phone && (
          <p className="mt-1 text-sm text-red-600">{errors.business_phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-secondary-700">
          Website (Optional)
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
  );
};

export default BusinessInfoForm;
