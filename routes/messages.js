const express = require('express');
const router = express.Router();
const MessagesController = require('../controllers/messages');
const checkAuth = require('../middleware/check-auth');

router.get('/transcript', checkAuth, MessagesController.getTranscript)

module.exports = router