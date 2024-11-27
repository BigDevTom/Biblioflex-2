import React, { useEffect, useState } from 'react';
import { getCurrentLoansByUser, getReturnedLoansByUser } from '../../config/api';
import { Link } from 'react-router-dom';
import './UserLoans.css';

function UserLoans() {
    const [currentLoans, setCurrentLoans] = useState([]);
    const [returnedLoans, setReturnedLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Récupère le token depuis le localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchLoans = async () => {
            console.log("Fetching loans...");
            setLoading(true);
            try {
                const currentLoans = await getCurrentLoansByUser();
                console.log("Current loans fetched:", currentLoans);
    
                const returnedLoans = await getReturnedLoansByUser();
                console.log("Returned loans fetched:", returnedLoans);
    
                setCurrentLoans(currentLoans);
                setReturnedLoans(returnedLoans);
            } catch (error) {
                console.error("Erreur lors de la récupération des emprunts :", error);
                setError("Erreur lors de la récupération des emprunts");
            } finally {
                setLoading(false);
            }
        };
    
        if (token) fetchLoans();
    }, [token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format de date lisible
    };

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
                                    Date d'emprunt : {formatDate(loan.loan_date)}
                                    <br />
                                    Date de retour prévue : {formatDate(loan.return_date)}
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
                                    Date d'emprunt : {formatDate(loan.loan_date)}
                                    <br />
                                    Date de retour : {formatDate(loan.return_date)}
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