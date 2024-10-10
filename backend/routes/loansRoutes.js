const express = require('express');
const router = express.Router();
const loansController = require('../controllers/loansController');

// Route pour ajouter un nouvel emprunt
router.post('/', loansController.createLoan);

// Route pour obtenir les emprunts en cours d'un utilisateur
router.get('/user/:user_id/current', loansController.getCurrentLoansByUser);

// Route pour obtenir les emprunts retournés d'un utilisateur
router.get('/user/:user_id/returned', loansController.getReturnedLoansByUser);

module.exports = router;
