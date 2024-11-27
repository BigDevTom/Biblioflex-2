const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const loansController = require('../controllers/loansController');

// Route pour ajouter un nouvel emprunt
router.post('/create', protect, loansController.createLoan);

// Route pour obtenir les emprunts en cours d'un utilisateur
router.get('/user/:user_id/current', protect, loansController.getCurrentLoansByUser);

// Route pour obtenir les emprunts retournés d'un utilisateur
router.get('/user/:user_id/returned', protect, loansController.getReturnedLoansByUser);

module.exports = router;