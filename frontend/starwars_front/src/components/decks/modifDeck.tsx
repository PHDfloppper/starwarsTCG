import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams } from 'react-router-dom';
import './Decks.css';

type CarteDansDeck = {
    numero: number;
    quantite: number;
};

type Deck = {
    _id: string;
    nom: string;
    description: string;
    leader: string;
    base: string;
    createur: string;
    victoires: number;
    cartes: CarteDansDeck[];
};

const ModifDeck: React.FC = () => {
    const { iddeck } = useParams<{ iddeck: string }>();
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [leader, setLeader] = useState('');
    const [base, setBase] = useState('');
    const [createur, setCreateur] = useState('');
    const [victoires, setVictoires] = useState(0);
    const [numeroCarte, setNumeroCarte] = useState(1);
    const [quantiteCarte, setQuantiteCarte] = useState(1);
    const [cartes, setCartes] = useState<CarteDansDeck[]>([]);
    const [message, setMessage] = useState('');
    const naviguer = useNavigate();
    const [erreur, setErreur] = useState<string | null>(null);
    const [deck, setDeck] = useState<Deck>();

    /**
     * fonction pour ajouter une carte au tableau de carte si elle respecte les condition (le numéro de carte doit être entre 0 et 238)
     * @returns
     */
    const ajouterCarte = () => {
        if (numeroCarte <= 0 || quantiteCarte <= 0) return;

        if (numeroCarte > 238) {
            setMessage('le numéro de carte ne peut pas dépasser 237');
            return;
        }

        setCartes((prev) => [
            ...prev,
            { numero: numeroCarte, quantite: quantiteCarte },
        ]);

        // Reset des champs
        setNumeroCarte(1);
        setQuantiteCarte(1);
        setMessage('');
    };

    //fonction de modification d'un deck, appelé quand le form est envoyé 
    const handleAjout = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const nouveauDeck = {
                deck: {
                    nom,
                    description,
                    leader,
                    base,
                    createur,
                    victoires,
                    cartes: cartes,
                }
            };

            await axios.put(`http://localhost:3000/api/decks/modifier/${iddeck}`, nouveauDeck);
            setMessage('Deck ajouté avec succès !');
        } catch (err) {
            console.error(err);
            setMessage('Erreur lors de l’ajout du deck.');
        }
    };

    /**
     * useEffect qui récupère le deck selon l'id pour afficher les données actuelles dans le formulaire
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
     * suite du précédant useEffect, affecte les données du deck dans les variables useState
     */
    useEffect(() => {

        if (deck) {
            setNom(deck.nom);
            setDescription(deck.description);
            setLeader(deck.leader);
            setBase(deck.base);
            setCreateur(deck.createur);
            setVictoires(deck.victoires);
            setCartes(deck.cartes);
        }

    }, [deck, iddeck]);

    return (
        <div className="ajout-deck-container">
            <div className="background2"></div>
            <button className="retour-bouton" onClick={() => naviguer('/decks')}>
                Retour aux decks
            </button>
            <h2 className='text'>Modifier le deck</h2>
            <form onSubmit={handleAjout}>
                <div>
                    <label className='text'>Nom du deck :</label>
                    <input value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div>
                    <label className='text'>Description :</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label className='text'>Leader :</label>
                    <input value={leader} onChange={(e) => setLeader(e.target.value)} required />
                </div>
                <div>
                    <label className='text'>Base :</label>
                    <input value={base} onChange={(e) => setBase(e.target.value)} required />
                </div>
                <h4 className='text'>Ajouter une carte</h4>
                <label className='text'>Numéro de carte :</label>
                <input
                    type="number"
                    min={1}
                    max={237}
                    value={numeroCarte}
                    onChange={(e) => setNumeroCarte(parseInt(e.target.value))}
                    placeholder="ex: 120"
                />

                <label className='text'>Quantité :</label>
                <input
                    type="number"
                    min={1}
                    max={3}
                    value={quantiteCarte}
                    onChange={(e) => setQuantiteCarte(parseInt(e.target.value))}
                />

                <button type="button" onClick={ajouterCarte} className='text'>
                    Ajouter carte
                </button>

                {cartes.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <h5 className='text'>Cartes ajoutées :</h5>
                        <ul>
                            {cartes.map((c, index) => (
                                <li key={index}>
                                    {c.numero} — quantité : {c.quantite}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <hr />
                <button type="submit" className='text'>Modifier le deck</button>
            </form>
            {message && <p className='text'>{message}</p>}
            {erreur && <p className='erreur'>{erreur}</p>}
        </div>
    );
};

export default ModifDeck;
