import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Partie.css';

type Partie = {
  _id: string;
  datePartie: Date;
  adversaire: string;
  deckUtilise: string;
  resultat: string;
  commentaires: string;
  utilisateur: string;
};

/**
 * options pour afficher la date. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
 */
const options: Intl.DateTimeFormatOptions = { //source: https://stackoverflow.com/questions/73563950/what-exactly-is-the-typescript-linter-asking-for-in-this-case-where-an-object-r
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
};

const DetaisPartie: React.FC = () => {
    const { idPartie } = useParams<{ idPartie: string }>();
    const [partie, setPartie] = useState<Partie>();
    const [erreur, setErreur] = useState<string | null>(null);
    const naviguer = useNavigate();

    /**
     * useEffect qui fait une requete pour obtenir une partie selon son id
     */
    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/parties/${idPartie}`);
                setPartie(response.data.parties);
            } catch (err) {
                setErreur('Erreur lors de la récupération des decks.');
                console.error(err);
            }
        };

        fetchDecks();
    }, []);

    /**
     * fonction appelé avec un bouton qui envoie une requete pour supprimer une partie selon l'id
     */
    const supprimerCarte = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/parties/supprimer/${idPartie}`);
            naviguer('/parties')
        } catch (err) {
            console.error(err);
            setErreur('Erreur lors de la suppression de la partie');
        }

    };


    return (
        <div>
            <div className="background3"></div>
            <button className="retour-bouton" onClick={() => naviguer('/parties')}>
                Retour aux parties
            </button>
            <h2 className="text">Détails de la partie</h2>
            {erreur && <p className="erreur">{erreur}</p>}
            <button onClick={() => naviguer(`/modifierPartie/${idPartie}`)} className="text">
                modifier
            </button>
            <button type="button" onClick={supprimerCarte} className="text">
                Supprimer la partie
            </button>
            <p><strong className="text">aversaire : :</strong> {partie?.adversaire}</p>
            <p><strong className="text">commentaires :</strong> {partie?.commentaires}</p>
            <p><strong className="text">date joué :</strong> {partie?.datePartie.toLocaleString('fr-CA',options)}</p>
            <p><strong className="text">deck utilisé :</strong> {partie?.deckUtilise}</p>
            <p><strong className="text">resultat :</strong> {partie?.resultat}</p>
            <p><strong className="text">utilisateur :</strong> {partie?.utilisateur}</p>
        </div>
    );
};

export default DetaisPartie;
