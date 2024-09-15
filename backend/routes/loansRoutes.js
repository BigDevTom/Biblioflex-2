const express = require('express');
const router = express.Router();
const loansController = require('../controllers/loansController');

// Route pour ajouter un emprunt
router.post('/loans', loansController.createLoan);

module.exports = router;
