const db = require('../config/db');

exports.createLoan = (req, res) => {
    console.log("Requête de création d'emprunt reçue :", req.body);
    const { user_id, book_id } = req.body;

    // Validation des entrées
    if (!user_id || !book_id) {
        return res.status(400).json({ message: 'L\'ID de l\'utilisateur et du livre sont requis.' });
    }

    // Vérification de l'existence du livre
    const checkBookQuery = `SELECT * FROM books WHERE id = ?`;
    db.query(checkBookQuery, [book_id], (err, result) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ message: 'Erreur lors de la vérification du livre.' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Le livre n\'existe pas.' });
        }

        // Vérification de l'existence de l'utilisateur
        const checkUserQuery = `SELECT * FROM users WHERE id = ?`;
        db.query(checkUserQuery, [user_id], (err, result) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ message: 'Erreur lors de la vérification de l\'utilisateur.' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'L\'utilisateur n\'existe pas.' });
            }

            // Vérification si le livre est déjà emprunté
            const checkBookLoanQuery = `
                SELECT * FROM loans 
                WHERE book_id = ? AND status = 'emprunté'
            `;
            db.query(checkBookLoanQuery, [book_id], (err, result) => {
                if (err) {
                    console.error('Erreur SQL :', err);
                    return res.status(500).json({ message: 'Erreur lors de la vérification du livre.' });
                }

                if (result.length > 0) {
                    return res.status(400).json({ message: 'Ce livre est déjà emprunté.' });
                }

                // Insertion du nouvel emprunt avec des valeurs par défaut pour la date et le statut
                const loanDate = new Date();
                const returnDate = new Date();
                returnDate.setDate(loanDate.getDate() + 14); // Définit la date de retour dans 2 semaines

                const insertQuery = `
                    INSERT INTO loans (
                        user_id,
                        book_id,
                        loan_date,
                        return_date,
                        status
                    ) VALUES (?, ?, ?, ?, 'emprunté')
                `;
                db.query(insertQuery, [user_id, book_id, loanDate, returnDate], (err, result) => {
                    if (err) {
                        console.error('Erreur SQL :', err);
                        return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'emprunt.' });
                    }
                    res.status(201).json({ message: 'Emprunt ajouté avec succès.' });
                });
            });
        });
    });
};

// Fonction pour obtenir les emprunts en cours d'un utilisateur
exports.getCurrentLoansByUser = (req, res) => {
    const userId = req.user.id;
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

        // Mise à jour du statut des emprunts en retard
        const currentDate = new Date();
        const updateQuery = `
            UPDATE loans 
            SET status = 'en retard' 
            WHERE status = 'emprunté' AND return_date < ?
        `;
        db.query(updateQuery, [currentDate], (err) => {
            if (err) {
                console.error('Erreur de mise à jour des emprunts en retard :', err);
                return res.status(500).json({ message: 'Erreur lors de la mise à jour des emprunts en retard.' });
            }
        });

        res.json(results);
    });
};

exports.getReturnedLoansByUser = (req, res) => {
    console.log(req);
    const userId = req.user.id;
    console.log(userId);
    console.log('Demande des emprunts retournés pour l\'utilisateur:', userId);

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

        console.log('Emprunts retournés récupérés:', results);
        
        res.json(results);
    });
};