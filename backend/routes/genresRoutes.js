const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genresController');

// Route pour obtenir tous les genres
router.get('/', genresController.getAllGenres);

// Route pour obtenir un genre par son ID
router.get('/:id', genresController.getGenreById);

// Route pour ajouter un nouveau genre
router.post('/', genresController.createGenre);

// Route pour mettre à jour un genre existant
router.put('/:id', genresController.updateGenre);

// Route pour supprimer un genre
router.delete('/:id', genresController.deleteGenre);

module.exports = router;