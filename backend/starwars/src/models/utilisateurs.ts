import mongoose, { Schema, Document } from 'mongoose';

export interface IUtilisateur extends Document {
  nom: string;
  motDePasse: string;
}

const UtilisateurSchema: Schema = new Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de l’utilisateur est obligatoire.'],
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire.'],
  },
}, {
  timestamps: true // ajoute createdAt et updatedAt automatiquement
});

export default mongoose.model<IUtilisateur>('Utilisateur', UtilisateurSchema);
