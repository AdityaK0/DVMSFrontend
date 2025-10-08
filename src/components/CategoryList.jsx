import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, Loader } from 'lucide-react';
import { productsAPI } from "../api/products.jsx";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newDescription, setNewDescription] = useState('');


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      

      const response = await productsAPI.getVendorCategories();
      console.log("Inside ::: ");
      
      
      const defaultCats = response.filter(cat => cat.is_default);
      const customCats = response.filter(cat => !cat.is_default);
      
      setCategories({ default: defaultCats, custom: customCats });

      setError(null);
    } catch (err) {
      setError(err.message);

      setCategories({
        default: [
          { id: 1, name: 'T-Shirts', is_default: true },
          { id: 2, name: 'Jeans', is_default: true },
          { id: 3, name: 'Jackets', is_default: true },
        ],
        custom: [
          { id: 4, name: 'Summer Collection', is_default: false },
          { id: 5, name: 'Winter Wear', is_default: false },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    if (!newDescription.trim()) return;


    try {
      const response = await productsAPI.createVendorCategories({'name':newCategoryName,'description':newDescription})

      setNewCategoryName('');
      setNewDescription('');

      setIsAddingCategory(false);
      fetchCategories();
    } catch (err) {
      alert('Error adding category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (categoryId, isDefault) => {
    if (isDefault) {
      alert('Cannot delete default categories');
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/vendor/categories/${categoryId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete category');

      fetchCategories(); // Refresh the list
    } catch (err) {
      alert('Error deleting category: ' + err.message);
    }
  };

  const handleEditCategory = (category) => {
    // Implement edit logic - could open a modal
    const newName = prompt('Enter new category name:', category.name);
    if (newName && newName !== category.name) {
      updateCategory(category.id, newName);
    }
  };

  const updateCategory = async (categoryId, newName) => {
    try {
      const response = await fetch(`/api/vendor/categories/${categoryId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error('Failed to update category');

      fetchCategories(); // Refresh the list
    } catch (err) {
      alert('Error updating category: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Categories</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your product categories and organize your inventory
          </p>
        </div>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="text-sm">Using demo data. API Error: {error}</p>
        </div>
      )}

      {/* Add Category Form */}
      {isAddingCategory && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Add New Category</h3>
          <div className="flex gap-3 flex-col">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            //   onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter category description..."
              className="flex-1 px-4 py-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategoryName('');
                setNewDescription('');
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Default Categories */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Default Categories</h3>
              <p className="text-sm text-gray-600">
                Pre-configured categories based on your business type
              </p>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.default && categories.default.length > 0 ? (
            categories.default.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                isDefault={true}
              />
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No default categories available
            </div>
          )}
        </div>
      </div>

      {/* Custom Categories */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Custom Categories</h3>
              <p className="text-sm text-gray-600">
                Categories you've created for your specific needs
              </p>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.custom && categories.custom.length > 0 ? (
            categories.custom.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                isDefault={false}
              />
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No custom categories yet. Click "Add Category" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Separate component for each category item
const CategoryItem = ({ category, onEdit, onDelete, isDefault }) => {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDefault ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
          }`}>
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">{category.name}</h4>
            {isDefault && (
              <span className="text-xs text-gray-500">Default Category</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {!isDefault && (
            <button
              onClick={() => onDelete(category.id, isDefault)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;

// import { useState } from 'react';
// import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

// // const CategoryList = ({ categoriesData }) => {
// const CategoryList = ()=>{

//     const categoriesData = [
//         {
//             id: 1,
//             name: 'Default Categories',
//             items: [
//             { id: 'email', name: 'Email Notifications' },
//             { id: 'sms', name: 'SMS Notifications' },
//             { id: 'marketing', name: 'Marketing Emails' },
//             ],
//         },
//         {
//             id: 2,
//             name: 'Custom Categories',
//             items: [
//             { id: 'language', name: 'Language' },
//             { id: 'timezone', name: 'Timezone' },
//             { id: 'date_format', name: 'Date Format' },
//             ],
//         },
//     ];
//   const [items, setItems] = useState(categoriesData);

//   const handleDelete = (categoryId, itemId) => {
//     setItems(prev =>
//       prev.map(category => 
//         category.id === categoryId 
//           ? { ...category, items: category.items.filter(item => item.id !== itemId) } 
//           : category
//       )
//     );
//   };

//   const handleEdit = (categoryId, itemId) => {
//     // logic to open modal or edit inline
//     alert(`Edit item ${itemId} in category ${categoryId}`);
//   };

//   const handleView = (categoryId, itemId) => {
//     alert(`View item ${itemId} in category ${categoryId}`);
//   };

//   return (
//     <div className="space-y-6">
//       {items.map(category => (
//         <div key={category.id} className="card p-4">
//           <h3 className="text-lg font-medium text-secondary-900 mb-4">{category.name}</h3>
//           <ul className="space-y-2">
//             {category.items.map(item => (
//               <li key={item.id} className="flex justify-between items-center border p-2 rounded-md hover:bg-gray-50">
//                 <span>{item.name}</span>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleView(category.id, item.id)}
//                     className="text-blue-500 hover:text-blue-700"
//                     title="View"
//                   >
//                     <FiEye />
//                   </button>
//                   <button
//                     onClick={() => handleEdit(category.id, item.id)}
//                     className="text-yellow-500 hover:text-yellow-700"
//                     title="Edit"
//                   >
//                     <FiEdit2 />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(category.id, item.id)}
//                     className="text-red-500 hover:text-red-700"
//                     title="Delete"
//                   >
//                     <FiTrash2 />
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };


// export default CategoryList;