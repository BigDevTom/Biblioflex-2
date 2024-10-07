import React, { useEffect, useState } from 'react';
import { getAllBooks } from '../../config/api';
import './BookList.css';

function BookList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleBorrow = (bookId) => {
        // Logique pour emprunter le livre
        console.log(`Demande d'emprunt pour le livre ID: ${bookId}`);
        // Ajoutez la logique d'emprunt ici
    };

    if (loading) return <p>Chargement des livres...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="book-list">
            <h1>Glossaire des Livres</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <strong>{book.title}</strong> par {book.author} - 
                        {book.availability ? ' Disponible' : ' Indisponible'}
                        <button onClick={() => handleBorrow(book.id)} disabled={!book.availability}>
                            {book.availability ? 'Emprunter' : 'Indisponible'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookList;