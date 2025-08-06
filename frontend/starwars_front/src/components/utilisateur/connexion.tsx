import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Utilisateurs.css';

type Utilisateur = {
  nom: string;
  motDePasse: string;
};

const Connexion: React.FC = () => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur>({ nom: '', motDePasse: '' });
  const [erreur, setErreur] = useState<string | null>(null);
  const naviguer = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUtilisateur({ ...utilisateur, [e.target.name]: e.target.value });
  };

  /**
   * gère la connexion de l'utilisateur quand il clique sur le bouton de connexion
   * vérifie si c'est le bon mot de passe
   */
  const handleConnexion = async () => {
    setErreur(null);

    try {
      const response = await axios.post('http://localhost:3000/api/utilisateurs/verifMdp', {
        utilisateur: {
          nom: utilisateur.nom,
          motDePasse: utilisateur.motDePasse,
        }
      });

      if (response.data.message === 'true') {
        localStorage.setItem('utilisateur', response.data.utilisateur);
        naviguer('/');
      } else {
        setErreur('Nom ou mot de passe incorrect.');
      }
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        console.error('Erreur Axios :', err.response?.data);
        if (err.response?.data.message == "false") {
          setErreur('Nom ou mot de passe incorrect.');
        }
        else {
          setErreur('Erreur lors de la connexion.');
        }
      }
      else {
        setErreur('Erreur lors de la connexion.');
      }
    }
  };

  return (
    <div className="liste-cartes-container">
      <div className="background"></div>
      <h2 className="titre-liste">Connexion</h2>

      <div className="formulaire-connexion">
        <input
          type="text"
          name="nom"
          placeholder="Nom d'utilisateur"
          value={utilisateur.nom}
          onChange={handleChange}
          className="input-texte"
        />
        <input
          type="password"
          name="motDePasse"
          placeholder="Mot de passe"
          value={utilisateur.motDePasse}
          onChange={handleChange}
          className="input-texte"
        />
        <button onClick={handleConnexion} className="text">Se connecter</button>
        {erreur && <p className='erreur'>{erreur}</p>}
      </div>
    </div>
  );
};

export default Connexion;
