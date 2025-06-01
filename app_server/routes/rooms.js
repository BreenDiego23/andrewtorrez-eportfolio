// routes/rooms.js
const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/rooms');

router.get('/', roomsController.roomsPage);

module.exports = router;
