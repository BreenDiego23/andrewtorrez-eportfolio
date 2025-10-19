const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth',
});

const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');
const reservationsCtrl = require('../controllers/reservations');

// Debug: confirm we loaded the right controller and functions
console.log('[api routes] tripsController keys:',
  Object.keys(tripsController || {}));
console.log('[api routes] typeof deleteTripById:',
  typeof tripsController?.tripsDeleteTripById);
console.log('[api routes] typeof deleteTrip:',
  typeof tripsController?.tripsDeleteTrip);
console.log('[api routes] typeof auth:', typeof auth);

// ---------- Auth ----------
router.post('/register', authController.register);
router.post('/login',    authController.login);

// ---------- Trips ----------
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(auth, tripsController.tripsAddTrip);

// DELETE by Mongo _id (distinct /id/ segment)
router
  .route('/trips/id/:id')
  .delete(auth, tripsController.tripsDeleteTripById);

// GET/PUT/DELETE by tripCode
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(auth, tripsController.tripsUpdateTrip)
  .delete(auth, tripsController.tripsDeleteTrip);

// ---------- Reservations ----------
router
  .route('/reservations')
  .post(auth, reservationsCtrl.add)
  .get(auth, reservationsCtrl.listMine);

router
  .route('/reservations/:tripCode')
  .delete(auth, reservationsCtrl.remove);

module.exports = router;