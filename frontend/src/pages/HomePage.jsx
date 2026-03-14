import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          searchQuery ? productService.search(searchQuery) : productService.getAll(),
          productService.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        <div className="mb-8">
          <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse mb-4" />
          <div className="h-24 max-w-xl bg-gray-200 rounded-2xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="card overflow-hidden animate-pulse"
              style={{ '--card-index': index }}
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-9 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          {t('home.title')}
        </h1>
        <p className="text-xl mb-6">
          {t('home.subtitle')}
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('home.featured_products')}
          </Link>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t('common.search')}: "{searchQuery}"
          </h2>
          <p className="text-gray-500">{products.length} {t('home.all_products').toLowerCase()}</p>
        </div>
      )}

      {/* Categories */}
      {!searchQuery && categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('home.categories')}</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/?search=${cat}`}
                className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-700 font-medium"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">{t('home.no_products')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 card-grid-animate">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              style={{ '--card-index': index }}
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
