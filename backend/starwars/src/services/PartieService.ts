import PartieRepo from '../repos/PartiesRepo';
import { IPartie } from '../models/parties';
import { RouteError } from '../common/util/route-errors';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';

/**
 * fonction de service pour obtenir toute les parties
 * @returns 
 */
function obtenirTout(): Promise<IPartie[]> {
  return PartieRepo.obtenirTout();
}

/**
 * fonction de service pour obtenir une partie par son id
 * @param id 
 * @returns 
 */
function chercherParId(id:string): Promise<IPartie> {
  return PartieRepo.chercherParId(id);
}

/**
 * fonction de service pour ajouter une partie à la bd
 * @param partie 
 * @returns 
 */
function ajouter(partie: IPartie): Promise<IPartie> {
  return PartieRepo.ajouter(partie);
}

/**
 * fonction de service pour modifier une partie selon son id
 * @param id 
 * @param partie 
 * @returns 
 */
async function modifier(id: string, partie: IPartie): Promise<IPartie> {
  return PartieRepo.modifier(id, partie);
}

/**
 * fonction de service pour supprimer une partie selon son id
 * @param id 
 * @returns 
 */
async function supprimer(id: string): Promise<{ message: string }> {
  return PartieRepo.supprimer(id);
}

// **** Export default **** //

export default {
  obtenirTout,
  chercherParId,
  ajouter,
  modifier,
  supprimer,
} as const;