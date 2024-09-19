import React, { useState } from 'react';
import './Register.css';
import { registerUser } from '../../config/api';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        first_name: '',
        email: '',
        password: '',
        role: 'ROLE_USER', //Par défaut le role de l'utilisateur
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            if (response.status === 201) {
                setMessage('Inscription réussie !');
            } else {
                setMessage('Erreur lors de l\'inscription.');
            }
        } catch (error) {
            setMessage('Une erreur s\'est produite. Veuillez réessayer.')
        }
    };

    return (
        <div className="register-container">
          <h1>Inscription</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Nom :
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
              Prénom :
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </label>
            <label>
              Email :
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
              Mot de passe :
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </label>
            <button type="submit">S'inscrire</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      );
}

export default Register;