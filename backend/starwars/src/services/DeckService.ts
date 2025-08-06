import DeckRepo from '../repos/DecksRepo';
import { IDeck } from '../models/decks';
import { RouteError } from '../common/util/route-errors';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';

/**
 * fonction de service pour obtenir tout les decks
 * @returns 
 */
function obtenirTout(): Promise<IDeck[]> {
  return DeckRepo.obtenirTout();
}

/**
 * fonction de service pour obtenir un deck selon son id
 * @param id 
 * @returns 
 */
function chercherParId(id:string): Promise<IDeck> {
  return DeckRepo.chercherParId(id);
}

/**
 * fonction de service pour ajouter un deck 
 * @param deck 
 * @returns 
 */
function ajouter(deck: IDeck): Promise<IDeck> {
  return DeckRepo.ajouter(deck);
}

/**
 * fonction de service pour modifier un deck selon son id
 * @param id 
 * @param deck 
 * @returns 
 */
async function modifier(id:string, deck: IDeck): Promise<IDeck> {
  return DeckRepo.modifier(id,deck);
}

/**
 * fonction de service pour ajouter +1 aux victoire du deck selon l'id du deck
 * @param id 
 * @returns 
 */
async function ajouterVictoire(id:string): Promise<IDeck> {
  return DeckRepo.ajouterVictoire(id);
}

/**
 * fonction de service pour supprimer un deck selon son id
 * @param id 
 * @returns 
 */
async function supprimer(id: string): Promise<{ message: string }> {
  return DeckRepo.supprimer(id);
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