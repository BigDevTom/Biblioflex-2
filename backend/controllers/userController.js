const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); // ou bcrypt si tu utilises l'implémentation native

// Fonction pour créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  const { name, first_name, email, password, role } = req.body;

  if (!name || !first_name || !email || !password || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    User.create(name, first_name, email, hashedPassword, role, (err, result) => {
      if (err) {
        console.error('Erreur lors de la création de l\'utilisateur : ', err);
        return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
      }
      res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    });
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe : ', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Fonction pour connecter un utilisateur
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  User.findByEmail(email, (err, user) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur : ', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    // Comparer le mot de passe fourni avec le mot de passe haché
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Erreur lors de la comparaison des mots de passe : ', err);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
      }

      if (isMatch) {
        // Authentification réussie
        res.status(200).json({ message: 'Connexion réussie.' });
      } else {
        // Mot de passe incorrect
        res.status(401).json({ message: 'Mot de passe incorrect.' });
      }
    });
  });
};

exports.getAllUsers = (req, res) => {
  User.getAllUsers((err, users) => {
    if(err) {
      console.error('Erreur lors de la récupération des utilisateurs : ', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
    res.status(200).json(users);
  });
};