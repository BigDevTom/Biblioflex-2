import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importez Link depuis react-router-dom
import { getAllBooks, createBook, deleteBook, getAllGenres } from "../../config/api"; // Importez deleteBook
import ConfirmationDialog from "../ConfirmDialog/ConfirmDialog";
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
    
    // État pour la boîte de dialogue de confirmation
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [bookIdToDelete, setBookIdToDelete] = useState(null);

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

    const getGenreName = (id) => {
        const genre = genres.find((genre) => genre.id === id);
        return genre ? genre.name : 'Inconnu'; // Si le genre n'est pas trouvé, retourne 'Inconnu'
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

    // Fonction pour gérer la demande de suppression
    const handleDeleteRequest = (bookId) => {
        setBookIdToDelete(bookId); // Définir l'ID du livre à supprimer
        setDialogOpen(true); // Ouvrir la boîte de dialogue de confirmation
    };

    // Fonction pour supprimer un livre
    const handleDeleteConfirmation = async () => {
        if (bookIdToDelete) {
            try {
                await deleteBook(bookIdToDelete); // Appeler la fonction pour supprimer le livre
                setBooks(books.filter(book => book.id !== bookIdToDelete)); // Mettre à jour la liste après suppression
                alert('Livre supprimé avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression du livre:', error);
                alert('Erreur lors de la suppression du livre');
            } finally {
                setDialogOpen(false); // Fermer la boîte de dialogue
                setBookIdToDelete(null); // Réinitialiser l'ID du livre à supprimer
            }
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {books.map((book) => (
                <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{getGenreName(book.genre_id)}</td>
                    <td>{book.publication_date}</td>
                    <td>{book.isbn}</td>
                    <td>{book.copies_available}</td>
                    <td>{book.description}</td>
                    <td>
                        <Link to={`/update-book/${book.id}`} className="edit-link">
                            Modifier
                        </Link>
                        <button onClick={() => handleDeleteRequest(book.id)}>Supprimer</button> {/* Bouton de suppression */}
                    </td>
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

            {/* Boîte de dialogue de confirmation */}
            <ConfirmationDialog 
                isOpen={isDialogOpen} 
                onConfirm={handleDeleteConfirmation} 
                onCancel={() => setDialogOpen(false)} 
                message="Êtes-vous sûr de vouloir supprimer ce livre ?" 
            />
        </div>
    );
}

export default BooksDashboard;