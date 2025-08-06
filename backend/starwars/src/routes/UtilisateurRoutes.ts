import HttpStatusCodes from '../common/constants/HttpStatusCodes';
import bcrypt from 'bcrypt';
import UtilisateurService from '../services/UtilisateurService';
import { IUtilisateur } from '../models/utilisateurs';
import { IReq, IRes } from '../common/util/misc';

const saltRounds = 10; //source pour bcrypt: https://www.npmjs.com/package/bcrypt

/**
 * fonction de route pour obtenir tout les utilisateurs
 * @param req 
 * @param res 
 * @returns 
 */
async function obtenirTout(req: IReq, res: IRes) {
  const utilisateurs = await UtilisateurService.obtenirTout();
  return res.status(HttpStatusCodes.OK).json({ utilisateurs });
}

/**
 * fonction de route pour obtenir un utilisateur selon son id
 * @param req 
 * @param res 
 * @returns 
 */
async function chercherParId(req: IReq, res: IRes) {
  const id = req.params.id;
  const utilisateur = await UtilisateurService.chercherParId(id);
  return res.status(HttpStatusCodes.OK).json({ utilisateur });
}

/**
 * fonction de route pour ajouter un utilisateur dans la bd
 * crypte le mot de passe avant de l'envoyer dans la bd
 * @param req 
 * @param res 
 * @returns 
 */
async function ajouter(req: IReq<{ utilisateur: IUtilisateur }>, res: IRes) {
  let { utilisateur } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(utilisateur.motDePasse, saltRounds);
    utilisateur.motDePasse = hashedPassword;
    utilisateur = await UtilisateurService.ajouter(utilisateur);
    return res.status(HttpStatusCodes.CREATED).json({ utilisateur });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
  }
}

/**
 * fonction de route qui vérifie le mot de passe donné et le nom d'utilisateur donné dans la bd. 
 * Renvoie vrai si le nom de user existe avec le mot de passe donné, sinon renvoie faux.
 * @param req 
 * @param res 
 * @returns 
 */
async function verifierMdp(req: IReq<{ utilisateur: IUtilisateur }>, res: IRes) {
  const { utilisateur } = req.body;

  try {
    const utilisateurTrouve = await UtilisateurService.verifierMdp(utilisateur);
    
    console.log(utilisateurTrouve);

    if (!utilisateurTrouve) {
      return res.status(200).json({ message: 'false' });
    }

    return res.status(200).json({ message: 'true', utilisateur: utilisateur.nom});
  } catch (error) {
    console.error('Erreur dans la vérification du mot de passe :', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}

/**
 * fonction de route pour supprimer un utilisateur selon son id
 * @param req 
 * @param res 
 * @returns 
 */
async function supprimer(req: IReq, res: IRes) {
  const id = req.params.id;
  try {
    const result = await UtilisateurService.supprimer(id);
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
  verifierMdp,
  supprimer,
} as const;