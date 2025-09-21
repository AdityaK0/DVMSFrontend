import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../api/products.jsx";
import ProductCard from "./ProductCard.jsx";
import { useLocation,useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"; 
import Pagination from "./Pagination.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // can be dynamic if needed

  // Separate search + filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    is_active: "true", // default active
    min_price: "",
    max_price: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

useEffect(() => {
  if (message) {
    toast.success(message);

    // 🔑 Clear the state so it doesn’t persist on reload
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [message, navigate, location]);

  // Load all products
  // const fetchProducts = async () => {
  //   try {
  //     setLoading(true);

  //     const response = await productsAPI.getVendorProducts();
  //     setProducts(response.results || response);
  //   } catch (err) {
  //     setError("Failed to fetch products");
  //     console.error("Error fetching products:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleProductActivate = (id) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, is_active: true } : p)
    );
  };

  const fetchProducts = async (page = 1) => {
  try {
    setLoading(true);
    const response = await productsAPI.getVendorProducts({ page, page_size: pageSize });
    setProducts(response.results || response);
    setCurrentPage(response.current_page || page);
    setTotalPages(response.total_pages || 1);
  } catch (err) {
    setError("Failed to fetch products");
    console.error("Error fetching products:", err);
  } finally {
    setLoading(false);
  }
};

  // 🔍 Search API call
  const handleSearch = async () => {
    if (!searchTerm.trim()) return fetchProducts();
    try {
      setLoading(true);
      const response = await productsAPI.search(searchTerm); // <- hits /products/search/
      setProducts(response.results || response);
    } catch (err) {
      setError("Failed to search products");
      console.error("Error searching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Filter API call
  // const applyFilters = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await productsAPI.filter(filters); // <- hits /products/filter/
  //     setProducts(response.results || response);
  //   } catch (err) {
  //     setError("Failed to filter products");
  //     console.error("Error filtering products:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const applyFilters = async () => {
  try {
    setLoading(true);

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );

    const response = await productsAPI.filter({ ...cleanedFilters, page: 1, page_size: pageSize });
    setProducts(response.results || response);
    setCurrentPage(response.current_page || 1);
    setTotalPages(response.total_pages || 1);
  } catch (err) {
    setError("Failed to filter products");
    console.error("Error filtering products:", err);
  } finally {
    setLoading(false);
  }
};

// const applyFilters = async () => {
//   try {
//     setLoading(true);

//     // remove empty values
//     const cleanedFilters = Object.fromEntries(
//       Object.entries(filters).filter(([_, v]) => v !== "")
//     );
//     console.log("Filters ::-> ",cleanedFilters);
    
//     const response = await productsAPI.filter(cleanedFilters);
//     setProducts(response.results || response);
//   } catch (err) {
//     setError("Failed to filter products");
//     console.error("Error filtering products:", err);
//   } finally {
//     setLoading(false);
//   }
// };


  // Categories
  const categories = ["Baggy", "Skinny", "Formal"];

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

      {/* 🔍 Search + Filters */}
      <div className="card grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Search Products
          </label>
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field flex-1"
              placeholder="Search by name or description..."
            />
            <button onClick={handleSearch} className="btn-primary ml-2">
              Search
            </button>
          </div>
        </div>

        {/* Category */}
        {/* <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div> */}

        {/* Active Status */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Status
          </label>
          <select
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
            className="input-field"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Price Min */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            value={filters.min_price}
            onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
            className="input-field"
            placeholder="1000"
          />
        </div>

        {/* Price Max */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            value={filters.max_price}
            onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            className="input-field"
            placeholder="5000"
          />
        </div>

        {/* Apply Filters */}
        <div className="flex items-end">
          <button onClick={applyFilters} className="btn-primary w-full">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No products found
          </h3>
          <p className="text-secondary-600 mb-4">
            {searchTerm || filters.category
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first product."}
          </p>
          <Link to="/vendor/products/new" className="btn-primary">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onActivate={handleProductActivate}/>
          ))}

          
        </div>
       

         <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => fetchProducts(page)}
        />

        </>
      )}
      
    </div>
    
  );


  
};

export default ProductList;

