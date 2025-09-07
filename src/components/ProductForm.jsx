import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../api/products.jsx';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    image_url: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productsAPI.getById(id);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock_quantity: product.stock_quantity || '',
        image_url: product.image_url || '',
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.stock_quantity || formData.stock_quantity < 0) {
      newErrors.stock_quantity = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      if (isEdit) {
        await productsAPI.update(id, productData);
      } else {
        await productsAPI.create(productData);
      }

      navigate('/vendor/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: 'Failed to save product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-secondary-600">
          {isEdit ? 'Update your product information' : 'Create a new product for your inventory'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your product"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-secondary-700">
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.price ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-secondary-700">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className={`input-field mt-1 ${errors.stock_quantity ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {errors.stock_quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-secondary-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input-field mt-1 ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select category</option>
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="food">Food & Beverages</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="books">Books & Media</option>
                <option value="beauty">Beauty & Health</option>
                <option value="toys">Toys & Games</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-secondary-700">
                Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-secondary-700">
                Product is active
              </label>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/vendor/products')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
