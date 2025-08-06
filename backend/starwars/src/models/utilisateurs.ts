import mongoose, { Schema, Document } from 'mongoose';

export interface IUtilisateur extends Document {
  nom: string;
  motDePasse: string;
}

//schema partiellement généré par : OpenAI. (2023). ChatGPT (version 3 août 2023) [Modèle massif de langage]. https://chat.openai.com/chat
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
