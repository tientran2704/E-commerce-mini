const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

const getGenAI = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const chat = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const genAI = getGenAI();
    
    if (!genAI) {
      const productSql = 'SELECT id, name, price, description, category FROM products LIMIT 50';
      db.query(productSql, (err, products) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching products' });
        }
        return res.status(503).json({ 
          message: 'AI chat is currently unavailable. Please check the Google API key configuration.',
          products: products || []
        });
      });
      return;
    }

    const productSql = 'SELECT id, name, price, description, category FROM products LIMIT 50';
    db.query(productSql, async (err, products) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching products' });
      }

      const productContext = products.map(p => 
        `${p.name} - $${p.price} - ${p.category} - ${p.description}`
      ).join('\n');

      const systemPrompt = `You are a helpful AI shopping assistant for an e-commerce store. 
You have access to the following products:
${productContext}

When suggesting products, provide specific product names and prices.
If a user asks for recommendations, be specific about which products match their needs.
Keep responses concise and friendly.`;

      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        const chatSession = model.startChat({
          history: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Hello! I am your AI shopping assistant. I have knowledge of all the products in our store. How can I help you today?' }] }
          ]
        });

        const result = await chatSession.sendMessage(message);
        const response = result.response.text();

        res.json({ 
          message: response,
          products: products
        });
      } catch (aiError) {
        console.error('Google AI API Error:', aiError.message);
        res.status(503).json({ 
          message: 'AI service is temporarily unavailable. Please try again later.',
          products: products
        });
      }
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error processing AI request' });
  }
};

const recommendProducts = (req, res) => {
  try {
    const { product_id, category, price_range, limit } = req.body;
    const userId = req.user ? req.user.id : null;

    let recommendations = [];

    if (product_id) {
      const productSql = 'SELECT category, price FROM products WHERE id = ?';
      db.query(productSql, [product_id], (err, productResults) => {
        if (err || productResults.length === 0) {
          return res.status(500).json({ message: 'Product not found' });
        }

        const product = productResults[0];
        const minPrice = product.price * 0.7;
        const maxPrice = product.price * 1.3;

        const recSql = `
          SELECT * FROM products 
          WHERE category = ? 
          AND id != ? 
          AND price BETWEEN ? AND ?
          ORDER BY price ASC
          LIMIT ?
        `;
        
        db.query(recSql, [product.category, product_id, minPrice, maxPrice, limit || 5], (err, results) => {
          if (err) {
            return res.status(500).json({ message: 'Error getting recommendations' });
          }
          res.json({ recommendations: results, type: 'similar_products' });
        });
      });
    } else if (category) {
      const recSql = 'SELECT * FROM products WHERE category = ? ORDER BY price ASC LIMIT ?';
      db.query(recSql, [category, limit || 5], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error getting recommendations' });
        }
        res.json({ recommendations: results, type: 'category' });
      });
    } else if (price_range) {
      const [min, max] = price_range.split('-').map(Number);
      const recSql = 'SELECT * FROM products WHERE price BETWEEN ? AND ? ORDER BY created_at DESC LIMIT ?';
      db.query(recSql, [min, max, limit || 10], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error getting recommendations' });
        }
        res.json({ recommendations: results, type: 'price_range' });
      });
    } else if (userId) {
      const viewedSql = `
        SELECT p.category, COUNT(*) as view_count 
        FROM product_views pv 
        JOIN products p ON pv.product_id = p.id 
        WHERE pv.user_id = ? 
        GROUP BY p.category 
        ORDER BY view_count DESC 
        LIMIT 3
      `;
      
      db.query(viewedSql, [userId], (err, categories) => {
        if (err || categories.length === 0) {
          const fallbackSql = 'SELECT * FROM products ORDER BY RAND() LIMIT 5';
          db.query(fallbackSql, (err, results) => {
            if (err) {
              return res.status(500).json({ message: 'Error getting recommendations' });
            }
            res.json({ recommendations: results, type: 'popular' });
          });
          return;
        }

        const categoryList = categories.map(c => c.category).join(',');
        const recSql = `SELECT * FROM products WHERE category IN (${categoryList}) ORDER BY created_at DESC LIMIT ?`;
        db.query(recSql, [limit || 10], (err, results) => {
          if (err) {
            return res.status(500).json({ message: 'Error getting recommendations' });
          }
          res.json({ recommendations: results, type: 'based_on_history' });
        });
      });
    } else {
      const recSql = 'SELECT * FROM products ORDER BY RAND() LIMIT 5';
      db.query(recSql, (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error getting recommendations' });
        }
        res.json({ recommendations: results, type: 'popular' });
      });
    }
  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
};

const trackProductView = (req, res) => {
  const { product_id } = req.body;
  const userId = req.user ? req.user.id : null;

  if (!product_id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const sql = 'INSERT INTO product_views (user_id, product_id) VALUES (?, ?)';
  db.query(sql, [userId, product_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error tracking view' });
    }
    res.json({ message: 'Product view tracked' });
  });
};

module.exports = {
  chat,
  recommendProducts,
  trackProductView
};
