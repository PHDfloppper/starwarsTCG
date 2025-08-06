import mongoose from 'mongoose';
import Utilisateur, {IUtilisateur} from '../models/utilisateurs'
import bcrypt from 'bcrypt';

/**
 * fonction qui renvoie toute les cartes possibles
 * @returns 
 */
async function obtenirTout(): Promise<IUtilisateur[]> {
  try {
    const utilisateurs = await Utilisateur.find().sort({ numero: 1 });
    return utilisateurs;
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err);
    throw new Error('Impossible de récupérer les utilisateurs.');
  }
}

/**
 * chercher un utilisateur selon son id
 * @param id 
 * @returns 
 */
async function chercherParId(id: string): Promise<IUtilisateur> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de utilisateur invalide');
  }
  const utilisateur = await Utilisateur.findById(id);
  if (!utilisateur) {
    throw new Error('utilisateur non trouvé');
  }
  return utilisateur;
}

/**
 * fonction pour ajouter un utilisateur dans la bd
 * @param utilisateur 
 * @returns 
 */
async function ajouter(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  const nouveauxUtilisateur = new Utilisateur(utilisateur);
  await nouveauxUtilisateur.save();
  return nouveauxUtilisateur;
}

/**
 * fonction qui vérifie le mot de passe donné et le nom d'utilisateur donné dans la bd. 
 * Renvoie vrai si le nom de user existe avec le mot de passe donné, sinon renvoie faux.
 * @param utilisateur 
 * @returns 
 */
async function verifierMdp(utilisateur: IUtilisateur): Promise<boolean> {
  try {
    const utilisateurTrouve = await Utilisateur.findOne({ nom: utilisateur.nom });

    if (!utilisateurTrouve) {
      return false;
    }

    const motDePasseEstValide = await bcrypt.compare(utilisateur.motDePasse, utilisateurTrouve.motDePasse);

    return motDePasseEstValide;
  } catch (err) {
    console.error('Erreur lors de la vérification du mot de passe :', err);
    throw new Error('Erreur de vérification');
  }
}

/**
 * fonction pour supprimer un utilisateur selon sont id
 * @param id 
 * @returns 
 */
async function supprimer(id: string): Promise<{ message: string }> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de utilisateur invalide');
  }
  const result = await Utilisateur.findByIdAndDelete(id);
  if (!result) {
    throw new Error('utilisateur non trouvé');
  }
  return { message: 'utilisateur supprimé avec succès' };
}

// **** Export default **** //

export default {
  obtenirTout,
  chercherParId,
  ajouter,
  verifierMdp,
  supprimer,
} as const;