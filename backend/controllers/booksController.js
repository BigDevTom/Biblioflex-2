const db = require('../config/db');

// Fonction pour obtenir tous les livres
exports.getAllBooks = (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des livres.' });
        res.json(results);
    });
};

// Fonction pour obtenir un livre par son ID
exports.getBookById = (req, res) => {
    const bookId = req.params.id;
    const query = 'SELECT * FROM books WHERE id = ?';
    db.query(query, [bookId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la récupération du livre.' });
        if (result.length === 0) return res.status(404).json({ message: 'Livre non trouvé.' });
        res.json(result[0]);
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
            return res.status(500).json({ message: 'Erreur lors de l\'ajout du livre.' });
        }
        res.status(201).json({ message: 'Livre ajouté avec succès.' });
    });
};


// Fonction pour mettre à jour un livre existant
exports.updateBook = (req, res) => {
    const bookId = req.params.id;
    const { title, author, genre_id, publication_date, isbn, copies_available, description, availability } = req.body;
    const query = 'UPDATE books SET title = ?, author = ?, genre_id = ?, publication_date = ?, isbn = ?, copies_available = ?, description = ?, availability = ? WHERE id = ?';
    db.query(query, [title, author, genre_id, publication_date, isbn, copies_available, description, availability, bookId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour du livre.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Livre non trouvé.' });
        res.json({ message: 'Livre mis à jour avec succès.' });
    });
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res) => {
    const bookId = req.params.id;
    const query = 'DELETE FROM books WHERE id = ?';
    db.query(query, [bookId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la suppression du livre.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Livre non trouvé.' });
        res.json({ message: 'Livre supprimé avec succès.' });
    });
};
