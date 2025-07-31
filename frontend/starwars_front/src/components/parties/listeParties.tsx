import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ListeParties.css';

type Carte = {
  _id: string;
  nom: string;
  type: string;
  numero: number;
};

const ListeParties: React.FC = () => {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const naviguer = useNavigate();

  useEffect(() => {
    const fetchCartes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cartes/all');
        setCartes(response.data.cartes);
      } catch (err) {
        setErreur('Erreur lors de la récupération des cartes.');
        console.error(err);
      } finally {
        setChargement(false);
      }
    };

    fetchCartes();
  }, []);

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;

  return (
    <div className="liste-cartes-container">
      <button className="retour-bouton" onClick={() => naviguer('/')}>
        Retour au menu
      </button>

      <h2 className="titre-liste">Liste des Parties</h2>
      <div className="cartes-grille">
        {cartes.map((carte) => (
          <div key={carte._id} className="carte-item">
            <img
              src={`https://api.swu-db.com/cards/twi/${carte.numero}?format=image`}
              alt={`Carte ${carte.nom}`}
              className="carte-image"
            />
            <p>{carte.nom} ({carte.type})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeParties;
