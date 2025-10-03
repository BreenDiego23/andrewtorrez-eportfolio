// Created by Andrew Torrez for CS-465 SNHU
// Last update May 14th 2025

require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Load database and models before anything that uses them
require('./app_api/models/db');
require('./app_api/models/users');
require('./app_api/config/passport');

// Wire in our authentication module
const passport = require('passport');

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Use Morgan
app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Register partials
hbs.registerPartials(path.join(__dirname, '/app_server/views/partials'));

// Connect to .env
require('dotenv').config();

// Set view engine and views folder
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/app_server/views'));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'travlr_secret_key',
  resave: false,
  saveUninitialized: true
}));



// Set up routes
const indexRouter = require('./app_server/routes/index');
const travelRouter = require('./app_server/routes/travel');
const roomsRouter = require('./app_server/routes/rooms');
const apiRouter = require('./app_api/routes/index');

app.use('/', indexRouter);
app.use('/travel', travelRouter);
app.use('/rooms', roomsRouter);

app.use('/api', apiRouter);

// Catch unauthorized error and create 401
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({ "message": err.name + ": " + err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});