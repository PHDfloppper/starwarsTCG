import mongoose from 'mongoose';
import decks from '../models/decks';
import Deck, { IDeck } from '../models/decks'

/**
 * fonction qui renvoie toute les cartes possibles
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

async function ajouter(deck: IDeck): Promise<IDeck> {
  const nouveauDeck = new Deck(deck);
  await nouveauDeck.save();
  return nouveauDeck;
}

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
  supprimer,
} as const;