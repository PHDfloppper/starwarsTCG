import HttpStatusCodes from '../common/constants/HttpStatusCodes';

import PartieService from '../services/PartieService';
import { IPartie } from '../models/parties';
import { IReq, IRes } from '../common/util/misc';

/**
 * fonction de route pour obtenir toute les parties
 * @param req 
 * @param res 
 * @returns 
 */
async function obtenirTout(req: IReq, res: IRes) {
  const parties = await PartieService.obtenirTout();
  return res.status(HttpStatusCodes.OK).json({ parties });
}

/**
 * fonction de route pour obtenir une partie selon son id
 * @param req 
 * @param res 
 * @returns 
 */
async function chercherParId(req: IReq, res: IRes) {
  const id = req.params.id;
  const parties = await PartieService.chercherParId(id);
  return res.status(HttpStatusCodes.OK).json({ parties });
}

/**
 * fonction de route pour ajouter une partie à la bd
 * @param req 
 * @param res 
 * @returns 
 */
async function ajouter(req: IReq<{ partie: IPartie }>, res: IRes) {
  let { partie } = req.body;
  try {
    const partieCree = await PartieService.ajouter(partie);
    return res.status(HttpStatusCodes.CREATED).json({ partie: partieCree.toObject() });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
  }
}

/**
 * fonction de route pour modifier une partie selon son id
 * @param req 
 * @param res 
 * @returns 
 */
async function modifier(req: IReq<{ partie: IPartie }>, res: IRes) {
  const id = req.params.id;
  try {
    let { partie } = req.body;
    partie = await PartieService.modifier(id, partie);
    return res.status(HttpStatusCodes.OK).json({ partie });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
  }

}

/**
 * fonction de route pour supprimer une partie selon son id
 * @param req 
 * @param res 
 * @returns 
 */
async function supprimer(req: IReq, res: IRes) {
  const id = req.params.id;
  try {
    const result = await PartieService.supprimer(id);
    return res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({ error: error.message });
  }
}

// **** Export default **** //

export default {
  obtenirTout,
  chercherParId,
  ajouter,
  modifier,
  supprimer,
} as const;