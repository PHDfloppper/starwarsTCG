import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './ListeDecks.css';

type CarteDansDeck = {
    numero: number;
    quantite: number;
};

type Deck = {
    _id: string;
    nom: string;
    description?: string;
    leader: string;
    base: string;
    createur: string;
    victoires: number;
    cartes: CarteDansDeck[];
};

const DetailsDeck: React.FC = () => {
    const { iddeck } = useParams<{ iddeck: string }>();
    const [deck, setDeck] = useState<Deck>();
    const [erreur, setErreur] = useState<string | null>(null);
    const naviguer = useNavigate();

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/decks/${iddeck}`);
                setDeck(response.data.decks);
            } catch (err) {
                setErreur('Erreur lors de la récupération des decks.');
                console.error(err);
            }
        };

        fetchDecks();
    }, []);

    const supprimerCarte = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/decks/supprimer/${iddeck}`);
            naviguer('/decks')
        } catch (err) {
            console.error(err);
            setErreur('Erreur lors de l’ajout du deck.');
        }

    };


    return (
        <div>
            <button className="retour-bouton" onClick={() => naviguer('/decks')}>
                Retour aux decks
            </button>
            <h2>Détails du deck : {deck?.nom}</h2>
            {erreur && <p>{erreur}</p>}
            <button onClick={() => naviguer(`/modifierDeck/${iddeck}`)}>
                modifier
            </button>
            <button type="button" onClick={supprimerCarte}>
                Supprimer le deck
            </button>
            <p><strong>Leader :</strong> {deck?.leader}</p>
            <p><strong>Base :</strong> {deck?.base}</p>
            <p><strong>Créateur :</strong> {deck?.createur}</p>
            <p><strong>Victoires :</strong> {deck?.victoires}</p>
            <p><strong>Description :</strong> {deck?.description}</p>

            <h3>Cartes dans le deck :</h3>
            <ul>
                {deck?.cartes.map((carte, index) => (
                    <li key={index}>
                        <div className="liste-decks-cartes">
                            <img
                                src={`https://api.swu-db.com/cards/twi/${carte.numero}?format=image`}
                                className="carte-image"
                            />
                            <p className="quantite-texte">Quantité : {carte.quantite}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DetailsDeck;
