const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route pour créer un nouvel utilisateur
router.post('/users', userController.createUser);

// Route pour la connexion
router.post('/login', userController.loginUser);

// Route pour récépurer tous les utilisateurs
router.get('/users', userController.getAllUsers);

module.exports = router;
