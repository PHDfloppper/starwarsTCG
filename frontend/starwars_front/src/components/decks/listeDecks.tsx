import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Decks.css';

type Deck = {
  _id: string;
  nom: string;
  leader: string;
  createur: string;
  base: string;
  victoires: number;
};

const ListeDecks: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const naviguer = useNavigate();
  const [recherche, setRecherche] = useState('');
  const [tri, setTri] = useState<'nom' | 'victoires-desc' | 'victoires-asc'>('nom');
  const [decksFiltres, setDecksFiltre] = useState<Deck[]>([]);

  const handleClique = async (deckId: string) => {
    naviguer(`/deckDetails/${deckId}`);
  };

  /**
   * useEffect qui récupère les decks selon l'utilisateur connecté au chargement de la page.
   */
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const utilisateur = localStorage.getItem('utilisateur');
        if (!utilisateur) {
          setErreur("utilisateur pas connecté");
          return;
        }
        const response = await axios.get('http://localhost:3000/api/decks/all');
        const tousLesDecks: Deck[] = response.data.decks;
        const decksUtilisateur = tousLesDecks.filter(deck => deck.createur === utilisateur);
        setDecks(decksUtilisateur);
        console.log("decks remplies");
      } catch (err) {
        setErreur('Erreur lors de la récupération des decks.');
        console.error(err);
      }
    };

    fetchDecks();
  }, []);

  /**
   * useEffect qui gère la recherche de deck par nom et le filtre des decks.
   */
  useEffect(() => {
    const decksTrier = async () => {
      const rechercheDeck = (decks.filter(deck => deck.nom.toLowerCase().includes(recherche.toLowerCase())));
      const trie = ([...rechercheDeck].sort((a, b) => { //source: https://www.w3schools.com/js/js_array_sort.asp
        if (tri == 'nom') {
          return a.nom.localeCompare(b.nom); //source: https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
        }
        else if (tri == 'victoires-desc') {
          return b.victoires - a.victoires;
        }
        else if (tri == 'victoires-asc') {
          return a.victoires - b.victoires;
        }
        else {
          return 0;
        }
      }));
      setDecksFiltre(trie);
      console.log("decks trié")
    };

    decksTrier();
  }, [recherche, tri, decks]);

  return (
    <div className="liste-decks-container">
      <div className="background2"></div>
      <button className="retour-bouton" onClick={() => naviguer('/')}>
        Retour au menu
      </button>
      <h2 className='text'>Liste des decks</h2>
      {erreur && <p className='erreur'>{erreur}</p>}
      <div>
        <input
          type="text"
          placeholder="Rechercher par nom"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <div>
          <label className='text'>Trier par : </label>
          <select value={tri} onChange={(e) => setTri(e.target.value as typeof tri)}>
            <option value="nom">Nom (A-Z)</option>
            <option value="victoires-desc">Victoires (décroissant)</option>
            <option value="victoires-asc">Victoires (croissant)</option>
          </select>
        </div>
        <button onClick={() => naviguer('/ajouterDeck')} className='text'>
          Ajouter un deck
        </button>
      </div>

      {decksFiltres.length === 0 ? (
        <p className='text'>Aucun deck trouvé.</p>
      ) : (
        <table className="deck-table">
          <thead>
            <tr>
              <th className='text'>Nom</th>
              <th className='text'>Leader</th>
              <th className='text'>Base</th>
              <th >victoires</th>
            </tr>
          </thead>
          <tbody>
            {decksFiltres.map((deck) => (
              <tr key={deck._id}>
                <td>{deck.nom}</td>
                <td>{deck.leader}</td>
                <td>{deck.base}</td>
                <td>{deck.victoires}</td>
                <td>
                  <button onClick={() => handleClique(deck._id)} className='text'>Détail</button>
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
