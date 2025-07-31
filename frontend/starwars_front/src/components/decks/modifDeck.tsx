import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { data, useNavigate, useParams } from 'react-router-dom';

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
    const [decks, setDecks] = useState<Deck[]>([]);

    const ajouterCarte = () => {
        if (numeroCarte <= 0 || quantiteCarte <= 0) return;

        if (numeroCarte > 237) {
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

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/decks/all');
                setDecks(response.data.decks);
            } catch (err) {
                setErreur('Erreur lors de la récupération des decks.');
                console.error(err);
            }
        };

        fetchDecks();
    }, []);

    useEffect(() => {
        if (decks.length > 0) {
            const deckTrouve = decks.find((deck_) => deck_._id === iddeck);
            if (deckTrouve) {
                setNom(deckTrouve.nom);
                setDescription(deckTrouve.description);
                setLeader(deckTrouve.leader);
                setBase(deckTrouve.base);
                setCreateur(deckTrouve.createur);
                setVictoires(deckTrouve.victoires);
                setCartes(deckTrouve.cartes);
            }

            if (!deckTrouve) setErreur('Deck non trouvé');
        }
    }, [decks, iddeck]);

    return (
        <div className="ajout-deck-container">
            <button className="retour-bouton" onClick={() => naviguer('/decks')}>
                Retour aux decks
            </button>
            <h2>Modifier le deck</h2>
            <form onSubmit={handleAjout}>
                <div>
                    <label>Nom du deck :</label>
                    <input value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div>
                    <label>Description :</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>Leader :</label>
                    <input value={leader} onChange={(e) => setLeader(e.target.value)} required />
                </div>
                <div>
                    <label>Base :</label>
                    <input value={base} onChange={(e) => setBase(e.target.value)} required />
                </div>
                <h4>Ajouter une carte</h4>
                <label>Numéro de carte :</label>
                <input
                    type="number"
                    min={1}
                    max={237}
                    value={numeroCarte}
                    onChange={(e) => setNumeroCarte(parseInt(e.target.value))}
                    placeholder="ex: 120"
                />

                <label>Quantité :</label>
                <input
                    type="number"
                    min={1}
                    max={3}
                    value={quantiteCarte}
                    onChange={(e) => setQuantiteCarte(parseInt(e.target.value))}
                />

                <button type="button" onClick={ajouterCarte}>
                    Ajouter carte
                </button>

                {cartes.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <h5>Cartes ajoutées :</h5>
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
                <button type="submit">Ajouter le deck</button>
            </form>
            {message && <p>{message}</p>}
            {erreur && <p>{erreur}</p>}
        </div>
    );
};

export default ModifDeck;
