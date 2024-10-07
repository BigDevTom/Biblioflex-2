import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation(); // Hook pour obtenir l'URL actuelle
  const navigate = useNavigate(); // Utiliser pour la redirection

  // Vérifier si l'utilisateur est connecté (présence du token)
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token pour déconnecter l'utilisateur
    localStorage.removeItem('user'); // Supprimer les données utilisateur
    navigate('/'); // Redirection vers la page d'accueil
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">Biblioflex</Link>
      <nav className="links">
        {/* Afficher les liens en fonction de l'état de connexion */}
        {isAuthenticated ? (
          <>
             {location.pathname === '/' ? (
              <Link to="/admin">Tableau de bord</Link>
            ) : (
              <Link to="/">Accueil</Link>
            )}
              <span className="logout-link" onClick={handleLogout}>Déconnexion</span>
          </>
        ) : (
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