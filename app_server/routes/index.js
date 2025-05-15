const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');
const travelController = require('../controllers/travel');

router.get('/', mainController.index);
router.get('/travel', travelController.travelPage);

module.exports = router;
