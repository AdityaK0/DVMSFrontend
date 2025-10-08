import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products.jsx';

const ProductForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    sku: '',
    cost_price: '',
    weight: '',
    min_stock_level: '5',
    is_active: true,
    is_featured: false,
    meta_title: '',
    meta_description: '',
    uploaded_images: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productsAPI.getVendorCategories(); 
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      handleFileUpload(files);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear errors if any
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      uploaded_images: fileArray,
    }));

    // Create preview URLs
    const previewUrls = fileArray.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.uploaded_images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, uploaded_images: newImages }));
    setImagePreview(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock_quantity || formData.stock_quantity < 0) {
      newErrors.stock_quantity = 'Valid stock quantity is required';
    }
    if (!formData.sku?.trim()) newErrors.sku = 'SKU is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const productData = new FormData();
      
      // Append all product fields
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("price", parseFloat(formData.price));
      productData.append("stock_quantity", parseInt(formData.stock_quantity));
      productData.append("category", formData.category);
      productData.append("sku", formData.sku);
      productData.append("is_active", formData.is_active ? "true" : "false");
      productData.append("is_featured", formData.is_featured ? "true" : "false");
      productData.append("min_stock_level", parseInt(formData.min_stock_level));
      
      if (formData.cost_price) {
        productData.append("cost_price", parseFloat(formData.cost_price));
      }
      if (formData.weight) {
        productData.append("weight", parseFloat(formData.weight));
      }
      if (formData.meta_title) {
        productData.append("meta_title", formData.meta_title);
      }
      if (formData.meta_description) {
        productData.append("meta_description", formData.meta_description);
      }

      // Append multiple images
      formData.uploaded_images.forEach((file) => {
        productData.append("uploaded_images", file);
      });

      const result = await productsAPI.create(productData);
      
      if (result) {
        navigate('/vendor/products', { 
          state: { message: 'Product created successfully!' } 
        });
      }

    } catch (error) {
      console.error("Error creating product:", error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.sku) {
          setErrors({ sku: Array.isArray(errorData.sku) ? errorData.sku[0] : errorData.sku });
        } else if (errorData.detail) {
          setErrors({ submit: errorData.detail });
        } else {
          setErrors({ submit: "Failed to create product. Please check all fields and try again." });
        }
      } else {
        setErrors({ submit: "Failed to create product. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate profit margin for display
  const profitMargin = formData.price && formData.cost_price 
    ? (parseFloat(formData.price) - parseFloat(formData.cost_price)).toFixed(2)
    : 0;

  const profitPercentage = formData.price && formData.cost_price 
    ? (((parseFloat(formData.price) - parseFloat(formData.cost_price)) / parseFloat(formData.cost_price)) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl">📦</span>
          </div>
          {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1> */}
          <p className="text-gray-600 text-lg">Create a new product for your inventory</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Progress bar */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2"></div>

            <div className="p-8 space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter a compelling product name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.sku ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="e.g., PROD-001"
                    />
                    {errors.sku && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span> {errors.sku}
                      </p>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select category</option>
                      <option value="clothing">👕 Clothing</option>
                      <option value="electronics">📱 Electronics</option>
                      <option value="books">📚 Books</option>
                      <option value="home">🏠 Home & Garden</option>
                      <option value="sports">⚽ Sports</option>
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span> {errors.category}
                      </p>
                    )}
                  </div> */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.category ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span> {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Describe your product in detail. What makes it special?"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span> {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      step="0.01"
                      min="0"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">2</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pricing & Inventory</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span> {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cost Price (₹)
                    </label>
                    <input
                      type="number"
                      name="cost_price"
                      step="0.01"
                      min="0"
                      value={formData.cost_price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.stock_quantity ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="0"
                    />
                    {errors.stock_quantity && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span> {errors.stock_quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Minimum Stock Level
                    </label>
                    <input
                      type="number"
                      name="min_stock_level"
                      min="0"
                      value={formData.min_stock_level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="5"
                    />
                  </div>
                </div>

                {/* Profit Display */}
                {formData.price && formData.cost_price && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">💰</span> Profit Analysis
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">₹{profitMargin}</p>
                        <p className="text-sm text-gray-600">Profit Margin</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{profitPercentage}%</p>
                        <p className="text-sm text-gray-600">Profit Percentage</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{(parseFloat(formData.price || 0) * parseFloat(formData.stock_quantity || 0)).toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-600">Total Inventory Value</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-bold">3</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
                </div>

                {/* Drag & Drop Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    name="uploaded_images"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    multiple
                    accept="image/*"
                  />
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📸</span>
                    </div>
                    <div>
                      <p className="text-xl font-medium text-gray-900">
                        Drag & drop your images here
                      </p>
                      <p className="text-gray-600 mt-1">
                        or <span className="text-blue-600 font-medium">click to browse</span>
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF up to 10MB each
                    </p>
                  </div>
                </div>

                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Uploaded Images ({imagePreview.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreview.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-bold">4</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">SEO & Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Title (SEO)
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      maxLength={60}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="SEO title for search engines"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.meta_title.length}/60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Description (SEO)
                    </label>
                    <textarea
                      name="meta_description"
                      rows={3}
                      value={formData.meta_description}
                      onChange={handleChange}
                      maxLength={160}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                      placeholder="Brief description for search results"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.meta_description.length}/160 characters
                    </p>
                  </div>
                </div>

                {/* Status Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Product Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">Active Product</span>
                        <p className="text-sm text-gray-500">Product will be visible to customers</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">Featured Product</span>
                        <p className="text-sm text-gray-500">Highlight in featured sections</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">⚠</span>
                    <p className="text-red-600 font-medium">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/vendor/products')}
                  className="px-8 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600  text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-1 order-1 sm:order-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Product...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Create Product
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { productsAPI } from '../api/products.jsx';

// const ProductForm = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = !!id;

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     stock_quantity: '',
//     image_url: '',
//     is_active: true,
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isEdit) {
//       fetchProduct();
//     }
//   }, [id, isEdit]);

//   const fetchProduct = async () => {
//     try {
//       setLoading(true);
//       const product = await productsAPI.getById(id);
//       setFormData({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || '',
//         category: product.category || '',
//         stock_quantity: product.stock_quantity || '',
//         image_url: product.image_url || '',
//         is_active: product.is_active !== undefined ? product.is_active : true,
//       });
//     } catch (error) {
//       console.error('Error fetching product:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) newErrors.name = 'Product name is required';
//     if (!formData.description.trim()) newErrors.description = 'Description is required';
//     if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
//     if (!formData.category.trim()) newErrors.category = 'Category is required';
//     if (!formData.stock_quantity || formData.stock_quantity < 0) {
//       newErrors.stock_quantity = 'Valid stock quantity is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const productData = {
//         ...formData,
//         price: parseFloat(formData.price),
//         stock_quantity: parseInt(formData.stock_quantity),
//       };

//       if (isEdit) {
//         await productsAPI.update(id, productData);
//       } else {
//         await productsAPI.create(productData);
//       }

//       navigate('/vendor/products');
//     } catch (error) {
//       console.error('Error saving product:', error);
//       setErrors({ submit: 'Failed to save product. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && isEdit) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//           <p className="mt-4 text-secondary-600">Loading product...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-secondary-900">
//           {isEdit ? 'Edit Product' : 'Add New Product'}
//         </h1>
//         <p className="text-secondary-600">
//           {isEdit ? 'Update your product information' : 'Create a new product for your inventory'}
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="card">
//           <div className="space-y-6">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`input-field mt-1 ${errors.name ? 'border-red-500' : ''}`}
//                 placeholder="Enter product name"
//               />
//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-secondary-700">
//                 Description *
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 rows={4}
//                 value={formData.description}
//                 onChange={handleChange}
//                 className={`input-field mt-1 ${errors.description ? 'border-red-500' : ''}`}
//                 placeholder="Describe your product"
//               />
//               {errors.description && (
//                 <p className="mt-1 text-sm text-red-600">{errors.description}</p>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-secondary-700">
//                   Price *
//                 </label>
//                 <input
//                   type="number"
//                   id="price"
//                   name="price"
//                   step="0.01"
//                   min="0"
//                   value={formData.price}
//                   onChange={handleChange}
//                   className={`input-field mt-1 ${errors.price ? 'border-red-500' : ''}`}
//                   placeholder="0.00"
//                 />
//                 {errors.price && (
//                   <p className="mt-1 text-sm text-red-600">{errors.price}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="stock_quantity" className="block text-sm font-medium text-secondary-700">
//                   Stock Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   id="stock_quantity"
//                   name="stock_quantity"
//                   min="0"
//                   value={formData.stock_quantity}
//                   onChange={handleChange}
//                   className={`input-field mt-1 ${errors.stock_quantity ? 'border-red-500' : ''}`}
//                   placeholder="0"
//                 />
//                 {errors.stock_quantity && (
//                   <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label htmlFor="category" className="block text-sm font-medium text-secondary-700">
//                 Category *
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className={`input-field mt-1 ${errors.category ? 'border-red-500' : ''}`}
//               >
//                 <option value="">Select category</option>
//                 <option value="clothing">Clothing</option>
//                 <option value="electronics">Electronics</option>
//                 <option value="food">Food & Beverages</option>
//                 <option value="home">Home & Garden</option>
//                 <option value="sports">Sports & Outdoors</option>
//                 <option value="books">Books & Media</option>
//                 <option value="beauty">Beauty & Health</option>
//                 <option value="toys">Toys & Games</option>
//                 <option value="other">Other</option>
//               </select>
//               {errors.category && (
//                 <p className="mt-1 text-sm text-red-600">{errors.category}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="image_url" className="block text-sm font-medium text-secondary-700">
//                 Image URL
//               </label>
//               <input
//                 type="url"
//                 id="image_url"
//                 name="image_url"
//                 value={formData.image_url}
//                 onChange={handleChange}
//                 className="input-field mt-1"
//                 placeholder="https://example.com/image.jpg"
//               />
//             </div>

//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="is_active"
//                 name="is_active"
//                 checked={formData.is_active}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
//               />
//               <label htmlFor="is_active" className="ml-2 block text-sm text-secondary-700">
//                 Product is active
//               </label>
//             </div>
//           </div>
//         </div>

//         {errors.submit && (
//           <div className="bg-red-50 border border-red-200 rounded-md p-3">
//             <p className="text-sm text-red-600">{errors.submit}</p>
//           </div>
//         )}

//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => navigate('/vendor/products')}
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;
