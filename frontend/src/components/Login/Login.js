import React, { useState } from 'react';
import './Login.css';
import { loginUser } from '../../config/api'; // Assurez-vous d'avoir la fonction d'API pour la connexion
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const data = await loginUser(formData); // Récupération directe des données

            if (data) { // Vérifie si les données sont présentes
                const token = data.token; // Récupération du token
                const userRole = data.user.role; // Récupération du rôle de l'utilisateur

                // Stocke le token et les données de l'utilisateur dans le localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({ role: userRole }));

                // Redirection en fonction du rôle
                if (userRole === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else if (userRole === 'ROLE_USER') {
                    navigate('/user');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            setMessage('Une erreur s\'est produite. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email :
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Mot de passe :
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
            {message && <p>{message}</p>}
            <p>Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous ici</Link></p>
        </div>
    );
}

export default Login;