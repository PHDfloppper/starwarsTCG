import mongoose from 'mongoose';
import Partie, {IPartie} from '../models/parties'

/**
 * fonction qui renvoie toute les cartes possibles
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

async function ajouter(partie: IPartie): Promise<IPartie> {
  const nouvellePartie = new Partie(partie);
  await nouvellePartie.save();
  return nouvellePartie;
}

async function modifier(id: string, partie: IPartie): Promise<IPartie> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de deck invalide');
  }
  const partieToUpdate = await Partie.findById(id);
  if (partieToUpdate === null) {
    throw new Error('deck non trouvé');
  }

  partieToUpdate.datePartie = partie.datePartie;
  partieToUpdate.adversaire = partie.adversaire;
  partieToUpdate.deckUtilise = partie.deckUtilise;
  partieToUpdate.resultat = partie.resultat;
  partieToUpdate.commentaires = partie.commentaires;
  await partieToUpdate.save();

  return partieToUpdate;
}

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
  ajouter,
  modifier,
  supprimer,
} as const;