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

exports.createUser = (req, res) => {
    const { name, first_name, email, password, role } = req.body;

    // Validation des champs requis
    if (!name || !first_name || !email || !password || !role) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Vérification de l'existence de l'utilisateur
    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            console.error('Erreur de connexion à la base de données :', err);
            return res.status(503).json({ message: 'Erreur de connexion à la base de données. Veuillez réessayer plus tard.' });
        }

        if (existingUser) {
            return res.status(409).json({ message: 'Cet e-mail est déjà utilisé.' });
        }

        // Hachage du mot de passe
        bcrypt.hash(password, (err, hashedPassword) => {
            if (err) {
                console.error('Erreur lors du hachage du mot de passe :', err);
                
                // Code d'erreur 500, car cela indique un problème technique dans le processus de hachage
                return res.status(500).json({ message: 'Erreur technique lors du traitement du mot de passe.' });
            }

            // Création de l'utilisateur
            User.create(name, first_name, email, hashedPassword, role, (err, result) => {
                if (err) {
                    console.error('Erreur lors de la création de l\'utilisateur :', err);

                    // Gestion d'erreurs spécifiques de la base de données
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ message: 'Conflit : cet utilisateur existe déjà.' });
                    } else if (err.code === 'ER_DATA_TOO_LONG') {
                        return res.status(422).json({ message: 'Données invalides : certains champs sont trop longs.' });
                    } else if (err.code === 'ER_BAD_NULL_ERROR') {
                        return res.status(422).json({ message: 'Données invalides : certains champs obligatoires sont manquants.' });
                    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                        // Problème de contrainte de clé étrangère, par exemple, si le rôle n'existe pas
                        return res.status(422).json({ message: 'Données invalides : rôle non reconnu.' });
                    } else {
                        return res.status(503).json({ message: 'Erreur de service temporaire. Veuillez réessayer plus tard.' });
                    }
                }

                // Génération du token et réponse en cas de succès
                const token = generateToken(result);
                res.status(201).json({ message: 'Utilisateur créé avec succès.', token });
            });
        });
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    // Validation des champs requis
    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.error('Erreur lors de la recherche de l\'utilisateur :', err);

            // Gestion des erreurs de la base de données
            if (err.code === 'ECONNREFUSED') {
                return res.status(503).json({ message: 'Service temporairement indisponible. Veuillez réessayer plus tard.' });
            } else {
                return res.status(500).json({ message: 'Erreur interne inattendue.' });
            }
        }

        if (!user) {
            // Utilisateur non trouvé
            return res.status(401).json({ message: 'Utilisateur non trouvé.' });
        }

        // Comparaison des mots de passe
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Erreur lors de la comparaison des mots de passe :', err);

                // Vérifier le type d'erreur pour retourner un code approprié
                if (err.message && err.message.includes("Invalid salt")) { 
                    return res.status(422).json({ message: 'Erreur de traitement des données du mot de passe.' });
                } else {
                    return res.status(500).json({ message: 'Erreur interne lors de la vérification du mot de passe.' });
                }
            }

            if (isMatch) {
                // Authentification réussie, générer un token avec le rôle de l'utilisateur
                const token = generateToken(user);

                // Retourner le token et les informations de l'utilisateur, y compris le rôle
                return res.status(200).json({
                    message: 'Connexion réussie.',
                    token,
                    user: {
                        email: user.email,
                        role: user.role // Retourner correctement le rôle ici
                    }
                });
            } else {
                // Mot de passe incorrect
                return res.status(401).json({ message: 'Mot de passe incorrect.' });
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
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expiré.' });
            }
            return res.status(401).json({ message: 'Token invalide.' });
        }
    
        req.user = decoded;  // Attacher l'utilisateur décodé à la requête
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