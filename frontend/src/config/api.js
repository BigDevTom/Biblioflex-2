const API_URL = 'http://localhost:3000/api';

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
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

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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