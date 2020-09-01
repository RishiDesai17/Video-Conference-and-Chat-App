const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/login', UsersController.login)

router.post('/register', UsersController.register)

router.get('/logout', UsersController.logout)

router.post('/refresh', UsersController.refresh)

module.exports = router