import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById, updateBook } from '../../config/api';
import './UpdateBook.css';

const UpdateBook = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre_id: '',
    publication_date: '',
    isbn: '',
    copies_available: '',
    description: '',
    availability: 'Disponible' // Par défaut, on initialise sur 'Disponible'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fonction pour formater la date au bon format YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fonction pour récupérer les informations du livre via l'ID
  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const book = await getBookById(id); 
      // Formatage de la date avant de la stocker dans l'état
      setBookData({
        ...book,
        publication_date: formatDate(book.publication_date)
      });
    } catch (err) {
      setError('Erreur lors de la récupération du livre');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fonction pour gérer la soumission du formulaire de mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedBookData = {
        ...bookData,
        publication_date: formatDate(bookData.publication_date), // S'assure que la date est formatée correctement
      };
      await updateBook(id, formattedBookData);
      setSuccessMessage('Livre mis à jour avec succès');
    } catch (err) {
      setError('Erreur lors de la mise à jour du livre');
    }
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Utilisation de useEffect pour récupérer les données du livre au montage du composant
  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!bookData || !bookData.title) {
    return <div>Erreur: Les données du livre ne sont pas disponibles.</div>;
  }

  return (
    <div className="update-book-container">
      <h2>Mettre à jour le livre</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input
            type="text"
            name="title"
            value={bookData.title || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Auteur:</label>
          <input
            type="text"
            name="author"
            value={bookData.author || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Genre:</label>
          <input
            type="number"
            name="genre_id"
            value={bookData.genre_id || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date de publication:</label>
          <input
            type="date"
            name="publication_date"
            value={bookData.publication_date || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ISBN:</label>
          <input
            type="text"
            name="isbn"
            value={bookData.isbn || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Copies disponibles:</label>
          <input
            type="number"
            name="copies_available"
            value={bookData.copies_available || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={bookData.description || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Disponibilité:</label>
          <select
            name="availability"
            value={bookData.availability}
            onChange={handleChange}
            required
          >
            <option value="Disponible">Disponible</option>
            <option value="Indisponible">Indisponible</option>
          </select>
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateBook;