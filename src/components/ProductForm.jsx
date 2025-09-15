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
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}/`);
      const product = await response.json();
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock_quantity: product.stock_quantity || '',
        sku: product.sku || '',
        cost_price: product.cost_price || '',
        weight: product.weight || '',
        min_stock_level: product.min_stock_level || '5',
        is_active: product.is_active !== undefined ? product.is_active : true,
        is_featured: product.is_featured !== undefined ? product.is_featured : false,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        uploaded_images: [],
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData(prev => ({
        ...prev,
        uploaded_images: Array.from(files),
      }));
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

      // const productData = new FormData();
      // productData.append("name", String(formData.name));
      // productData.append("description", String(formData.description));
      // productData.append("price", String(formData.price));
      // productData.append("cost_price", String(formData.cost_price));
      // productData.append("stock_quantity", String(formData.stock_quantity));
      // productData.append("min_stock_level", String(formData.min_stock_level));
      // productData.append("sku", String(formData.sku));

      // // booleans → string "true"/"false"
      // productData.append("is_active", formData.is_active ? "true" : "false");
      // productData.append("is_featured", formData.is_featured ? "true" : "false");

      // // category → must be ID, not name
      // productData.append("category", String(formData.category_id));

      // // multiple images
      // formData.uploaded_images.forEach((file) => {
      //   productData.append("uploaded_images", file);
      // });


      const productData = new FormData();
      
      // Append all product fields
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("price", parseFloat(formData.price));
      productData.append("stock_quantity", parseInt(formData.stock_quantity));
      productData.append("category", formData.category);
      productData.append("sku", formData.sku);
      // productData.append("is_active", formData.is_active);
      // productData.append("is_featured", formData.is_featured);
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

      let result;
      if (isEdit) {
        result = await productsAPI.update(id, productData);
      } else {
        result = await productsAPI.create(productData);
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        alert(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
        
        // Reset form for new products
        if (!isEdit) {
          setFormData({
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
        }
      }

    } catch (error) {
      console.error("Error saving product:", error);
      
      // Handle axios error responses
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.sku) {
          setErrors({ sku: Array.isArray(errorData.sku) ? errorData.sku[0] : errorData.sku });
        } else if (errorData.detail) {
          setErrors({ submit: errorData.detail });
        } else {
          setErrors({ submit: "Failed to save product. Please check all fields and try again." });
        }
      } else {
        setErrors({ submit: "Failed to save product. Please try again." });
      }
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
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.sku ? 'border-red-500' : ''}`}
                placeholder="Enter product SKU"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your product"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Pricing & Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.price ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700">
                  Cost Price
                </label>
                <input
                  type="number"
                  id="cost_price"
                  name="cost_price"
                  step="0.01"
                  min="0"
                  value={formData.cost_price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.stock_quantity ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {errors.stock_quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
                )}
              </div>

              <div>
                <label htmlFor="min_stock_level" className="block text-sm font-medium text-gray-700">
                  Min Stock Level
                </label>
                <input
                  type="number"
                  id="min_stock_level"
                  name="min_stock_level"
                  min="0"
                  value={formData.min_stock_level}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="5"
                />
              </div>
            </div>

            {/* Category & Details */}
            {/* <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div> */}

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
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>

            {/* Images */}
            <div>
              <label htmlFor="uploaded_images" className="block text-sm font-medium text-gray-700">
                Upload Images
              </label>
              <input
                type="file"
                id="uploaded_images"
                name="uploaded_images"
                onChange={handleChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                multiple
                accept="image/*"
              />
              <p className="mt-1 text-sm text-gray-500">Upload multiple images. First image will be the primary image.</p>
            </div>

            {/* SEO */}
            <div>
              <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700">
                Meta Title (SEO)
              </label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="SEO title"
              />
            </div>

            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
                Meta Description (SEO)
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                rows={2}
                value={formData.meta_description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="SEO description"
              />
            </div>

            {/* Status */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Product is active
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                  Featured product
                </label>
              </div>
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
            onClick={() => onSuccess ? onSuccess() : alert('Form cancelled')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent hover:bg-indigo-700 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
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
