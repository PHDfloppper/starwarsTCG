import mongoose, { Schema, Document } from 'mongoose';

export interface IPartie extends Document {
  datePartie: Date;
  adversaire: string;
  deckUtilise: string;
  resultat: 'victoire' | 'défaite';
  commentaires?: string;
  utilisateur: string;
}

//schema partiellement généré par : OpenAI. (2023). ChatGPT (version 3 août 2023) [Modèle massif de langage]. https://chat.openai.com/chat
const PartieSchema: Schema = new Schema(
  {
    datePartie: {
      type: Date,
      required: [true, 'La date de la partie est obligatoire.'],
    },
    adversaire: {
      type: String,
      required: [true, "Le nom de l'adversaire est obligatoire."],
    },
    deckUtilise: {
      type: String,
      required: [true, 'Le nom du deck utilisé est obligatoire.'],
    },
    resultat: {
      type: String,
      enum: {
        values: ['victoire', 'défaite'],
        message: 'Le résultat doit être soit "victoire" soit "défaite".',
      },
      required: [true, 'Le résultat de la partie est obligatoire.'],
    },
    commentaires: {
      type: String,
    },
    utilisateur:{
      type: String,
      required: [true, 'L utilisateur de la partie est obligatoire.'],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPartie>('Partie', PartieSchema);
