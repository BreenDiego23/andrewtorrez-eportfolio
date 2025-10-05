const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');
const travelController = require('../controllers/travel');

const ctrlTrips = require('../../app_api/controllers/trips');

// Server-side rendered HBS routes
router.get('/', mainController.index);
router.get('/travel', travelController.travelPage);
router.get('/login', mainController.login);
router.post('/login', mainController.doLogin);
router.get('/logout', mainController.logout);
router.get('/register', mainController.registerForm);
router.post('/register', mainController.registerUser);
router.get('/travel', ctrlTrips.publicTravelPage);

// Angular Single Page Application routes
router.get('/news', mainController.news);

router.get('/reservations', (req, res) => {
  res.render('reservations', {title: 'Your Reservations'})
});

router.get('/admin', (req, res) => {
  if (req.session && req.session.token) {
    res.redirect('http://localhost:4200/admin');
  } else {
    res.redirect('/login');
  }
});

router.get('/checkout', (req, res) => {
  res.redirect('http://localhost:4200/checkout');
});

module.exports = router;