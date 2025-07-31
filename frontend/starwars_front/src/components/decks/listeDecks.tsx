import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ListeDecks.css';

type Deck = {
  _id: string;
  nom: string;
  leader: string;
  createur: string;
  base: string;
};

const ListeDecks: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const naviguer = useNavigate();
  const [recherche, setRecherche] = useState('');

  const handleClique = async (deckId: string) => {
    naviguer(`/deckDetails/${deckId}`);
  };

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const utilisateur = localStorage.getItem('utilisateur'); // 👈 récupère l'utilisateur
        if (!utilisateur) {
          setErreur("utilisateur pas connecté");
          setChargement(false);
          return;
        }
        const response = await axios.get('http://localhost:3000/api/decks/all');
        const tousLesDecks: Deck[] = response.data.decks;
        const decksFiltres = tousLesDecks.filter(deck => deck.createur === utilisateur);
        setDecks(decksFiltres);
      } catch (err) {
        setErreur('Erreur lors de la récupération des decks.');
        console.error(err);
      } finally {
        setChargement(false);
      }
    };

    fetchDecks();
  }, []);

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;

  const decksFiltres = decks.filter(deck =>
    deck.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="liste-decks-container">
      <button className="retour-bouton" onClick={() => naviguer('/')}>
        Retour au menu
      </button>
      <h2>Liste des decks</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <button onClick={() => naviguer('/ajouterDeck')}>
          Ajouter un deck
        </button>
      </div>

      {decksFiltres.length === 0 ? (
        <p>Aucun deck trouvé.</p>
      ) : (
        <table className="deck-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Leader</th>
              <th>Base</th>
            </tr>
          </thead>
          <tbody>
            {decksFiltres.map((deck) => (
              <tr key={deck._id}>
                <td>{deck.nom}</td>
                <td>{deck.leader}</td>
                <td>{deck.base}</td>
                <td>
                  <button onClick={() => handleClique(deck._id)}>Détail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListeDecks;
