const db = require('../config/db');

// Fonction pour obtenir tous les genres
exports.getAllGenres = (req, res) => {
    const query = 'SELECT * FROM genres';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des genres.' });
        res.json(results);
    });
};

// Fonction pour obtenir un genre par son ID
exports.getGenreById = (req, res) => {
    const genreId = req.params.id;
    const query = 'SELECT * FROM genres WHERE id = ?';
    db.query(query, [genreId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la récupération du genre.' });
        if (result.length === 0) return res.status(404).json({ message: 'Genre non trouvé.' });
        res.json(result[0]);
    });
};

// Fonction pour ajouter un nouveau genre
exports.createGenre = (req, res) => {
    const { name, description } = req.body;
    const query = 'INSERT INTO genres (name, description) VALUES (?, ?)';
    db.query(query, [name, description], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de l\'ajout du genre.' });
        res.status(201).json({ message: 'Genre ajouté avec succès.' });
    });
};

// Fonction pour mettre à jour un genre existant
exports.updateGenre = (req, res) => {
    const genreId = req.params.id;
    const { name, description } = req.body;
    const query = 'UPDATE genres SET name = ?, description = ? WHERE id = ?';
    db.query(query, [name, description, genreId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour du genre.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Genre non trouvé.' });
        res.json({ message: 'Genre mis à jour avec succès.' });
    });
};

// Fonction pour supprimer un genre
exports.deleteGenre = (req, res) => {
    const genreId = req.params.id;
    const query = 'DELETE FROM genres WHERE id = ?';
    db.query(query, [genreId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la suppression du genre.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Genre non trouvé.' });
        res.json({ message: 'Genre supprimé avec succès.' });
    });
};