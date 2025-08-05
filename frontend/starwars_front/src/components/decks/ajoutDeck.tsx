import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CarteDeck {
    numero: number;
    quantite: number;
}

const AjoutDeck: React.FC = () => {
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [leader, setLeader] = useState('');
    const [base, setBase] = useState('');
    const [numeroCarte, setNumeroCarte] = useState(1);
    const [quantiteCarte, setQuantiteCarte] = useState(1);
    const [cartes, setCartes] = useState<CarteDeck[]>([]);
    const [message, setMessage] = useState('');
    const naviguer = useNavigate();

    /**
     * 
     * fonction pour ajouter une carte dans le deck (ajoute la carte au tableau de carte, ne fait pas requete tout de suite)
     */
    const ajouterCarte = () => {
        if (numeroCarte <= 0 || quantiteCarte <= 0) return;

        if (numeroCarte > 237) {
            setMessage('le numéro de carte ne peut pas dépasser 237');
            return;
        }

        setCartes((cartes) => [
            ...cartes,
            { numero: numeroCarte, quantite: quantiteCarte },
        ]);

        // Reset des champs
        setNumeroCarte(1);
        setQuantiteCarte(1);
        setMessage('');
    };

    /**
     * 
     * fonction pour faire la requête d'ajout de deck
     */
    const handleAjout = async (e: React.FormEvent<HTMLFormElement>) => {e.preventDefault(); //empêche la page de reload source: https://stackoverflow.com/questions/56562153/react-typescript-onsubmit-e-preventdefault-not-working

        try {
            const nouveauDeck = {
                deck: {
                    nom: nom,
                    description: description,
                    leader: leader,
                    base: base,
                    createur: localStorage.getItem('utilisateur'),
                    victoires: 0,
                    cartes: cartes,
                }
            };

            await axios.post('http://localhost:3000/api/decks/ajouter', nouveauDeck);
            setMessage('Deck ajouté avec succès !');
        } catch (err) {
            console.error(err);
            setMessage('Erreur lors de l’ajout du deck.');
        }
    };

    return (
        <div className="ajout-deck-container">
            <button className="retour-bouton" onClick={() => naviguer('/decks')}>
                Retour aux decks
            </button>
            <h2>Ajouter un nouveau deck</h2>
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
        </div>
    );
};

export default AjoutDeck;
