const db = require('../config/db');

// Fonction pour ajouter un nouvel emprunt
exports.createLoan = (req, res) => {
    const {
        user_id,
        book_id,
        loan_date,
        return_date,
        status
    } = req.body;

    const query = `
        INSERT INTO loans (
            user_id,
            book_id,
            loan_date,
            return_date,
            status
        ) VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [
        user_id,
        book_id,
        loan_date,
        return_date,
        status
    ], (err, result) => {
        if (err) {
            console.error('Erreur SQL :', err); // Log l'erreur pour diagnostic
            return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'emprunt.' });
        }
        res.status(201).json({ message: 'Emprunt ajouté avec succès.' });
    });
};
