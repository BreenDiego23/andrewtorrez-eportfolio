// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Import database connection and user model
require('./app_api/models/db');
require('./app_api/models/users');
require('./app_api/config/passport');

// Import Passport for authentication
const passport = require('passport');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport middleware
app.use(passport.initialize());

// HTTP request logger middleware
app.use(morgan('dev'));

// Enable CORS for specified origin and methods
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Register Handlebars partial templates
hbs.registerPartials(path.join(__dirname, '/app_server/views/partials'));

// Configure view engine and views directory
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/app_server/views'));

// Parse incoming JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session management
app.use(session({
  secret: 'travlr_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to expose authentication status and token to views
app.use((req, res, next) => {
  res.locals.loggedIn = !!(req.session && req.session.token);
  res.locals.token    = (req.session && req.session.token) || '';
  next();
});

// Import route handlers
const indexRouter = require('./app_server/routes/index');
const travelRouter = require('./app_server/routes/travel');
const roomsRouter = require('./app_server/routes/rooms');
const apiRouter = require('./app_api/routes/index');

// Mount routers on their respective paths
app.use('/', indexRouter);
app.use('/travel', travelRouter);
app.use('/rooms', roomsRouter);
app.use('/api', apiRouter);

// Error handler for unauthorized access
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({ "message": err.name + ": " + err.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});