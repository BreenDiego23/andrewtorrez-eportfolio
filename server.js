// Created by Andrew Torrez for CS-465 SNHU
// Last update May 14th 2025

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3000;

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Use Morgan
app.use(morgan('dev'));

// Restrict CORS access to Angular frontend only
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Register partials
hbs.registerPartials(path.join(__dirname, '/app_server/views/partials'));

// Connect to database
require('./app_api/models/db');

// Set view engine and views folder
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/app_server/views'));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
const indexRouter = require('./app_server/routes/index');
const travelRouter = require('./app_server/routes/travel');
const roomsRouter = require('./app_server/routes/rooms');
const apiRouter = require('./app_api/routes/index');

app.use('/', indexRouter);
app.use('/travel', travelRouter);
app.use('/rooms', roomsRouter);
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});