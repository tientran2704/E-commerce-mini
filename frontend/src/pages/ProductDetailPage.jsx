import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { aiService } from '../services/api';
import ReviewList from '../components/ReviewList';
import { useTranslation } from 'react-i18next';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const { addToCart } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(id);
        setProduct(data);

        // Track view for AI recommendations
        try {
          await aiService.trackView(id);
        } catch (e) {
          console.log('Tracking not available');
        }

        // Get AI recommendations
        try {
          const rec = await aiService.recommend({ product_id: id, limit: 4 });
          setRecommendations(rec.recommendations || []);
        } catch (e) {
          console.log('Recommendations not available');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-pulse">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="w-full h-[500px] bg-gray-200" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded-full" />
            <div className="h-8 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded mt-4" />
            <div className="h-12 w-full bg-gray-200 rounded-lg mt-6" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">{t('errors.not_found')}</p>
        <Link to="/" className="btn-primary inline-block mt-4">
          {t('common.home')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-6">
        <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.products')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full h-[500px] object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm rounded-full font-medium">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex items-center justify-between mb-6">
            <span className="text-4xl font-bold text-primary-600">
              ${product.price?.toLocaleString()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} ${t('cart.quantity').toLowerCase()}` : t('product.no_reviews').replace('reviews', 'stock')}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">{t('cart.quantity')}:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <span className="w-12 text-center font-medium text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {product.stock ? t('product.add_to_cart') : t('errors.not_found').replace('Page', 'Stock')}
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('product.recommended_for_you')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 card-grid-animate">
            {recommendations.map((rec, index) => (
              <Link
                key={rec.id}
                to={`/product/${rec.id}`}
                className="card overflow-hidden group"
                style={{ '--card-index': index }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={rec.image || 'https://via.placeholder.com/300'}
                    alt={rec.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{rec.name}</h3>
                  <span className="text-primary-600 font-bold">
                    ${rec.price?.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-12">
        <ReviewList productId={id} />
      </div>
    </div>
  );
}

export default ProductDetailPage;
