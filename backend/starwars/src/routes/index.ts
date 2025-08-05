import { Router } from 'express';

import Paths from '@src/common/constants/Paths';

import CarteRoutes from './CarteRoutes';
import DeckRoutes from './DeckRoutes';
import PartieRoutes from './PartieRoutes';
import UtilisateurRoutes from './UtilisateurRoutes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();



//cartes
const cartesRouter = Router();
cartesRouter.get(Paths.Cartes.Get, CarteRoutes.obtenirTout);
apiRouter.use(Paths.Cartes.Base, cartesRouter);

//decks
const decksRouter = Router();
decksRouter.get(Paths.Decks.Get, DeckRoutes.obtenirTout);
decksRouter.get(Paths.Decks.GetId, DeckRoutes.chercherParId);
decksRouter.post(Paths.Decks.Post , DeckRoutes.ajouter);
decksRouter.put(Paths.Decks.Put, DeckRoutes.modifier);
decksRouter.put(Paths.Decks.PutVictoire, DeckRoutes.ajouterVictoire);
decksRouter.delete(Paths.Decks.Delete, DeckRoutes.supprimer);
apiRouter.use(Paths.Decks.Base, decksRouter);

//parties
const partiesRouter = Router();
partiesRouter.get(Paths.Parties.Get, PartieRoutes.obtenirTout);
partiesRouter.get(Paths.Parties.GetId, PartieRoutes.chercherParId);
partiesRouter.post(Paths.Parties.Post , PartieRoutes.ajouter);
partiesRouter.put(Paths.Parties.Put, PartieRoutes.modifier);
partiesRouter.delete(Paths.Parties.Delete, PartieRoutes.supprimer);
apiRouter.use(Paths.Parties.Base, partiesRouter);

//utilisateurs
const utilisateursRouter = Router();
utilisateursRouter.get(Paths.Utilisateurs.Get, UtilisateurRoutes.obtenirTout);
utilisateursRouter.get(Paths.Utilisateurs.GetId, UtilisateurRoutes.chercherParId);
utilisateursRouter.post(Paths.Utilisateurs.Post , UtilisateurRoutes.ajouter);
utilisateursRouter.post(Paths.Utilisateurs.VerifMdp, UtilisateurRoutes.verifierMdp);
utilisateursRouter.delete(Paths.Utilisateurs.Delete, UtilisateurRoutes.supprimer);
apiRouter.use(Paths.Utilisateurs.Base, utilisateursRouter);


/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
