import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
     * fonction pour faire la requête de modification de deck
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
            if (resultat == "victoire") {
                await axios.put(`http://localhost:3000/api/decks/victoire/${deckUtilise?._id}`)
            }
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

    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/parties/${idPartie}`);
                setPartie(response.data.parties);
            } catch (err) {
                setErreur('Erreur lors de la récupération des decks.');
                console.error(err);
            }
        };

        fetchParties();
    }, []);

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
            <button className="retour-bouton" onClick={() => naviguer('/parties')}>
                Retour aux parties
            </button>
            <h2>Ajouter une nouvelle partie</h2>
            <form onSubmit={handleAjout}>
                <div>
                    <label>Date de la partie :</label>
                    <input
                        type="date"
                        value={datePartie.split("T")[0]?? ''}
                        onChange={(e) => setdatePartie(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>deck utilisé :</label>
                    <select id="tri" value={deckUtilise?.nom ?? ''} onChange={(e) => getidDeckUtilise(e.target.value)}>
                        {decks.map((deck) => (
                            <option key={deck._id} value={deck.nom}>{deck.nom}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>resultat :</label>
                    <select id="tri" value={resultat?? ''} onChange={(e) => setresultat(e.target.value as typeof resultat)}>
                        <option value="victoire">victoire</option>
                        <option value="défaite">défaite</option>
                    </select>
                </div>
                <div>
                    <label>adversaire :</label>
                    <input value={adversaire?? ''} onChange={(e) => setadversaire(e.target.value)} required />
                </div>
                <div>
                    <label>commentaires :</label>
                    <input value={commentaires?? ''} onChange={(e) => setcommentaires(e.target.value)} required />
                </div>
                <hr />
                <button type="submit">Modifier la partie</button>
            </form>
            {message && <p>{message}</p>}
            {erreur && <p>{erreur}</p>}
        </div>
    );
};

export default ModifPartie;
