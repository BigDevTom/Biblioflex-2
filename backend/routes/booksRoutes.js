const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

// Route pour obtenir tous les livres
router.get('/', booksController.getAllBooks);

// Route pour obtenir un livre par son ID
router.get('/:id', booksController.getBookById);

// Route pour ajouter un nouveau livre
router.post('/', booksController.createBook);

// Route pour mettre à jour un livre existant
router.put('/:id', booksController.updateBook);

// Route pour supprimer un livre
router.delete('/:id', booksController.deleteBook);

module.exports = router;