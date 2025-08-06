import mongoose from 'mongoose';
import decks from '../models/decks';
import Deck, { IDeck } from '../models/decks'

/**
 * fonction qui renvoie tout les decks possibles
 * @returns 
 */
async function obtenirTout(): Promise<IDeck[]> {
  try {
    const decks = await Deck.find().sort({ numero: 1 });
    return decks;
  } catch (err) {
    console.error('Erreur lors de la récupération des cartes :', err);
    throw new Error('Impossible de récupérer les cartes.');
  }
}

/**
 * fonction qui cherche un deck par id
 * @param id 
 * @returns 
 */
async function chercherParId(id: string): Promise<IDeck> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de deck invalide');
  }
  const deck = await Deck.findById(id);
  if (!deck) {
    throw new Error('Deck non trouvé');
  }
  return deck;
}

/**
 * fonction pour ajouter un deck à la bd
 * @param deck 
 * @returns 
 */
async function ajouter(deck: IDeck): Promise<IDeck> {
  const nouveauDeck = new Deck(deck);
  await nouveauDeck.save();
  return nouveauDeck;
}

/**
 * fonction pour modifier un deck selon son id
 * @param id 
 * @param deck 
 * @returns 
 */
async function modifier(id: string, deck: IDeck): Promise<IDeck> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de deck invalide');
  }
  const deckToUpdate = await Deck.findById(id);
  if (deckToUpdate === null) {
    throw new Error('deck non trouvé');
  }

  deckToUpdate.nom = deck.nom;
  deckToUpdate.description = deck.description;
  deckToUpdate.leader = deck.leader;
  deckToUpdate.base = deck.base;
  deckToUpdate.createur = deck.createur;
  deckToUpdate.victoires = deck.victoires;
  deckToUpdate.cartes = deck.cartes;
  await deckToUpdate.save();

  return deckToUpdate;
}

/**
 * fonction pour ajouter +1 aux victoires d'un deck selon l'id du deck
 * @param id 
 * @returns 
 */
async function ajouterVictoire(id: string): Promise<IDeck> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de deck invalide');
  }
  const deckToUpdate = await Deck.findById(id);
  if (deckToUpdate === null) {
    throw new Error('deck non trouvé');
  }

  deckToUpdate.victoires = deckToUpdate.victoires + 1;
  await deckToUpdate.save();

  return deckToUpdate;
}

/**
 * fonction pour supprimer un deck selon son id
 * @param id 
 * @returns 
 */
async function supprimer(id: string): Promise<{ message: string }> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de deck invalide');
  }
  const result = await Deck.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Deck non trouvé');
  }
  return { message: 'Deck supprimé avec succès' };
}

// **** Export default **** //

export default {
  obtenirTout,
  chercherParId,
  ajouter,
  modifier,
  ajouterVictoire,
  supprimer,
} as const;