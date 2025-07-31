import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ListeCartes from './components/listeCarte';
import ListeDecks from './components/decks/listeDecks';
import ListeParties from './components/parties/listeParties';
import Connexion from './components/connexion';
import DetailsDeck from './components/decks/detailsDeck';
import AjoutDeck from './components/decks/ajoutDeck';
import ModifDeck from './components/decks/modifDeck';

function Home({ nomUser }: { nomUser: string | null }) {


  const handleClique = async () => {
    localStorage.setItem('utilisateur', "");
    window.location.reload();
  };

  return (
    <>
      <div className="logo-container">
        <a href="https://starwarsunlimited.com/fr" target="_blank" rel="noreferrer">
          <img
            src="https://starwarsunlimited.com/_next/image?url=%2Fsplash%2Flogo%403x.png&w=256&q=75"
            className="logo"
            alt="Star Wars Unlimited"
          />
        </a>
        <Link to="/cartes">
          <img
            src="https://cdn.svc.asmodee.net/production-asmodeeca/uploads/image-converter/2024/09/swu-set3_logo-FR.webp"
            className="logo"
            alt="Logo Set 3"
          />
        </Link>
      </div>
      <div className="logo-container">
        {nomUser ? (
          <div>
            <p>Connecté en tant que <strong>{nomUser}</strong></p>
            <button onClick={handleClique}>Déconnexion</button>
          </div>
        ) : (
          <Link to="/connexion">
            <button>Connexion</button>
          </Link>
        )}
        <Link to="/decks">
          <button>Voir les decks</button>
        </Link>
        <Link to="/parties">
          <button>Voir les parties</button>
        </Link>
      </div>
    </>
  );
}

function App() {

  const [nomUser, setNomUser] = useState<string | null>(() => {
    return localStorage.getItem('utilisateur'); //source: https://www.w3schools.com/jsref/prop_win_localstorage.asp
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home nomUser={nomUser} />} />
        <Route path="/cartes" element={<ListeCartes />} />
        <Route path="/decks" element={<ListeDecks />} />
        <Route path="/parties" element={<ListeParties />} />
        <Route
          path="/connexion"
          element={<Connexion connexion={(nom) => setNomUser(nom)} />}
        />
        <Route path="/deckDetails/:iddeck" element={<DetailsDeck />}/>
        <Route path="/ajouterDeck" element={<AjoutDeck />} />
        <Route path="/modifierDeck/:iddeck" element={<ModifDeck />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
