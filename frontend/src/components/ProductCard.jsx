import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <div className="card overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 overflow-hidden group">
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-600">
            {product.category}
          </div>
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-transform"
            title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-600" />
            )}
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block hover:text-primary-600 transition-colors">
          <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <Link 
          to={`/product/${product.id}`} 
          className="text-primary-600 text-sm font-medium hover:underline mb-3 inline-block"
        >
          Xem chi tiết →
        </Link>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price?.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock || 0}
          </span>
        </div>
        
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.stock || product.stock === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{product.stock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
