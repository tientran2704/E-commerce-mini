import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
            setWishlistCount(0);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(response.data);
            setWishlistCount(response.data.length);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/wishlist', { productId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchWishlist();
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi khi thêm vào wishlist';
            return { success: false, message };
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchWishlist();
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi khi xóa khỏi wishlist';
            return { success: false, message };
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.product_id === productId);
    };

    const toggleWishlist = async (productId) => {
        if (isInWishlist(productId)) {
            return await removeFromWishlist(productId);
        } else {
            return await addToWishlist(productId);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistCount,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
