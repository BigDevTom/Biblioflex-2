import React, { useEffect, useState } from 'react';
import { getCurrentLoansByUser, getReturnedLoansByUser } from '../../config/api';
import { Link } from 'react-router-dom';
import './UserLoans.css';

function UserLoans() {
    const [currentLoans, setCurrentLoans] = useState([]);
    const [returnedLoans, setReturnedLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Récupère l'ID utilisateur stocké dans le localstorage
    const userId = JSON.parse(localStorage.getItem('user')).id;

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                // Récupérer les emprunts en cours et retournés
                const current = await getCurrentLoansByUser(userId);
                const returned = await getReturnedLoansByUser(userId);

                setCurrentLoans(current);
                setReturnedLoans(returned);
            } catch (err) {
                setError('Erreur lors de la récupération des emprunts');
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, [userId]);

    if (loading) return <p>Chargement des emprunts...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='user-loans'>
            <h2>Mes emprunts</h2>

            <div className="loans-container">
                <div className="loans-section">
                    <h3>Emprunts en cours</h3>
                    {currentLoans.length > 0 ? (
                        <ul>
                            {currentLoans.map((loan) => (
                                <li key={loan.id}>
                                    <strong>{loan.title}</strong> par {loan.author}
                                    <br />
                                    Date d'emprunt : {loan.loan_date}
                                    <br />
                                    Date de retour prévue : {loan.return_date}
                                    <br />
                                    Statut : {loan.status}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Vous n'avez pas d'emprunts en cours.</p>
                    )}
                </div>
                <div className="loans-section">
                    <h3>Emprunts retournés</h3>
                    {returnedLoans.length > 0 ? (
                        <ul>
                            {returnedLoans.map((loan) => (
                                <li key={loan.id}>
                                    <strong>{loan.title}</strong> par {loan.author}
                                    <br />
                                    Date d'emprunt : {loan.loan_date}
                                    <br />
                                    Date de retour : {loan.return_date}
                                    <br />
                                    Statut : {loan.status}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Vous n'avez pas encore retourné d'emprunts.</p>
                    )}
                </div>
            </div>
            <div className="glossary-link">
                <p>Vous voulez emprunter un livre ? <Link to="/glossary">Consultez notre liste de livres</Link>.</p>
            </div>
        </div>
    );
}

export default UserLoans;