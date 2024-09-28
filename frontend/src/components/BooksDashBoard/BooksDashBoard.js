import React, { useEffect, useState } from "react";
import { getAllBooks, createBook, getAllGenres } from "../../config/api";
import './BooksDashBoard.css';

function BooksDashboard() {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]); // État pour les genres
    const [showForm, setShowForm] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        genre_id: '',
        publication_date: '',
        isbn: '',
        copies_available: '',
        description: '',
        availability: true,
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks();
                setBooks(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des livres:', error);
            }
        };

        const fetchGenres = async () => {
            try {
                const data = await getAllGenres(); // Utilisez la fonction créée
                setGenres(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des genres:', error);
            }
        };

        fetchBooks();
        fetchGenres(); // Appel de la fonction pour récupérer les genres
    }, []);

    const handleInputChange = (e) => {
        setNewBook({
            ...newBook,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateBook = async (e) => {
        e.preventDefault();
        try {
            await createBook(newBook);
            alert('Livre créé avec succès');
            setShowForm(false);
            setNewBook({
                title: '',
                author: '',
                genre_id: '',
                publication_date: '',
                isbn: '',
                copies_available: '',
                description: '',
                availability: true,
            });
            const updatedBooks = await getAllBooks();
            setBooks(updatedBooks);
        } catch (error) {
            console.error('Erreur lors de la création du livre:', error);
            alert('Erreur lors de la création du livre');
        }
    };

    return (
        <div className="books-dashboard">
            <h1>Tableau de Bord - Gestion des Livres</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>Genre</th>
                        <th>Date de Publication</th>
                        <th>ISBN</th>
                        <th>Exemplaires Disponibles</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre_name}</td>
                            <td>{book.publication_date}</td>
                            <td>{book.isbn}</td>
                            <td>{book.copies_available}</td>
                            <td>{book.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="button-container">
                <button className="create-book-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Annuler' : 'Créer un livre'}
                </button>
            </div>

            {showForm && (
                <form className="create-book-form" onSubmit={handleCreateBook}>
                    <div>
                        <label>Titre</label>
                        <input
                            type="text"
                            name="title"
                            value={newBook.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Auteur</label>
                        <input
                            type="text"
                            name="author"
                            value={newBook.author}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Genre</label>
                        <select
                            name="genre_id"
                            value={newBook.genre_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Sélectionnez un genre</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Date de Publication</label>
                        <input
                            type="date"
                            name="publication_date"
                            value={newBook.publication_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>ISBN</label>
                        <input
                            type="text"
                            name="isbn"
                            value={newBook.isbn}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Exemplaires Disponibles</label>
                        <input
                            type="number"
                            name="copies_available"
                            value={newBook.copies_available}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={newBook.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="create-book-button">
                        <button type="submit">Créer le livre</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default BooksDashboard;