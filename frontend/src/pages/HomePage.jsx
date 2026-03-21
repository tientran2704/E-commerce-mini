import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import Pagination from '../components/Pagination';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const PER_PAGE = 12;

function HomePage() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const searchQuery = searchParams.get('search') || '';
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          limit: PER_PAGE,
          offset: (page - 1) * PER_PAGE,
        };
        if (searchQuery) params.search = searchQuery;

        const [productsResponse, categoriesData] = await Promise.all([
          productService.getAll(params),
          productService.getCategories(),
        ]);

        const list = productsResponse?.products ?? productsResponse;
        const total = productsResponse?.total ?? (Array.isArray(productsResponse) ? productsResponse.length : 0);

        setProducts(Array.isArray(list) ? list : []);
        setTotalProducts(total);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, page]);

  const totalPages = Math.ceil(totalProducts / PER_PAGE) || 1;

  const handlePageChange = (newPage) => {
    const next = Math.min(totalPages, Math.max(1, newPage));
    const nextParams = new URLSearchParams(searchParams);
    if (next === 1) nextParams.delete('page');
    else nextParams.set('page', String(next));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        <HeroCarousel products={[]} />

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
      <HeroCarousel products={products} />

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t('common.search')}: "{searchQuery}"
          </h2>
          <p className="text-gray-500">{totalProducts} {t('home.all_products').toLowerCase()}</p>
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 card-grid-animate">
            {products.map((product, index) => (
              <div key={product.id} style={{ '--card-index': index }}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
