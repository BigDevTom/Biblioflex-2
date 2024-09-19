import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation(); // Hook pour obtenir l'URL actuelle

  return (
    <header className="navbar">
      <div className="logo">Biblioflex</div>
      <nav className="links">
        <Link to="/login">Connexion</Link>
        {/* Si l'utilisateur est sur la page d'inscription, afficher "Accueil" */}
        {location.pathname === '/register' ? (
          <Link to="/">Accueil</Link>
        ) : (
          <Link to="/register">Inscription</Link>
        )}
      </nav>
    </header>
  );
}
export default Header;