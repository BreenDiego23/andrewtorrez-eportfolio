const express = require('express');
const router = express.Router();

// ✅ express-jwt v7+ export name and options
const jwt = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth' // replaces userProperty (deprecated)
});

// Debug (optional): confirm secret is present at runtime
if (!process.env.JWT_SECRET) {
  console.warn('[api routes] JWT_SECRET is NOT set. Set it in .env');
}

const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');
const reservationsCtrl = require('../controllers/reservations');

// Auth routes
router.post('/register', authController.register);
router.post('/login',    authController.login);

// Trip routes
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(auth, tripsController.tripsAddTrip);

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(auth, tripsController.tripsUpdateTrip);

// Create /api/reservations (POST add, GET mine)
router
  .route('/reservations')
  .post(auth, reservationsCtrl.add)
  .get(auth, reservationsCtrl.listMine);

// Delete a specific reservation by tripCode
router
  .route('/reservations/:tripCode')
  .delete(auth, reservationsCtrl.remove);

module.exports = router;