const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin dashboard: list all products
router.get('/admin', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.render('admin', { products: results });
  });
});

// Show form to add a new product
router.get('/admin/add', (req, res) => {
  res.render('add-product');
});

// Handle new product submission
router.post('/admin/add', (req, res) => {
  const { name, price, description, image } = req.body;
  const sql = 'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, price, description, image], (err) => {
    if (err) throw err;
    res.redirect('/admin');
  });
});

// Delete a product
router.get('/admin/delete/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/admin');
  });
});

module.exports = router;
