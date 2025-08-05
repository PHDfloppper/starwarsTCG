import HttpStatusCodes from '../common/constants/HttpStatusCodes';

import DeckService from '../services/DeckService';
import { IDeck } from '../models/decks';
import { IReq, IRes } from '../common/util/misc';

// **** Functions **** //

async function obtenirTout(req: IReq, res: IRes) {
  const decks = await DeckService.obtenirTout();
  return res.status(HttpStatusCodes.OK).json({ decks });
}

async function chercherParId(req: IReq, res: IRes) {
  const id = req.params.id;
  const decks = await DeckService.chercherParId(id);
  return res.status(HttpStatusCodes.OK).json({ decks });
}

async function ajouter(req: IReq<{ deck: IDeck }>, res: IRes) {
  let { deck } = req.body;
  try {
    const deckAjouter = await DeckService.ajouter(deck);
    return res.status(HttpStatusCodes.CREATED).json({ deck: deckAjouter.toObject() });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
  }
}

async function modifier(req: IReq<{ deck: IDeck }>, res: IRes) {
  const id = req.params.id;
  try {
    let { deck } = req.body;
    deck = await DeckService.modifier(id, deck);
    return res.status(HttpStatusCodes.OK).json({ deck });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
  }

}

async function ajouterVictoire(req: IReq, res: IRes) {
  const id = req.params.id;
  try {
    await DeckService.ajouterVictoire(id);
    return res.status(HttpStatusCodes.OK).json({ message: "victoire ajouté" });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
  }

}

async function supprimer(req: IReq, res: IRes) {
  const id = req.params.id;
  try {
    const result = await DeckService.supprimer(id);
    return res.status(HttpStatusCodes.OK).json(result); // envoie { message: '...' }
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
  ajouterVictoire,
  supprimer,
} as const;