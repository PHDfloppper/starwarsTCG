import HttpStatusCodes from '../common/constants/HttpStatusCodes';

import CarteService from '../services/CarteService';
import { ICarte } from '../models/cartes';
import { IReq, IRes } from '../common/util/misc';

/**
 * fonction de route pour obtenir tout les cartes
 * @param req 
 * @param res 
 * @returns 
 */
async function obtenirTout(req: IReq, res: IRes) {
  const cartes = await CarteService.obtenirTout();
  return res.status(HttpStatusCodes.OK).json({ cartes });
}


// **** Export default **** //

export default {
  obtenirTout,
} as const;