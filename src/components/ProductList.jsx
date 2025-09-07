import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../api/products.jsx';
import ProductCard from './ProductCard.jsx';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.results || response);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchProducts} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-secondary-900">Products</h1>
        <Link to="/vendor/products/new" className="btn-primary mt-4 sm:mt-0">
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-secondary-700 mb-1">
              Search Products
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Search by name or description..."
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">
              Filter by Category
            </label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No products found</h3>
          <p className="text-secondary-600 mb-4">
            {searchTerm || filterCategory 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first product.'
            }
          </p>
          <Link to="/vendor/products/new" className="btn-primary">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-600">{products.length}</p>
            <p className="text-sm text-secondary-600">Total Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.is_active).length}
            </p>
            <p className="text-sm text-secondary-600">Active Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.stock_quantity === 0).length}
            </p>
            <p className="text-sm text-secondary-600">Out of Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
