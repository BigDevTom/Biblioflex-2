import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation(); // Hook pour obtenir l'URL actuelle
  const navigate = useNavigate(); // Utiliser pour la redirection

  // Vérifier si l'utilisateur est connecté (présence du token)
  const isAuthenticated = localStorage.getItem('token') !== null;
  const user = JSON.parse(localStorage.getItem('user')); // Récupère les données de l'utilisateur du localStorage
  const userRole = user ? user.role : null; // Vérifie si l'utilisateur a un rôle

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token pour déconnecter l'utilisateur
    localStorage.removeItem('user'); // Supprimer les données utilisateur
    navigate('/'); // Redirection vers la page d'accueil
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">Biblioflex</Link>
      <nav className="links">
        {isAuthenticated ? (
          <>
            {userRole === 'ROLE_ADMIN' ? (
              // Menu pour les admins
              <>
                {location.pathname === '/' ? (
                  <Link to="/admin">Tableau de bord</Link>
                ) : location.pathname.startsWith('/update') ? (
                  <Link to="/admin">Retour au tableau de bord</Link>
                ) : (
                  <Link to="/">Accueil</Link>
                )}
              </>
            ) : (
              // Menu pour les utilisateurs standards
              <>
                {location.pathname === '/' ? (
                  <Link to="/user">Espace Utilisateur</Link>
                ) : (
                  <Link to="/">Accueil</Link>
                )}
              </>
            )}
            <span className="logout-link" onClick={handleLogout}>Déconnexion</span>
          </>
        ) : (
          // Menu pour les utilisateurs non connectés
          <>
            {location.pathname === '/login' ? (
              <Link to="/">Accueil</Link>
            ) : (
              <Link to="/login">Connexion</Link>
            )}
            {location.pathname === '/register' ? (
              <Link to="/">Accueil</Link>
            ) : (
              <Link to="/register">Inscription</Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;