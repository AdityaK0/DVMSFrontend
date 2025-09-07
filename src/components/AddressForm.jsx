const AddressForm = ({ formData, errors, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-secondary-900">Business Address</h3>
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};

export default AddressForm;
