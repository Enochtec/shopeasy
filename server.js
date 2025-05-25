const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables from .env if you want
require('dotenv').config();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // replace with env var in prod
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day session lifetime
}));

// Make user info available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Set view engine to EJS and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/product'));
app.use('/admin', require('./routes/admin'));
app.use('/cart', require('./routes/cart'));
app.use('/auth', require('./routes/auth'));
app.use('/orders', require('./routes/order'));

// 404 handler (just a simple page)
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});


// // Put this near the bottom of your server.js, just before app.listen()
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).send('Something broke! Check server logs.');
// });


// Start server
app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});



// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke! Check the console for details.');
// });
