// Created by Andrew Torrez for CS-465 SNHU
// Last update May 14th 2025

const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const PORT = process.env.PORT || 3000;

// Register partials (optional if you haven’t added any yet)
hbs.registerPartials(path.join(__dirname, '/app_server/views/partials'));

// Brings in our db
require('./app_api/models/db');

// Set view engine and views folder
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/app_server/views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import and use your new router
const indexRouter = require('./app_server/routes/index');
app.use('/', indexRouter);

// Import and use your travel router
const travelRouter = require('./app_server/routes/travel');
app.use('/travel', travelRouter);

// Import and use your room router
const roomsRouter = require('./app_server/routes/rooms');
app.use('/rooms', roomsRouter);

// Import and use your api router
const apiRouter = require('./app_api/routes/index');
app.use('/api', apiRouter);

app.use(express.json());


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
