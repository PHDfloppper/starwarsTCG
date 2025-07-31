import PartieRepo from '../repos/PartiesRepo';
import { IPartie } from '../models/parties';
import { RouteError } from '../common/util/route-errors';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';


function obtenirTout(): Promise<IPartie[]> {
  return PartieRepo.obtenirTout();
}

function chercherParId(id:string): Promise<IPartie> {
  return PartieRepo.chercherParId(id);
}

function ajouter(partie: IPartie): Promise<IPartie> {
  return PartieRepo.ajouter(partie);
}

async function modifier(id: string, partie: IPartie): Promise<IPartie> {
  return PartieRepo.modifier(id, partie);
}

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