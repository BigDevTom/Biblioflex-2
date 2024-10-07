const API_URL = 'http://localhost:3000/api';

// Récupérer le token JWT depuis le localStorage
const getToken = () => {
    return localStorage.getItem('token');
}

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        return response;
    } catch (error) {
        console.error('Erreur lors de l\'inscription', error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la connexion');
        }

        const data = await response.json();

        localStorage.setItem('token', data.token); // Stocker le token dans le localStorage

        // Vérifiez que le rôle de l'utilisateur est présent dans la réponse
        if (data.user && data.user.role) {
            localStorage.setItem('user', JSON.stringify({ role: data.user.role })); // Stocker le rôle dans le localStorage
        } else {
            console.error('Le rôle de l\'utilisateur n\'est pas présent dans la réponse.');
        }

        return data; // Assurez-vous que le backend renvoie les données de l'utilisateur (incluant le rôle)
    } catch (error) {
        console.error('Erreur lors de la connexion', error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/users/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Ajouter le token dans l'en-tête
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
        throw error;
    }
};

export const getAllBooks = async () => {
    try {
        const response = await fetch(`${API_URL}/books`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des livres');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des livres', error);
        throw error;
    }
};

export const createBook = async (bookData) => {
    try {
        const token = getToken(); // Récupérer le token
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Ajouter le token dans l'en-tête
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du livre');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l\'ajout du livre', error);
        throw error;
    }
};

export const getAllGenres = async () => {
    try {
        const response = await fetch(`${API_URL}/genres`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des genres');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des genres', error);
        throw error;
    }
};

export const getRecentBooks = async () => {
    try {
        const response = await fetch(`${API_URL}/books/recent`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des livres récents');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des livres récents', error);
        throw error;
    }
};