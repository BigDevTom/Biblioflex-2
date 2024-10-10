const db = require('../config/db');

// Fonction pour ajouter un nouvel emprunt
exports.createLoan = (req, res) => {
    const { user_id, book_id, loan_date, return_date, status } = req.body;

    const checkBookQuery = `
        SELECT * FROM loans 
        WHERE book_id = ? AND status = 'emprunté'
    `;

    db.query(checkBookQuery, [book_id], (err, result) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ message: 'Erreur lors de la vérification du livre.' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'Ce livre est déjà emprunté.' });
        }

        const insertQuery = `
            INSERT INTO loans (
                user_id,
                book_id,
                loan_date,
                return_date,
                status
            ) VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [user_id, book_id, loan_date, return_date, status], (err, result) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'emprunt.' });
            }
            res.status(201).json({ message: 'Emprunt ajouté avec succès.' });
        });
    });
};

// Fonction pour obtenir les emprunts en cours d'un utilisateur
exports.getCurrentLoansByUser = (req, res) => {
    const userId = req.params.user_id;
    const query = `
        SELECT loans.*, books.title, books.author
        FROM loans
        JOIN books ON loans.book_id = books.id
        WHERE loans.user_id = ? AND (loans.status = 'emprunté' OR loans.status = 'en retard')
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération des emprunts en cours.' });
        }

        res.json(results);
    });
};

// Fonction pour obtenir les emprunts retournés d'un utilisateur
exports.getReturnedLoansByUser = (req, res) => {
    const userId = req.params.user_id;
    const query = `
        SELECT loans.*, books.title, books.author
        FROM loans
        JOIN books ON loans.book_id = books.id
        WHERE loans.user_id = ? AND loans.status = 'retourné'
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération des emprunts retournés.' });
        }

        res.json(results);
    });
};