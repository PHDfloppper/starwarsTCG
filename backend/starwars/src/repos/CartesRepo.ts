import Carte, {ICarte} from '../models/cartes'

/**
 * fonction qui renvoie toute les cartes possibles
 * @returns 
 */
async function obtenirTout(): Promise<ICarte[]> {
  try {
    const cartes = await Carte.find().sort({ numero: 1 });
    return cartes;
  } catch (err) {
    console.error('Erreur lors de la récupération des cartes :', err);
    throw new Error('Impossible de récupérer les cartes.');
  }
}

// **** Export default **** //

export default {
  //getOne,
  obtenirTout,
} as const;