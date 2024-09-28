import React, { useEffect, useState } from "react";
import { getAllUsers, registerUser } from "../../config/api";
import './AdminDashBoard.css';

function AdminDashBoard() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({
        name:'',
        first_name:'',
        email:'',
        password:'',
        role:'ROLE_USER' //valeur par défaut
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
            alert('Utilisateur crée avec succès');
            setShowForm(false);
            setNewUser({
                name:'',
                first_name:'',
                email:'',
                password:'',
                role:'ROLE_USER' // Réinitialiser la valeur par défaut
            });
            const updatedUsers = await getAllUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            alert('Erreur lors de la création de l\'utilisateur');
        }
    }

    return (
        <div className="admin-dashboard">
            <h1>Tableau de Bord - Gestion des utlisateurs</h1>
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
                    {users.map((users) => (
                        <tr key={users.id}>
                            <td>{users.id}</td>
                            <td>{users.name}</td>
                            <td>{users.first_name}</td>
                            <td>{users.email}</td>
                            <td>{users.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="create-user-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Annuler' : 'Créer un utilisateur'}
            </button>

            {showForm && (
                <form className="create-user-form" onSubmit={handleCreateUser}>
                    <div>
                        <label>Nom</label>
                        <input
                            type="text"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Prénom</label>
                        <input
                            type="text"
                            name="first_name"
                            value={newUser.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Rôle</label>
                        <select
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="ROLE_USER">Utilisateur</option>
                            <option value="ROLE_ADMIN">Administrateur</option>
                        </select>
                    </div>
                    <button type="submit">Créer l'utilisateur</button>
                </form>
            )}
        </div>
    );
}

export default AdminDashBoard;