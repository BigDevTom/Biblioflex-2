const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/register', userController.createUser);

// Route pour récupérer tous les utilisateurs (accessible uniquement aux admins)
router.get('/users', authController.protect, authController.isAdmin, userController.getAllUsers);

module.exports = router;
