import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ListeParties.css';

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

const ListeParties: React.FC = () => {
  const [parties, setParties] = useState<Partie[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const naviguer = useNavigate();
  const [recherche, setRecherche] = useState('');
  const [tri, setTri] = useState<'date-desc' | 'date-asc'>('date-desc');
  const [decksFiltres, setDecksFiltre] = useState<Partie[]>([]);

  const handleClique = async (deckId: string) => {
    naviguer(`/partieDetails/${deckId}`);
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
          setChargement(false);
          return;
        }
        const response = await axios.get('http://localhost:3000/api/parties/all');
        const toutesLesParties: Partie[] = response.data.parties;
        const partiesUtilisateur = toutesLesParties
          .filter(partie => partie.utilisateur === utilisateur)
          .map(partie => ({ ...partie, datePartie: new Date(partie.datePartie), }));
        setParties(partiesUtilisateur);
        console.log("decks remplies");
      } catch (err) {
        setErreur('Erreur lors de la récupération des parties.');
        console.error(err);
      } finally {
        setChargement(false);
      }
    };

    fetchDecks();
  }, []);

  /**
   * useEffect qui gère la recherche de deck par nom et le filtre des decks.
   */
  useEffect(() => {
    const partiesTrier = async () => {
      const recherchePartie = (parties.filter(partie => partie.deckUtilise.toLowerCase().includes(recherche.toLowerCase())));
      const tri_ = ([...recherchePartie].sort((a, b) => { //source: https://www.w3schools.com/js/js_array_sort.asp
        if (tri == 'date-desc') {
          return b.datePartie.getTime() - a.datePartie.getTime();
        }
        else if (tri == 'date-asc') {
          return a.datePartie.getTime() - b.datePartie.getTime();
        }
        else {
          return 0;
        }
      }));
      setDecksFiltre(tri_);
      console.log("decks trié")
    };

    partiesTrier();
  }, [recherche, tri, parties]);

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;

  return (
    <div className="liste-decks-container">
      <button className="retour-bouton" onClick={() => naviguer('/')}>
        Retour au menu
      </button>
      <h2>Liste des Parties</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Rechercher par deck utilisé"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="tri">Trier par : </label>
          <select id="tri" value={tri} onChange={(e) => setTri(e.target.value as typeof tri)}>
            <option value="date-desc">date (décroissant)</option>
            <option value="date-asc">date (croissant)</option>
          </select>
        </div>
        <button onClick={() => naviguer('/ajouterPartie')}>
          Ajouter une partie
        </button>
      </div>

      {decksFiltres.length === 0 ? (
        <p>Aucune parties trouvé.</p>
      ) : (
        <table className="deck-table">
          <thead>
            <tr>
              <th>deck utilisé</th>
              <th>date joué</th>
              <th>résultat</th>
            </tr>
          </thead>
          <tbody>
            {decksFiltres.map((deck) => (
              <tr key={deck._id}>
                <td>{deck.deckUtilise}</td>
                {/*source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString*/}
                <td>{deck.datePartie.toLocaleString('fr-CA', options)}</td>
                <td>{deck.resultat}</td>
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

export default ListeParties;
