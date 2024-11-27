import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <div className="recent-books">
            <h2>Nouveautés</h2>
            <ul>
                {recentBooks.map(books => (
                    <li key={books.id}>
                        <strong>{books.title}</strong> par {books.author}
                    </li>
                ))}
            </ul>
            <div className="glossary-link">
                <Link to="/glossary">Voir le catalogue</Link>
            </div>
        </div>
    );
}

export default RecentBooks;