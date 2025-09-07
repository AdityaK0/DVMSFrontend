import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    description,
    price,
    category,
    stock_quantity,
    image_url,
    is_active,
  } = product;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-secondary-200 rounded-lg flex items-center justify-center">
            <span className="text-secondary-500 text-4xl">📦</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium text-secondary-900 line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-secondary-600 line-clamp-2">
            {description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${price}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-secondary-600">
          <span>Category: {category}</span>
          <span>Stock: {stock_quantity}</span>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Link
            to={`/vendor/products/${id}/edit`}
            className="flex-1 btn-secondary text-center text-sm"
          >
            Edit
          </Link>
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
