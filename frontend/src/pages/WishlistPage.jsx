import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FaHeart, FaTrash, FaShoppingCart, FaRegHeart } from 'react-icons/fa';

const WishlistPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist, fetchWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
        setLoading(false);
    }, []);

    const handleAddToCart = async (product) => {
        const result = await addToCart(product.id, 1);
        if (result.success) {
            await removeFromWishlist(product.id);
        }
    };

    const handleRemove = async (productId) => {
        await removeFromWishlist(productId);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaHeart className="text-red-500" />
                {t('wishlist.title', 'Danh sách yêu thích')}
            </h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-16">
                    <FaRegHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">
                        {t('wishlist.empty', 'Chưa có sản phẩm nào trong danh sách yêu thích')}
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        {t('wishlist.continueShopping', 'Tiếp tục mua sắm')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <Link to={`/product/${item.product_id}`}>
                                <img
                                    src={item.image || 'https://via.placeholder.com/300'}
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                            </Link>
                            <div className="p-4">
                                <Link to={`/product/${item.product_id}`}>
                                    <h3 className="font-semibold text-lg mb-2 hover:text-blue-500 line-clamp-2">
                                        {item.name}
                                    </h3>
                                </Link>
                                <p className="text-gray-600 mb-2">{item.category}</p>
                                <p className="text-blue-600 font-bold text-xl mb-4">
                                    ${item.price?.toLocaleString()}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        disabled={item.stock === 0}
                                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        <FaShoppingCart />
                                        {t('wishlist.addToCart', 'Thêm vào giỏ')}
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.product_id)}
                                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                                        title={t('wishlist.remove', 'Xóa')}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
