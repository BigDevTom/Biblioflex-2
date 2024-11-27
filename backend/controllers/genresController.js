const db = require('../config/db');

// Fonction pour obtenir tous les genres
exports.getAllGenres = (req, res) => {
    const query = 'SELECT * FROM genres';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL lors de la récupération des genres :', err);

            // Cas où la requête échoue pour des raisons spécifiques (par exemple, problème de syntaxe SQL)
            if (err.code === 'ER_PARSE_ERROR') {
                return res.status(400).json({ message: 'Erreur de syntaxe dans la requête SQL.' });
            }

            // Autres erreurs génériques du serveur
            return res.status(500).json({ message: 'Erreur lors de la récupération des genres.' });
        }

        // Si aucun genre n'est trouvé, renvoyer un message spécifique
        if (results.length === 0) {
            return res.status(404).json({ message: 'Aucun genre trouvé.' });
        }

        // Retourner les résultats si tout s'est bien passé
        res.json(results);
    });
};

// Fonction pour obtenir un genre par son ID
exports.getGenreById = (req, res) => {
    const genreId = req.params.id;
    const query = 'SELECT * FROM genres WHERE id = ?';

    db.query(query, [genreId], (err, result) => {
        if (err) {
            console.error('Erreur SQL lors de la récupération du genre :', err);

            // Cas d'erreur de syntaxe SQL
            if (err.code === 'ER_PARSE_ERROR') {
                return res.status(400).json({ message: 'Erreur de syntaxe dans la requête SQL.' });
            }

            // Cas d'erreur de connexion ou d'autres erreurs internes
            return res.status(500).json({ message: 'Erreur lors de la récupération du genre.' });
        }

        // Si aucun genre n'est trouvé pour l'ID donné
        if (result.length === 0) {
            return res.status(404).json({ message: 'Genre non trouvé.' });
        }

        // Si tout s'est bien passé, on renvoie le genre
        res.json(result[0]);
    });
};

// Fonction pour ajouter un nouveau genre
exports.createGenre = (req, res) => {
    const { name, description } = req.body;

    // Vérification des champs requis
    if (!name || !description) {
        return res.status(400).json({ message: 'Le nom et la description sont requis.' });
    }

    const query = 'INSERT INTO genres (name, description) VALUES (?, ?)';

    db.query(query, [name, description], (err, result) => {
        if (err) {
            console.error('Erreur SQL lors de l\'ajout du genre :', err);

            // Vérifier si l'erreur est due à une contrainte d'unicité (par exemple, le nom du genre déjà utilisé)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Le nom du genre existe déjà.' });
            }

            // Vérifier les erreurs de données trop longues ou de données invalides
            if (err.code === 'ER_DATA_TOO_LONG' || err.code === 'ER_BAD_NULL_ERROR') {
                return res.status(422).json({ message: 'Les données fournies sont invalides.' });
            }

            // Erreurs internes
            return res.status(500).json({ message: 'Erreur lors de l\'ajout du genre.' });
        }

        res.status(201).json({ message: 'Genre ajouté avec succès.' });
    });
};

// Fonction pour mettre à jour un genre existant
exports.updateGenre = (req, res) => {
    const genreId = req.params.id;
    const { name, description } = req.body;

    // Vérification des champs requis
    if (!name || !description) {
        return res.status(400).json({ message: 'Le nom et la description sont requis.' });
    }

    const query = 'UPDATE genres SET name = ?, description = ? WHERE id = ?';

    db.query(query, [name, description, genreId], (err, result) => {
        if (err) {
            console.error('Erreur SQL lors de la mise à jour du genre :', err);

            // Vérification d'un conflit d'unicité sur le nom du genre
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Le nom du genre existe déjà.' });
            }

            // Vérification des erreurs liées aux données invalides ou trop longues
            if (err.code === 'ER_DATA_TOO_LONG' || err.code === 'ER_BAD_NULL_ERROR') {
                return res.status(422).json({ message: 'Les données fournies sont invalides.' });
            }

            // Erreur générique pour les autres types d'erreurs
            return res.status(500).json({ message: 'Erreur lors de la mise à jour du genre.' });
        }

        // Si aucune ligne n'est affectée, le genre n'existe pas
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Genre non trouvé.' });
        }

        res.json({ message: 'Genre mis à jour avec succès.' });
    });
};

// Fonction pour supprimer un genre
exports.deleteGenre = (req, res) => {
    const genreId = req.params.id;
    const query = 'DELETE FROM genres WHERE id = ?';

    db.query(query, [genreId], (err, result) => {
        if (err) {
            console.error('Erreur SQL lors de la suppression du genre :', err);

            // Gestion des erreurs spécifiques liées à la base de données
            if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Erreur si le genre est référencé ailleurs (par exemple, dans des livres)
                return res.status(409).json({ message: 'Le genre ne peut pas être supprimé car il est utilisé ailleurs.' });
            }
            return res.status(500).json({ message: 'Erreur lors de la suppression du genre.' });
        }

        // Si aucune ligne n'est affectée, le genre n'existe pas
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Genre non trouvé.' });
        }

        // Si tout se passe bien, on retourne un message de succès
        res.json({ message: 'Genre supprimé avec succès.' });
    });
};