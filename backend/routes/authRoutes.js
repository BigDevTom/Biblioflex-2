const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'enregistrement
router.post('/register', authController.createUser);

// Route pour la connexion
router.post('/login', authController.loginUser);

module.exports = router;