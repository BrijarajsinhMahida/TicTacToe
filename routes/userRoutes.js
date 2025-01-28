const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

// POST API to register user 
router.post('/register', registerUser);

// POST API to login user
router.post('/login', loginUser);

module.exports = router;
