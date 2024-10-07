const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const loansRoutes = require('./routes/loansRoutes');
const booksRoutes = require('./routes/booksRoutes');
const genresRoutes = require('./routes/genresRoutes');

dotenv.config();

const app = express();

// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:9000', // Autorise uniquement les requêtes venant de localhost:3001 (ton frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Autorise ces méthodes HTTP
  credentials: true // Si tu utilises des cookies
}));

// Middleware pour analyser les corps des requêtes en JSON
app.use(bodyParser.json());

// Utiliser les routes définies
app.use('/api/auth', authRoutes); // Routes d'authentification
app.use('/api/users', userRoutes); // Routes liées aux utilisateurs
app.use('/api/loans', loansRoutes); // Routes liées aux prêts
app.use('/api/books', booksRoutes); // Routes liées aux livres
app.use('/api/genres', genresRoutes); // Routes liées aux genres

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
