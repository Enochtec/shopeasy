const express = require('express');
const router = express.Router();
const db = require('../db');

// Initialize cart in session if not exists
function initCart(req) {
  if (!req.session.cart) req.session.cart = [];
}

// Add to cart
router.post('/cart/add/:id', (req, res) => {
  const productId = req.params.id;
  initCart(req);

  // Check if already in cart
  const existing = req.session.cart.find(p => p.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    // Fetch product from DB
    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, result) => {
      if (err || !result.length) return res.status(500).send('Product not found');
      const product = result[0];
      req.session.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
      res.redirect('/cart');
    });
    return;
  }

  res.redirect('/cart');
});

// View cart
router.get('/cart', (req, res) => {
  initCart(req);
  const cart = req.session.cart;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.render('cart', { cart, total });
});

// Remove from cart
router.get('/cart/remove/:id', (req, res) => {
  initCart(req);
  req.session.cart = req.session.cart.filter(item => item.id != req.params.id);
  res.redirect('/cart');
});

module.exports = router;
