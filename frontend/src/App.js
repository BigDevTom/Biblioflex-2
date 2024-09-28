import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Inscription from './pages/Inscription';
import './reset.css';
import './App.css';
import AdminDashBoard from './components/AdminDashBoard/AdminDashBoard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Inscription />} />
          <Route path="/admin" element={<AdminDashBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;