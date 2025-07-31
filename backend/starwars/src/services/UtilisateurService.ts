import UtilisateurRepo from '../repos/UtilisateursRepo';
import { IUtilisateur } from '../models/utilisateurs';
import { RouteError } from '../common/util/route-errors';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';


function obtenirTout(): Promise<IUtilisateur[]> {
  return UtilisateurRepo.obtenirTout();
}

function chercherParId(id:string): Promise<IUtilisateur> {
  return UtilisateurRepo.chercherParId(id);
}

function ajouter(partie: IUtilisateur): Promise<IUtilisateur> {
  return UtilisateurRepo.ajouter(partie);
}

function verifierMdp(partie: IUtilisateur): Promise<Boolean> {
  return UtilisateurRepo.verifierMdp(partie);
}

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