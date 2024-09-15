const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const loansRoutes = require('./routes/loansRoutes');
const booksRoutes = require('./routes/booksRoutes');
const genresRoutes = require('./routes/genresRoutes');

const app = express();

// Middleware pour analyser les corps des requêtes en JSON
app.use(bodyParser.json());

// Utiliser les routes définies
app.use('/api', userRoutes);
app.use('/api', loansRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/genres', genresRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});