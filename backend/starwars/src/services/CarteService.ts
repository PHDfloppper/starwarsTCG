import CarteRepo from '../repos/CartesRepo';
import { ICarte } from '../models/cartes';
import { RouteError } from '../common/util/route-errors';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';

function obtenirTout(): Promise<ICarte[]> {
  return CarteRepo.obtenirTout();
}

// **** Export default **** //

export default {
  obtenirTout,
} as const;