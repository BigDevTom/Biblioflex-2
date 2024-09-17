import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="navbar">
      <div className="logo">Biblioflex</div>
      <nav className="links">
        <a href="/login">Connexion</a>
        <a href="/register">Inscription</a>
      </nav>
    </header>
  );
}

export default Header;