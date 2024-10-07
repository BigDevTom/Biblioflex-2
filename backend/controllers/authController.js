const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config(); // Charger les variables d'environnement

// Générer un token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Fonction enregistrement d'un utilisateur
exports.createUser = async (req, res) => {
    const { name, first_name, email, password, role } = req.body;

    if(!name || !first_name || !email || !password || !role) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        User.create(name, first_name, email, hashedPassword, role, (err, result) => {
            if(err) {
                console.error('Erreur lors de la création de l\'utilisateur :', err);
                return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
            }

            const token = generateToken(result); // Générer un token
            res.status(201).json({ message: 'Utilisateur créé avec succès.', token });
        });
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

// Fonction de connexion d'un utilisateur
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.error('Erreur lors de la recherche de l\'utilisateur :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé.' });
        }

        // Comparer le mot de passe fourni avec le mot de passe haché
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Erreur lors de la comparaison des mots de passe :', err);
                return res.status(500).json({ message: 'Erreur interne du serveur.' });
            }

            if (isMatch) {
                // Authentification réussie, générer un token avec le rôle de l'utilisateur
                const token = generateToken(user);

                // Retourner le token et les informations de l'utilisateur, y compris le rôle
                res.status(200).json({
                    message: 'Connexion réussie.',
                    token,
                    user: {
                        email: user.email,
                        role: user.role // Retourner correctement le rôle ici
                    }
                });
            } else {
                res.status(401).json({ message: 'Mot de passe incorrect.' });
            }
        });
    });
};

// Middleware pour protéger les routes
exports.protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Accès non autorisé. Aucun token fourni.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide ou expiré.' });
        }

        req.user = decoded; // Attacher les infos utilisateur décodées à req
        next();
    });
};

// Middleware pour vérifier le rôle d'un administrateur
exports.isAdmin = (req, res, next) => {
    if(req.user.role !== 'ROLE_ADMIN') {
        return res.status(403).json({ message: 'Accès refusé. Administrateurs uniquement.'});
    }
    next();
};