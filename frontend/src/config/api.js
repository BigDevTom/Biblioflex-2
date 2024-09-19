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