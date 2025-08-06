import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Utilisateurs.css';

const AjoutUtilisateur: React.FC = () => {
    const [nom, setNom] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [message, setMessage] = useState('');
    const [erreur, setErreur] = useState('');
    const naviguer = useNavigate();

    /**
     * 
     * fonction pour faire la requête d'ajout de l'utilisateur
     */
    const handleAjout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //empêche la page de reload source:https://stackoverflow.com/questions/50193227/basic-react-form-submit-refreshes-entire-page , https://stackoverflow.com/questions/56562153/react-typescript-onsubmit-e-preventdefault-not-working

        try {
            const nouveauUtilisateur = {
                utilisateur: {
                    nom: nom,
                    motDePasse: motDePasse,
                }
            };
            await axios.post('http://localhost:3000/api/utilisateurs/ajouter', nouveauUtilisateur);
            setMessage('utilisateur ajouté avec succès !');
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                console.error('Erreur Axios :', err.response?.data);
            }
            setErreur('Erreur lors de l’ajout de la partie.');
        }
    };

    return (
        <div className="ajout-deck-container">
            <div className="background"></div>
            <button className="retour-bouton" onClick={() => naviguer('/')}>
                Retour au menu
            </button>
            <h2 className="text">Créer un compte</h2>
            <form onSubmit={handleAjout}>
                <div>
                    <label className="text">Nom :</label>
                    <input value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div>
                    <label className="text">Mot de passe :</label>
                    <input value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
                </div>
                <button type="submit" className="text">Créer</button>
            </form>
            {message && <p className='text'>{message}</p>}
            {erreur && <p className='erreur'>{erreur}</p>}
        </div>
    );
};

export default AjoutUtilisateur;
