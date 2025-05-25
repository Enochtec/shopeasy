const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');

const productsRoute = require('./routes/products');
const adminRoute = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.use('/', productsRoute);
app.use('/', adminRoute); // now handling admin too

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
