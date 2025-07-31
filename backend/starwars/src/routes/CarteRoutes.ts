import HttpStatusCodes from '../common/constants/HttpStatusCodes';

import CarteService from '../services/CarteService';
import { ICarte } from '../models/cartes';
import { IReq, IRes } from '../common/util/misc';

// **** Functions **** //

async function obtenirTout(_: IReq, res: IRes) {
  const cartes = await CarteService.obtenirTout();
  return res.status(HttpStatusCodes.OK).json({ cartes });
}


// **** Export default **** //

export default {
  obtenirTout,
} as const;