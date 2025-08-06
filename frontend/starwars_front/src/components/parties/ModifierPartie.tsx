import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Partie.css';

type Partie = {
    _id: string;
    datePartie: string;
    adversaire: string;
    deckUtilise: string;
    resultat: string;
    commentaires: string;
    utilisateur: string;
};

type Deck = {
    _id: string;
    createur: string;
    nom: string;
};

const ModifPartie: React.FC = () => {
    const { idPartie } = useParams<{ idPartie: string }>();
    const [datePartie, setdatePartie] = useState('');
    const [deckUtilise, setdeckUtilise] = useState<Deck>();
    const [resultat, setresultat] = useState('victoire');
    const [adversaire, setadversaire] = useState('');
    const [commentaires, setcommentaires] = useState('');
    const [message, setMessage] = useState('');
    const naviguer = useNavigate();
    const [partie, setPartie] = useState<Partie>();
    const [decks, setDecks] = useState<Deck[]>([]);
    const [erreur, setErreur] = useState<string | null>(null);

    /**
    * useEffect qui récupère les decks selon l'utilisateur connecté au chargement de la page pour les utiliser dans le dropdown.
    */
    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const utilisateur = localStorage.getItem('utilisateur');
                if (!utilisateur) {
                    setMessage("utilisateur pas connecté");
                    return;
                }
                const response = await axios.get('http://localhost:3000/api/decks/all');
                const tousLesDecks: Deck[] = response.data.decks;
                const decksUtilisateur = tousLesDecks.filter(deck => deck.createur === utilisateur);
                setDecks(decksUtilisateur);
                setdeckUtilise(decksUtilisateur[0])
                console.log("decks remplies");
            } catch (err) {
                setMessage('Erreur lors de la récupération des decks.');
                console.error(err);
            }
        };

        fetchDecks();
    }, []);

    /**
     * 
     * fonction pour faire la requête de modification de partie
     */
    const handleAjout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //empêche la page de reload source: https://stackoverflow.com/questions/56562153/react-typescript-onsubmit-e-preventdefault-not-working

        try {
            const nouvellePartie = {
                partie: {
                    datePartie: datePartie,
                    deckUtilise: deckUtilise?.nom,
                    resultat: resultat,
                    adversaire: adversaire,
                    utilisateur: localStorage.getItem('utilisateur'),
                    commentaires: commentaires,
                }
            };

            console.log(nouvellePartie);
            await axios.put(`http://localhost:3000/api/parties/modifier/${idPartie}`, nouvellePartie);
            setMessage('partie modifié avec succès !');
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                console.error('Erreur Axios :', err.response?.data);
            }
            setMessage('Erreur lors de l’ajout de la partie.');
        }
    };

    /**
     * obtient l'id du deck utilisé choisi par l'utilisateur dans le dropdown
     */
    const getidDeckUtilise = (nom: string) => {
        const deckTrouve = decks.find((deck) => deck.nom === nom);
        if (deckTrouve) {
            setdeckUtilise(deckTrouve);
        } else {
            console.warn("Deck non trouvé pour le nom :", nom);
        }
    };

    /**
     * useEffect qui récupère la partie selon l'id pour afficher les données actuelles dans le formulaire
     */
    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/parties/${idPartie}`);
                setPartie(response.data.parties);
            } catch (err) {
                setErreur('Erreur lors de la récupération des partie.');
                console.error(err);
            }
        };

        fetchParties();
    }, []);

    /**
    * suite du précédant useEffect, affecte les données du deck dans les variables useState
    */
    useEffect(() => {

        if (partie) {
            setadversaire(partie.adversaire);
            setcommentaires(partie.commentaires);
            setdatePartie(partie.datePartie);
            getidDeckUtilise(partie.deckUtilise);
            setresultat(partie.resultat);
        }

    }, [partie, idPartie]);

    return (
        <div className="ajout-deck-container">
            <div className="background3"></div>
            <button className="retour-bouton" onClick={() => naviguer('/parties')}>
                Retour aux parties
            </button>
            <h2 className="text">Ajouter une nouvelle partie</h2>
            <form onSubmit={handleAjout}>
                <div>
                    <label className="text">Date de la partie :</label>
                    <input
                        type="date"
                        value={datePartie.split("T")[0] ?? ''}
                        onChange={(e) => setdatePartie(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="text">deck utilisé :</label>
                    <select id="tri" value={deckUtilise?.nom ?? ''} onChange={(e) => getidDeckUtilise(e.target.value)}>
                        {decks.map((deck) => (
                            <option key={deck._id} value={deck.nom}>{deck.nom}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text">resultat :</label>
                    <select id="tri" value={resultat ?? ''} onChange={(e) => setresultat(e.target.value as typeof resultat)}>
                        <option value="victoire">victoire</option>
                        <option value="défaite">défaite</option>
                    </select>
                </div>
                <div>
                    <label className="text">adversaire :</label>
                    <input value={adversaire ?? ''} onChange={(e) => setadversaire(e.target.value)} required />
                </div>
                <div>
                    <label className="text">commentaires :</label>
                    <input value={commentaires ?? ''} onChange={(e) => setcommentaires(e.target.value)} required />
                </div>
                <hr />
                <button type="submit" className="text">Modifier la partie</button>
            </form>
            {message && <p className="erreur">{message}</p>}
            {erreur && <p className="text">{erreur}</p>}
        </div>
    );
};

export default ModifPartie;
