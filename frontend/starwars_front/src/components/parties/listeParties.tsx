import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const ListeParties: React.FC = () => {
  const [parties, setParties] = useState<Partie[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const naviguer = useNavigate();
  const [recherche, setRecherche] = useState('');
  const [tri, setTri] = useState<'date-desc' | 'date-asc'>('date-desc');
  const [partiesFiltres, setPartiesFiltre] = useState<Partie[]>([]);

  const handleClique = async (partieId: string) => {
    naviguer(`/partieDetails/${partieId}`);
  };

  /**
   * useEffect qui récupère les parties selon l'utilisateur connecté au chargement de la page.
   */
  useEffect(() => {
    const obtenirParties = async () => {
      try {
        const utilisateur = localStorage.getItem('utilisateur');
        if (!utilisateur) {
          setErreur("utilisateur pas connecté");
          return;
        }
        const response = await axios.get('http://localhost:3000/api/parties/all');
        const toutesLesParties: Partie[] = response.data.parties;
        const partiesUtilisateur = toutesLesParties
          .filter(partie => partie.utilisateur === utilisateur)
          .map(partie => ({ ...partie, datePartie: new Date(partie.datePartie), }));
        setParties(partiesUtilisateur);
        console.log("parties remplies");
      } catch (err) {
        setErreur('Erreur lors de la récupération des parties.');
        console.error(err);
      }
    };

    obtenirParties();
  }, []);

  /**
   * useEffect qui gère la recherche de partie par nom de deck et le filtre des parties.
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
      setPartiesFiltre(tri_);
      console.log("partie trié")
    };

    partiesTrier();
  }, [recherche, tri, parties]);

  return (
    <div className="liste-decks-container">
      <div className="background3"></div>
      <button className="retour-bouton" onClick={() => naviguer('/')}>
        Retour au menu
      </button>
      <h2 className="text">Liste des Parties</h2>
      {erreur && <p className="erreur">{erreur}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Rechercher par deck utilisé"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <div style={{ marginBottom: '1rem' }}>
          <label className="text">Trier par : </label>
          <select value={tri} onChange={(e) => setTri(e.target.value as typeof tri)}>
            <option value="date-desc">date (décroissant)</option>
            <option value="date-asc">date (croissant)</option>
          </select>
        </div>
        <button onClick={() => naviguer('/ajouterPartie')} className="text">
          Ajouter une partie
        </button>
      </div>

      {partiesFiltres.length === 0 ? (
        <p className="text">Aucune parties trouvé.</p>
      ) : (
        <table className="deck-table">
          <thead>
            <tr>
              <th className="text">deck utilisé</th>
              <th className="text">date joué</th>
              <th className="text">résultat</th>
            </tr>
          </thead>
          <tbody>
            {partiesFiltres.map((partie) => (
              <tr key={partie._id}>
                <td>{partie.deckUtilise}</td>
                {/*source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString*/}
                <td>{partie.datePartie.toLocaleString('fr-CA', options)}</td>
                <td>{partie.resultat}</td>
                <td>
                  <button onClick={() => handleClique(partie._id)} className="text">Détail</button>
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
