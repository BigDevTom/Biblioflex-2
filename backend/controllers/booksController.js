const db = require('../config/db');

// Fonction pour obtenir tous les livres
exports.getAllBooks = (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur de connexion à la base de données :', err);
            return res.status(503).json({ message: 'Erreur temporaire lors de la récupération des livres. Veuillez réessayer plus tard.' });
        }

        if (results.length === 0) {
            // Aucun livre trouvé
            return res.status(204).json({ message: 'Aucun livre trouvé.' });
        }

        // Retourner les livres trouvés
        res.status(200).json(results);
    });
};


// Fonction pour obtenir un livre par son ID
exports.getBookById = (req, res) => {
    const bookId = req.params.id;

    // Vérifier si l'ID est valide (par exemple, un nombre entier)
    if (!Number.isInteger(Number(bookId))) {
        return res.status(400).json({ message: 'ID invalide. Veuillez fournir un identifiant numérique valide.' });
    }

    const query = 'SELECT * FROM books WHERE id = ?';
    db.query(query, [bookId], (err, result) => {
        if (err) {
            console.error('Erreur de base de données lors de la récupération du livre :', err);
            return res.status(503).json({ message: 'Erreur temporaire lors de la récupération du livre. Veuillez réessayer plus tard.' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: `Livre avec l'ID ${bookId} non trouvé.` });
        }

        res.status(200).json(result[0]);
    });
};

// Fonction pour ajouter un nouveau livre
exports.createBook = (req, res) => {
    const {
        title,
        author,
        genre_id,
        publication_date,
        isbn,
        copies_available,
        description,
        availability
    } = req.body;

    // Vérification des champs requis
    if (!title || !author || !genre_id || !publication_date || !isbn || !copies_available || availability === undefined) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const query = `
        INSERT INTO books (
            title,
            author,
            genre_id,
            publication_date,
            isbn,
            copies_available,
            description,
            availability
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        title,
        author,
        genre_id,
        publication_date,
        isbn,
        copies_available,
        description,
        availability
    ], (err, result) => {
        if (err) {
            console.error('Erreur SQL :', err); // Log l'erreur pour diagnostic

            // Vérification d'un conflit d'ISBN (livre déjà existant)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Un livre avec ce ISBN existe déjà.' });
            }

            // Vérification des violations de contraintes, telles que des clés étrangères invalides
            if (err.code === 'ER_BAD_NULL_ERROR' || err.code === 'ER_DATA_TOO_LONG') {
                return res.status(422).json({ message: 'Les données fournies sont invalides.' });
            }

            // Erreur générique serveur
            return res.status(500).json({ message: 'Erreur lors de l\'ajout du livre.' });
        }

        res.status(201).json({ message: 'Livre ajouté avec succès.' });
    });
};



// Fonction pour mettre à jour un livre existant
exports.updateBook = (req, res) => {
    const bookId = req.params.id;
    const { title, author, genre_id, publication_date, isbn, copies_available, description, availability } = req.body;

    // Vérification que les champs nécessaires sont présents
    if (!title || !author || !genre_id || !publication_date || !isbn || !copies_available || availability === undefined) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const query = 'UPDATE books SET title = ?, author = ?, genre_id = ?, publication_date = ?, isbn = ?, copies_available = ?, description = ?, availability = ? WHERE id = ?';
    
    db.query(query, [title, author, genre_id, publication_date, isbn, copies_available, description, availability, bookId], (err, result) => {
        if (err) {
            console.error('Erreur SQL lors de la mise à jour du livre :', err);

            // Gestion des erreurs spécifiques
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Conflit : cet ISBN existe déjà pour un autre livre.' });
            }

            // Erreur de données invalides (par exemple, une violation de clé étrangère ou un type incorrect)
            if (err.code === 'ER_BAD_NULL_ERROR' || err.code === 'ER_DATA_TOO_LONG') {
                return res.status(422).json({ message: 'Les données fournies sont invalides.' });
            }

            // Erreur générique serveur
            return res.status(500).json({ message: 'Erreur lors de la mise à jour du livre.' });
        }

        // Vérification si aucun livre n'a été affecté (cas où l'ID est incorrect)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }

        res.json({ message: 'Livre mis à jour avec succès.' });
    });
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res) => {
    const bookId = req.params.id;
    const query = 'DELETE FROM books WHERE id = ?';
    
    db.query(query, [bookId], (err, result) => {
        if (err) {
            console.error('Erreur SQL lors de la suppression du livre :', err);

            // Gestion des erreurs spécifiques, par exemple, des violations de clés étrangères si le livre est référencé dans une autre table
            if (err.code === 'ER_ROW_IS_REFERENCED') {
                return res.status(409).json({ message: 'Le livre ne peut pas être supprimé car il est référencé dans d\'autres données.' });
            }

            // Erreur générique serveur
            return res.status(500).json({ message: 'Erreur lors de la suppression du livre.' });
        }

        // Vérification si aucun livre n'a été affecté
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }

        // Réponse en cas de succès
        res.json({ message: 'Livre supprimé avec succès.' });
    });
};

exports.getRecentBooks = (req, res) => {
    const query = 'SELECT * FROM books ORDER BY created_at DESC LIMIT 4';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL lors de la récupération des livres récents :', err);

            // Cas où la requête échoue pour des raisons spécifiques (exemple : syntaxe SQL invalide, ou problème de connexion)
            if (err.code === 'ER_PARSE_ERROR') {
                return res.status(400).json({ message: 'Erreur de syntaxe dans la requête SQL.' });
            }

            // Autres erreurs génériques du serveur
            return res.status(500).json({ message: 'Erreur lors de la récupération des livres récents.' });
        }

        // Si aucun livre n'est trouvé, vous pouvez aussi retourner une réponse adaptée
        if (results.length === 0) {
            return res.status(404).json({ message: 'Aucun livre récent trouvé.' });
        }

        // Retourne les résultats obtenus si tout est bon
        res.json(results);
    });
};
