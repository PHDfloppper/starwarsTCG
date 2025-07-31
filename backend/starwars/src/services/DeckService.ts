import DeckRepo from '../repos/DecksRepo';
import { IDeck } from '../models/decks';
import { RouteError } from '../common/util/route-errors';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';


function obtenirTout(): Promise<IDeck[]> {
  return DeckRepo.obtenirTout();
}

function chercherParId(id:string): Promise<IDeck> {
  return DeckRepo.chercherParId(id);
}

function ajouter(deck: IDeck): Promise<IDeck> {
  return DeckRepo.ajouter(deck);
}

async function modifier(id:string, deck: IDeck): Promise<IDeck> {
  return DeckRepo.modifier(id,deck);
}

async function supprimer(id: string): Promise<{ message: string }> {
  return DeckRepo.supprimer(id);
}

// **** Export default **** //

export default {
  obtenirTout,
  chercherParId,
  ajouter,
  modifier,
  supprimer,
} as const;