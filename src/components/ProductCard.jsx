import { Link } from 'react-router-dom';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    price,
    stock_quantity,
    vendor_name,
    images = [],
    is_in_stock,
    is_featured,
    created_at,
    is_active = true,
    sku,
    category,
    is_low_stock = false,
    cost_price,
    description,
    updated_at
  } = product;

  // Check if stock is low (less than or equal to 5)
  const isLowStock = stock_quantity <= 5 && stock_quantity > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Handle the actual API response format - images is an array of URLs
  const allImages = images.filter(img => img && img.trim() !== '');

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your delete logic here
    console.log('Delete product:', id);
  };

  return (
    <Link
      to={`/vendor/products/${id}/edit`}
      className={`
        block relative overflow-hidden rounded-2xl transition-all duration-300 group cursor-pointer
        ${is_active 
          ? 'bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-gray-100' 
          : 'bg-gray-50 shadow-md opacity-75 border border-gray-200 cursor-not-allowed'
        }
      `}
      onClick={!is_active ? (e) => e.preventDefault() : undefined}
    >
      {/* Inactive Overlay */}
      {!is_active && (
        <div className="absolute inset-0 bg-gray-900/20 z-10 flex items-center justify-center">
          <div className="bg-gray-800/90 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
            Product Inactive
          </div>
        </div>
      )}

      {/* Featured Badge */}
      {is_featured && is_active && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ FEATURED
          </div>
        </div>
      )}

      {/* Product Image Section - Better aspect ratio and display */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[currentImageIndex]}
              alt={`${name} - Image ${currentImageIndex + 1}`}
              className={`
                w-full h-full object-contain bg-white transition-all duration-500
                ${is_active ? 'group-hover:scale-105' : 'grayscale'}
              `}
              style={{
                objectFit: 'contain',
                objectPosition: 'center'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback for broken images */}
            <div className={`
              hidden w-full h-full flex-col items-center justify-center
              ${is_active ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gray-200'}
            `}>
              <div className={`text-4xl mb-2 ${is_active ? '' : 'grayscale'}`}>📦</div>
              <span className="text-gray-500 text-sm font-medium">Image not available</span>
            </div>
            
            {/* Carousel Controls */}
            {allImages.length > 1 && is_active && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm z-10"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm z-10"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`
                        w-1.5 h-1.5 rounded-full transition-all duration-200
                        ${index === currentImageIndex 
                          ? 'bg-white shadow-lg' 
                          : 'bg-white/50 hover:bg-white/75'
                        }
                      `}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Image count badge */}
            {allImages.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {currentImageIndex + 1}/{allImages.length}
              </div>
            )}
          </>
        ) : (
          <div className={`
            w-full h-full flex flex-col items-center justify-center
            ${is_active ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gray-200'}
          `}>
            <div className={`text-4xl mb-2 ${is_active ? '' : 'grayscale'}`}>📦</div>
            <span className="text-gray-500 text-sm font-medium">No Image Available</span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 space-y-3">
        {/* Product Name & Date */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`
              text-lg font-bold line-clamp-2 leading-tight flex-1
              ${is_active ? 'text-gray-900' : 'text-gray-600'}
            `}>
              {name}
            </h3>
            {created_at && (
              <span className={`
                px-2 py-1 bg-gray-100 rounded-md text-xs whitespace-nowrap
                ${is_active ? 'text-gray-600' : 'text-gray-500'}
              `}>
                {formatDate(created_at)}
              </span>
            )}
          </div>
        </div>

        {/* Vendor Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {vendor_name?.charAt(0)?.toUpperCase() || 'V'}
              </span>
            </div>
            <p className={`text-sm font-medium truncate ${is_active ? 'text-gray-600' : 'text-gray-500'}`}>
              {vendor_name || 'Unknown Vendor'}
            </p>
          </div>
        </div>

        {/* Price & Stock Status */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1">
              <span className="text-sm text-gray-500">₹</span>
              <span className={`
                text-xl font-bold
                ${is_active ? 'text-blue-600' : 'text-gray-500'}
              `}>
                {parseFloat(price)?.toLocaleString('en-IN')}
              </span>
            </div>
            {!is_active && (
              <span className="text-xs text-red-500 mt-1">Inactive Product</span>
            )}
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            <span className={`
              px-2 py-1 rounded-full text-xs font-semibold
              ${!is_in_stock 
                ? 'bg-red-100 text-red-700'
                : (isLowStock 
                    ? 'bg-yellow-100 text-yellow-700'
                    : (is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')
                  )
              }
            `}>
              {!is_in_stock 
                ? '✗ Out of Stock' 
                : (isLowStock ? '⚠ Low Stock' : '✓ In Stock')
              }
            </span>
            <span className={`text-xs ${is_active ? 'text-gray-500' : 'text-gray-400'}`}>
              Stock: {stock_quantity}
            </span>
          </div>
        </div>

        {/* Delete Button - Positioned at bottom right */}
        <div className="flex justify-end pt-2">
          <button 
            onClick={handleDelete}
            className={`
              px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-white
              ${is_active
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25'
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
            disabled={!is_active}
          >
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </span>
          </button>
        </div>
      </div>

      {/* Subtle glow effect for active cards */}
      {is_active && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;

// import { Link } from 'react-router-dom';
// import { useState } from 'react';

// const ProductCard = ({ product }) => {
//   const {
//     id,
//     name,
//     price,
//     stock_quantity,
//     vendor_name, // Direct from API response
//     images = [], // Array of image URLs from Django
//     is_in_stock,
//     is_featured,
//     created_at,
//     // Optional fields that might be added later
//     is_active = true,
//     sku,
//     category,
//     is_low_stock = false,
//     cost_price,
//     description,
//     updated_at
//   } = product;

//   // Check if stock is low (less than or equal to 5)
//   const isLowStock = stock_quantity <= 5 && stock_quantity > 0;

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
//   // Handle the actual API response format - images is an array of URLs
//   const allImages = images.filter(img => img && img.trim() !== '');

//   // Format date for display
//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return '';
//     }
//   };

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => 
//       prev === allImages.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => 
//       prev === 0 ? allImages.length - 1 : prev - 1
//     );
//   };

//   return (
//     <div 
//       className={`
//         relative overflow-hidden rounded-2xl transition-all duration-300 group
//         ${is_active 
//           ? 'bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-gray-100' 
//           : 'bg-gray-50 shadow-md opacity-75 border border-gray-200'
//         }
//       `}
//     >
//       {/* Inactive Overlay */}
//       {!is_active && (
//         <div className="absolute inset-0 bg-gray-900/20 z-10 flex items-center justify-center">
//           <div className="bg-gray-800/90 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
//             Product Inactive
//           </div>
//         </div>
//       )}

//       {/* Featured Badge */}
//       {is_featured && is_active && (
//         <div className="absolute top-4 left-4 z-20">
//           <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
//             ⭐ FEATURED
//           </div>
//         </div>
//       )}

//       {/* Product Image Carousel */}
//       <div className="relative aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-50 to-gray-100">
//         {allImages.length > 0 ? (
//           <>
//             <img
//               src={allImages[currentImageIndex]}
//               alt={`${name} - Image ${currentImageIndex + 1}`}
//               className={`
//                 w-full h-56 object-cover transition-all duration-500
//                 ${is_active ? 'group-hover:scale-105' : 'grayscale'}
//               `}
//               onError={(e) => {
//                 e.target.style.display = 'none';
//                 e.target.nextElementSibling.style.display = 'flex';
//               }}
//             />
//             {/* Fallback for broken images */}
//             <div className={`
//               hidden w-full h-56 rounded-t-2xl flex-col items-center justify-center
//               ${is_active ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gray-200'}
//             `}>
//               <div className={`text-6xl mb-2 ${is_active ? '' : 'grayscale'}`}>📦</div>
//               <span className="text-gray-500 text-sm font-medium">Image not available</span>
//             </div>
            
//             {/* Carousel Controls */}
//             {allImages.length > 1 && is_active && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
                
//                 {/* Image Indicators */}
//                 <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
//                   {allImages.map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentImageIndex(index)}
//                       className={`
//                         w-2 h-2 rounded-full transition-all duration-200
//                         ${index === currentImageIndex 
//                           ? 'bg-white shadow-lg' 
//                           : 'bg-white/50 hover:bg-white/75'
//                         }
//                       `}
//                     />
//                   ))}
//                 </div>
//               </>
//             )}
//           </>
//         ) : (
//           <div className={`
//             w-full h-56 rounded-t-2xl flex flex-col items-center justify-center
//             ${is_active ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gray-200'}
//           `}>
//             <div className={`text-6xl mb-2 ${is_active ? '' : 'grayscale'}`}>📦</div>
//             <span className="text-gray-500 text-sm font-medium">No Image Available</span>
//           </div>
//         )}
//       </div>

//       {/* Product Content */}
//       <div className="p-6 space-y-4">
//         {/* Product Name & Vendor */}
//         <div className="space-y-2">
//           <div className="flex items-start justify-between">
//             <h3 className={`
//               text-lg font-bold line-clamp-2 leading-tight flex-1
//               ${is_active ? 'text-gray-900' : 'text-gray-600'}
//             `}>
//               {name}
//             </h3>
//             {created_at && (
//               <span className={`
//                 ml-2 px-2 py-1 bg-gray-100 rounded text-xs
//                 ${is_active ? 'text-gray-600' : 'text-gray-500'}
//               `}>
//                 {formatDate(created_at)}
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">
//                   {vendor_name?.charAt(0)?.toUpperCase() || 'V'}
//                 </span>
//               </div>
//               <p className={`text-sm font-medium truncate ${is_active ? 'text-gray-600' : 'text-gray-500'}`}>
//                 {vendor_name || 'Unknown Vendor'}
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-1">
//               {allImages.length > 0 && (
//                 <span className={`
//                   px-2 py-1 rounded-full text-xs font-medium
//                   ${is_active 
//                     ? 'bg-blue-100 text-blue-700' 
//                     : 'bg-gray-100 text-gray-500'
//                   }
//                 `}>
//                   📸 {allImages.length}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Price & Stock Status */}
//         <div className="flex items-center justify-between">
//           <div className="flex flex-col">
//             <div className="flex items-baseline space-x-1">
//               <span className="text-sm text-gray-500">₹</span>
//               <span className={`
//                 text-2xl font-bold
//                 ${is_active ? 'text-indigo-600' : 'text-gray-500'}
//               `}>
//                 {parseFloat(price)?.toLocaleString('en-IN')}
//               </span>
//             </div>
//             {!is_active && (
//               <span className="text-xs text-red-500 mt-1">Inactive Product</span>
//             )}
//           </div>
          
//           <div className="flex flex-col items-end space-y-1">
//             <span className={`
//               px-3 py-1 rounded-full text-xs font-semibold
//               ${!is_in_stock 
//                 ? 'bg-red-100 text-red-700'
//                 : (isLowStock 
//                     ? 'bg-yellow-100 text-yellow-700'
//                     : (is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')
//                   )
//               }
//             `}>
//               {!is_in_stock 
//                 ? '✗ Out of Stock' 
//                 : (isLowStock ? '⚠ Low Stock' : '✓ In Stock')
//               }
//             </span>
//             <span className={`text-xs ${is_active ? 'text-gray-500' : 'text-gray-400'}`}>
//               Stock: {stock_quantity}
//             </span>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-3 pt-2">
//           <Link
//             to={`/vendor/products/${id}/edit`}
//             className={`
//               flex-1 text-center py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
//               ${is_active
//                 ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md'
//                 : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//               }
//             `}
//             onClick={!is_active ? (e) => e.preventDefault() : undefined}
//           >
//             <span className="flex items-center justify-center space-x-1">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//               <span>Edit</span>
//             </span>
//           </Link>
          
//           <button 
//             className={`
//               flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 text-white
//               ${is_active
//                 ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25'
//                 : 'bg-gray-400 cursor-not-allowed'
//               }
//             `}
//             disabled={!is_active}
//           >
//             <span className="flex items-center justify-center space-x-1">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>
//               <span>Delete</span>
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Subtle glow effect for active cards */}
//       {is_active && (
//         <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//           <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductCard;

// import { Link } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   const {
//     id,
//     name,
//     price,
//     stock_quantity,
//     vendor_name,
//     primary_image,
//     is_in_stock,
//     is_featured,
//   } = product;

//   return (
//     <div className="card hover:shadow-lg transition-shadow duration-200">
//       {/* Product Image */}
//       <div className="aspect-w-16 aspect-h-9 mb-4">
//         {primary_image ? (
//           <img
//             src={primary_image}
//             alt={name}
//             className="w-full h-48 object-cover rounded-lg"
//           />
//         ) : (
//           <div className="w-full h-48 bg-secondary-200 rounded-lg flex items-center justify-center">
//             <span className="text-secondary-500 text-4xl">📦</span>
//           </div>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="space-y-3">
//         <div>
//           <h3 className="text-lg font-medium text-secondary-900 line-clamp-1">
//             {name}
//           </h3>
//           <p className="text-sm text-secondary-600 line-clamp-1">
//             Sold by: {vendor_name}
//           </p>
//         </div>

//         <div className="flex items-center justify-between">
//           <span className="text-2xl font-bold text-primary-600">
//             ₹{price}
//           </span>
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium ${
//               is_in_stock
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-red-100 text-red-800'
//             }`}
//           >
//             {is_in_stock ? 'In Stock' : 'Out of Stock'}
//           </span>
//         </div>

//         <div className="flex items-center justify-between text-sm text-secondary-600">
//           <span>Stock: {stock_quantity}</span>
//           {is_featured && (
//             <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
//               Featured
//             </span>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex space-x-2 pt-2">
//           <Link
//             to={`/vendor/products/${id}/edit`}
//             className="flex-1 btn-secondary text-center text-sm"
//           >
//             Edit
//           </Link>
//           <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200">
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


