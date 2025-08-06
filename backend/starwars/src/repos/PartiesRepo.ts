import mongoose from 'mongoose';
import Partie, {IPartie} from '../models/parties'

/**
 * fonction qui renvoie toute les parties possibles
 * @returns 
 */
async function obtenirTout(): Promise<IPartie[]> {
  try {
    const parties = await Partie.find().sort({ numero: 1 });
    return parties;
  } catch (err) {
    console.error('Erreur lors de la récupération des cartes :', err);
    throw new Error('Impossible de récupérer les cartes.');
  }
}

/**
 * fonction qui renvoie une partie selon son id
 * @param id 
 * @returns 
 */
async function chercherParId(id: string): Promise<IPartie> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de partie invalide');
  }
  const partie = await Partie.findById(id);
  if (!partie) {
    throw new Error('Partie non trouvé');
  }
  return partie;
}

/**
 * fonction pour ajouter une partie à la bd
 * @param partie 
 * @returns 
 */
async function ajouter(partie: IPartie): Promise<IPartie> {
  const nouvellePartie = new Partie(partie);
  await nouvellePartie.save();
  return nouvellePartie;
}

/**
 * fonction pour modifier une partie selon sont id
 * @param id
 * @param partie 
 * @returns 
 */
async function modifier(id: string, partie: IPartie): Promise<IPartie> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de partie invalide');
  }
  const partieToUpdate = await Partie.findById(id);
  if (partieToUpdate === null) {
    throw new Error('partie non trouvé');
  }

  partieToUpdate.datePartie = partie.datePartie;
  partieToUpdate.adversaire = partie.adversaire;
  partieToUpdate.deckUtilise = partie.deckUtilise;
  partieToUpdate.resultat = partie.resultat;
  partieToUpdate.commentaires = partie.commentaires;
  await partieToUpdate.save();

  return partieToUpdate;
}

/**
 * fonction pour supprimer une partie selon son id
 * @param id 
 * @returns 
 */
async function supprimer(id: string): Promise<{ message: string }> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de partie invalide');
  }
  const result = await Partie.findByIdAndDelete(id);
  if (!result) {
    throw new Error('partie non trouvé');
  }
  return { message: 'partie supprimé avec succès' };
}

// **** Export default **** //

export default {
  obtenirTout,
  chercherParId,
  ajouter,
  modifier,
  supprimer,
} as const;