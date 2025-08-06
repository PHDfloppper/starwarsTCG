import UtilisateurRepo from '../repos/UtilisateursRepo';
import { IUtilisateur } from '../models/utilisateurs';
import { RouteError } from '../common/util/route-errors';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';

/**
 * fonction de service qui renvoie tout les utilisateurs possible
 * @returns 
 */
function obtenirTout(): Promise<IUtilisateur[]> {
  return UtilisateurRepo.obtenirTout();
}

/**
 * fonction de service qui renvoie un utilisateur selon son id
 * @param id 
 * @returns 
 */
function chercherParId(id:string): Promise<IUtilisateur> {
  return UtilisateurRepo.chercherParId(id);
}

/**
 * fonction de service pour ajouter un utilisateur dans la bd
 * @param partie 
 * @returns 
 */
function ajouter(partie: IUtilisateur): Promise<IUtilisateur> {
  return UtilisateurRepo.ajouter(partie);
}

/**
 * fonction qui vérifie le mot de passe donné et le nom d'utilisateur donné dans la bd. 
 * Renvoie vrai si le nom de user existe avec le mot de passe donné, sinon renvoie faux.
 * @param partie 
 * @returns 
 */
function verifierMdp(partie: IUtilisateur): Promise<Boolean> {
  return UtilisateurRepo.verifierMdp(partie);
}

/**
 * fonction de service pour supprimer un utilisateur selon son id
 * @param id 
 * @returns 
 */
async function supprimer(id: string): Promise<{ message: string }> {
  return UtilisateurRepo.supprimer(id);
}

// **** Export default **** //

export default {
  obtenirTout,
  chercherParId,
  ajouter,
  verifierMdp,
  supprimer,
} as const;