import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CompareTable({ products, onRemove }) {
  const { addToCart } = useCart();

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products to compare</p>
      </div>
    );
  }

  // Define comparison features
  const features = [
    { key: 'image', label: 'Image', type: 'image' },
    { key: 'name', label: 'Product Name', type: 'text' },
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'stock', label: 'Availability', type: 'stock' },
    { key: 'description', label: 'Description', type: 'longText' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left bg-gray-50 border-b-2 sticky left-0 z-10 min-w-[150px]">
              <span className="text-sm font-semibold text-gray-600">Features</span>
            </th>
            {products.map((product) => (
              <th key={product.id} className="p-4 bg-gray-50 border-b-2 min-w-[250px]">
                <div className="relative">
                  <button
                    onClick={() => onRemove(product.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img
                    src={product.image || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <Link
                    to={`/product/${product.id}`}
                    className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2 block"
                  >
                    {product.name}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.key} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 border-b font-medium text-gray-600 sticky left-0 bg-white z-10">
                {feature.label}
              </td>
              {products.map((product) => (
                <td key={`${product.id}-${feature.key}`} className="p-4 border-b text-center">
                  {feature.type === 'image' ? (
                    <img
                      src={product.image || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                  ) : feature.type === 'price' ? (
                    <span className="text-xl font-bold text-primary-600">
                      ${product.price?.toLocaleString()}
                    </span>
                  ) : feature.type === 'stock' ? (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  ) : feature.type === 'longText' ? (
                    <p className="text-sm text-gray-600 line-clamp-3 max-w-[200px]">
                      {product.description || 'N/A'}
                    </p>
                  ) : (
                    <span className="text-gray-800">{product[feature.key] || 'N/A'}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          
          {/* Action Row */}
          <tr>
            <td className="p-4 sticky left-0 bg-white z-10">
              <span className="font-medium text-gray-600">Actions</span>
            </td>
            {products.map((product) => (
              <td key={`${product.id}-action`} className="p-4">
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={!product.stock}
                  className="w-full btn-primary py-2 disabled:opacity-50"
                >
                  Add to Cart
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CompareTable;
