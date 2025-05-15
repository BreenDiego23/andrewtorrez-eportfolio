// Created by Andrew Torrez for CS-465 SNHU
// Last update May 14th 2025

const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const PORT = process.env.PORT || 3000;

// Register partials (optional if you haven’t added any yet)
hbs.registerPartials(path.join(__dirname, '/app_server/views/partials'));

// Set view engine and views folder
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/app_server/views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import and use your new router
const indexRouter = require('./app_server/routes/index');
app.use('/', indexRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
