const db = require('../config/db');

// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [wishlists] = await db.execute(
            `SELECT w.id, w.product_id, w.created_at, 
                    p.name, p.price, p.image, p.category, p.stock
             FROM wishlists w
             JOIN products p ON w.product_id = p.id
             WHERE w.user_id = ?
             ORDER BY w.created_at DESC`,
            [userId]
        );
        
        res.json(wishlists);
    } catch (error) {
        console.error('Error getting wishlist:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({ message: 'Thiếu productId' });
        }
        
        // Check if product exists
        const [products] = await db.execute('SELECT id FROM products WHERE id = ?', [productId]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        
        // Check if already in wishlist
        const [existing] = await db.execute(
            'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
        }
        
        // Add to wishlist
        await db.execute(
            'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );
        
        res.status(201).json({ message: 'Đã thêm vào danh sách yêu thích' });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        
        await db.execute(
            'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        
        res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Check if product is in wishlist
const checkWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        
        const [wishlist] = await db.execute(
            'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        
        res.json({ isInWishlist: wishlist.length > 0 });
    } catch (error) {
        console.error('Error checking wishlist:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist
};
