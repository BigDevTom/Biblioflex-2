const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route pour créer un nouvel utilisateur
router.post('/users', userController.createUser);

// Route pour la connexion
router.post('/login', userController.loginUser);

module.exports = router;
