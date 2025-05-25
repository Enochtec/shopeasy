const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// GET: Admin dashboard – list all products
router.get('/admin', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send('Error loading products');
    res.render('admin', { products: results });
  });
});

// GET: Show add-product form
router.get('/admin/add', (req, res) => {
  res.render('add-product');
});

// POST: Add new product
router.post('/admin/add', upload.single('image'), (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file ? '/images/products/' + req.file.filename : '';

  const sql = 'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, price, description, image], (err) => {
    if (err) return res.status(500).send('Failed to add product');
    res.redirect('/admin');
  });
});

// GET: Show edit form for a product
router.get('/admin/edit/:id', (req, res) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send('Error loading product');
    if (!result.length) return res.status(404).send('Product not found');
    res.render('edit-product', { product: result[0] });
  });
});

// POST: Handle product edit
router.post('/admin/edit/:id', upload.single('image'), (req, res) => {
  const { name, price, description } = req.body;
  let sql, params;

  if (req.file) {
    const image = '/images/products/' + req.file.filename;
    sql = 'UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?';
    params = [name, price, description, image, req.params.id];
  } else {
    sql = 'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?';
    params = [name, price, description, req.params.id];
  }

  db.query(sql, params, (err) => {
    if (err) return res.status(500).send('Failed to update product');
    res.redirect('/admin');
  });
});

// GET: Delete product
router.get('/admin/delete/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).send('Failed to delete product');
    res.redirect('/admin');
  });
});

module.exports = router;
