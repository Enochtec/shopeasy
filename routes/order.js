const express = require('express');
const router = express.Router();
const db = require('../db');

// Checkout – save order
router.post('/checkout', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  if (!req.session.cart || !req.session.cart.length) return res.redirect('/cart');

  const userId = req.session.user.id;
  const cart = req.session.cart;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const sqlOrder = 'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)';
  db.query(sqlOrder, [userId, total], (err, result) => {
    if (err) return res.status(500).send('Order failed');
    const orderId = result.insertId;

    const sqlItems = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';
    const values = cart.map(item => [orderId, item.id, item.qty]);

    db.query(sqlItems, [values], (err2) => {
      if (err2) return res.status(500).send('Order items failed');

      req.session.cart = [];
      res.redirect('/orders');
    });
  });
});

// View my orders
router.get('/orders', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const sql = `
    SELECT o.id, o.total_amount, o.created_at, p.name, oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;
  db.query(sql, [req.session.user.id], (err, results) => {
    if (err) return res.status(500).send('Failed to load orders');
    res.render('orders', { orders: results });
  });
});

module.exports = router;
