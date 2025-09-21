

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products.jsx';

const ProductEdit = () => {
  const { id } = useParams(); // product id from URL
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock_quantity: '',
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getById(id);
      setProduct(data);
      setFormData({
        name: data.name || '',
        price: data.price || '',
        stock_quantity: data.stock_quantity || '',
        is_active: data.is_active,
        is_featured: data.is_featured,
      });
    } catch (err) {
      setError('Failed to fetch product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productsAPI.update(id, formData);
      navigate('/vendor/products'); // redirect back to product list
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 card">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        {/* Active / Featured */}
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <span>Active</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
            <span>Featured</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/vendor/products')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
