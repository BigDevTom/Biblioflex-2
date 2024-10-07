import React, { useEffect, useState } from "react";
import { getAllUsers, registerUser } from "../../config/api";
import './AdminDashBoard.css';

function AdminDashBoard() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        first_name: '',
        email: '',
        password: '',
        role: 'ROLE_USER' // valeur par défaut
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        });
    }

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await registerUser(newUser);
            alert('Utilisateur créé avec succès');
            setShowForm(false);
            setNewUser({
                name: '',
                first_name: '',
                email: '',
                password: '',
                role: 'ROLE_USER' // Réinitialiser la valeur par défaut
            });
            const updatedUsers = await getAllUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
        }
    }

    return (
        <div className="admin-dashboard">
            <h1>Tableau de Bord - Gestion des utilisateurs</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.first_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="create-user-button" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Annuler' : 'Créer un utilisateur'}
            </button>

            {showForm && (
                <form className="create-user-form" onSubmit={handleCreateUser}>
                    <label>
                        Nom:
                        <input
                            type="text"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Prénom:
                        <input
                            type="text"
                            name="first_name"
                            value={newUser.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Mot de passe:
                        <input
                            type="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Rôle:
                        <select
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                        >
                            <option value="ROLE_USER">Utilisateur</option>
                            <option value="ROLE_ADMIN">Administrateur</option>
                        </select>
                    </label>
                    <button type="submit">Créer</button>
                </form>
            )}
        </div>
    );
}

export default AdminDashBoard;