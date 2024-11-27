import React, { useEffect, useState } from 'react';
import { getAllBooks, createLoan } from '../../config/api';
import './BookList.css';

function BookList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const allBooks = await getAllBooks();
                setBooks(allBooks);
            } catch (err) {
                setError('Erreur lors de la récupération des livres.');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleBorrow = async (bookId) => {
        try {
            // ID utilisateur (peut être extrait de l'état ou du token déchiffré)
            const userId = getUserIdFromToken(); // Fonction qui extrait l'ID utilisateur du token

            const loanData = {
                user_id: userId,
                book_id: bookId,
            };

            const response = await createLoan(loanData);

            setSuccessMessage(response.message || 'Emprunt créé avec succès !');
            setError('');

            // Met à jour la disponibilité du livre localement pour éviter les appels excessifs à l'API
            setBooks(books.map(book => 
                book.id === bookId ? { ...book, availability: false } : book
            ));
        } catch (error) {
            setError(error.message || 'Erreur lors de la création de l\'emprunt.');
            setSuccessMessage('');
        }
    };

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.id; // Assurez-vous que l'ID est bien contenu dans le token
    };

    if (loading) return <p>Chargement des livres...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="book-list">
            <h1>Catalogue des Livres</h1>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <strong>{book.title}</strong> par {book.author} - 
                        {book.availability ? ' Disponible' : ' Indisponible'}
                        <button 
                            onClick={() => handleBorrow(book.id)} 
                            disabled={!book.availability}
                        >
                            {book.availability ? 'Emprunter' : 'Indisponible'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookList;