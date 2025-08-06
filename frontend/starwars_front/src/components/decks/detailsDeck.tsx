import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Decks.css';

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

    /**
     * useEffect qui fait une requete pour obtenir le deck selon son id
     */
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

    /**
     * fonction appelé avec un bouton qui envoie une requete pour supprimer un deck selon l'id
     */
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
            <div className="background2"></div>
            <button className="retour-bouton" onClick={() => naviguer('/decks')}>
                Retour aux decks
            </button>
            <h2>Détails du deck : {deck?.nom}</h2>
            {erreur && <p className='erreur'>{erreur}</p>}
            <button onClick={() => naviguer(`/modifierDeck/${iddeck}`)} className='text'>
                modifier
            </button>
            <button type="button" onClick={supprimerCarte} className='text'>
                Supprimer le deck
            </button>
            <p><strong className='text'>Leader :</strong> {deck?.leader}</p>
            <p><strong className='text'>Base :</strong> {deck?.base}</p>
            <p><strong className='text'>Créateur :</strong> {deck?.createur}</p>
            <p><strong className='text'>Victoires :</strong> {deck?.victoires}</p>
            <p><strong className='text'>Description :</strong> {deck?.description}</p>

            <h3 className='text'>Cartes dans le deck :</h3>
            <ul>
                {deck?.cartes.map((carte, index) => (
                    <li key={index}>
                        <div className="liste-decks-cartes">
                            <img
                                src={`https://api.swu-db.com/cards/twi/${carte.numero}?format=image`}
                                className="carte-image"
                            />
                            <p className='text'>quantité : {carte.quantite}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DetailsDeck;
