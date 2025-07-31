import HttpStatusCodes from '../common/constants/HttpStatusCodes';

import PartieService from '../services/PartieService';
import { IPartie } from '../models/parties';
import { IReq, IRes } from '../common/util/misc';

// **** Functions **** //

async function obtenirTout(_: IReq, res: IRes) {
  const parties = await PartieService.obtenirTout();
  return res.status(HttpStatusCodes.OK).json({ parties });
}

async function ajouter(req: IReq<{ partie: IPartie }>, res: IRes) {
  let { partie } = req.body;
  try {
    const partieCree = await PartieService.ajouter(partie);
    return res.status(HttpStatusCodes.CREATED).json({ partie: partieCree.toObject() });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
  }
}

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

async function supprimer(req: IReq, res: IRes) {
  const id = req.params.id;
  try {
    const result = await PartieService.supprimer(id);
    return res.status(HttpStatusCodes.OK).json(result); // envoie { message: '...' }
  } catch (error) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({ error: error.message });
  }
}

// **** Export default **** //

export default {
  obtenirTout,
  ajouter,
  modifier,
  supprimer,
} as const;