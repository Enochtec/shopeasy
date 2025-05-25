const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Homepage – list all products
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send('Error loading products');
    res.render('index', { products: results });
  });
});

// GET: Product details page
router.get('/product/:id', (req, res) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send('Failed to load product');
    if (!result.length) return res.status(404).send('Product not found');
    res.render('product', { product: result[0] });
  });
});

module.exports = router;
