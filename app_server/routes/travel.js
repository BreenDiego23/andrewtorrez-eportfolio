const express = require('express');
const router = express.Router();

const travelController = require('../controllers/travel');

// Route: GET /travel
router.get('/', travelController.travelPage);

module.exports = router;
