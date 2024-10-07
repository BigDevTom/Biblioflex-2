import React, { useEffect, useState } from "react";
import { getRecentBooks } from '../../config/api';
import './RecentBooks.css';

function RecentBooks() {
    const [recentBooks, setRecentBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecentBooks = async () => {
            try {
                const books = await getRecentBooks();
                setRecentBooks(books);
            } catch (err) {
                setError('Erreur lors de la récupération des livres récents');
            } finally {
                setLoading(false);
            }
        };

        fetchRecentBooks();
    }, []);

    if (loading) return <p>chargement des livres récents...</p>;
    if (error) return <p>{error}</p>

    return (
        <div className="recent-books"> {/* Ajouter la classe ici */}
            <h2>Nouveautés</h2>
            <ul>
                {recentBooks.map(book => (
                    <li key={book.id}>
                        <strong>{book.title}</strong> par {book.author}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecentBooks;