const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); // Ajoutez cette ligne
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authController.protect, userController.getMe);

module.exports = router;