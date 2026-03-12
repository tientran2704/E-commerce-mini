const db = require('../config/db');

const createOrder = (req, res) => {
  const { items, shipping_address, payment_method, total_price } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }

  const sql = 'INSERT INTO orders (user_id, total_price, shipping_address, payment_method) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, total_price, shipping_address, payment_method], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating order' });
    }

    const orderId = result.insertId;

    const itemPromises = items.map(item => {
      return new Promise((resolve, reject) => {
        const itemSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
        db.query(itemSql, [orderId, item.product_id, item.quantity, item.price], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    Promise.all(itemPromises)
      .then(() => {
        const orderSql = 'SELECT * FROM orders WHERE id = ?';
        db.query(orderSql, [orderId], (err, results) => {
          if (err) {
            return res.status(500).json({ message: 'Error fetching order' });
          }
          res.status(201).json({ message: 'Order created successfully', order: results[0] });
        });
      })
      .catch(err => {
        return res.status(500).json({ message: 'Error creating order items' });
      });
  });
};

const getUserOrders = (req, res) => {
  const userId = req.params.userId || req.user.id;

  const sql = `
    SELECT o.*, 
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'product_name', p.name,
               'product_image', p.image
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    const orders = results.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items).filter(item => item.id !== null) : []
    }));

    res.json(orders);
  });
};

const getAllOrders = (req, res) => {
  const sql = `
    SELECT o.*, u.name as user_name, u.email as user_email,
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'product_name', p.name
             )
           ) as items
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    const orders = results.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items).filter(item => item.id !== null) : []
    }));

    res.json(orders);
  });
};

const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  });
};

const getOrderById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT o.*, u.name as user_name, u.email as user_email,
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'product_name', p.name,
               'product_image', p.image
             )
           ) as items
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = ?
    GROUP BY o.id
  `;
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = {
      ...results[0],
      items: results[0].items ? JSON.parse(results[0].items).filter(item => item.id !== null) : []
    };

    res.json(order);
  });
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById
};
