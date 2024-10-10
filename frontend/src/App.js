import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion'
import './reset.css';
import './App.css';
import Admin from './pages/Admin';
import Glossary from './pages/Glossary';
import User from './pages/User';
import Update from './pages/Update';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Connexion />} />
          <Route path="/register" element={<Inscription />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/glossary" element={<Glossary />} /> 
          <Route path="/user" element={<User />} />
          <Route path="/update-book/:id" element={<Update />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;