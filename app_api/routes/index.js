const express = require('express');            
const router = express.Router();               

const tripsController = require('../controllers/trips');

// Route for all trips
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(tripsController.tripsAddTrip);

// Route for specific trip by code
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode);

module.exports = router;
