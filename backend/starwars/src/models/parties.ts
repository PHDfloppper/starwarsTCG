import mongoose, { Schema, Document } from 'mongoose';

export interface IPartie extends Document {
  datePartie: Date;
  adversaire: string;
  deckUtilise: string;
  resultat: 'victoire' | 'défaite';
  commentaires?: string;
}

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
  },
  { timestamps: true }
);

export default mongoose.model<IPartie>('Partie', PartieSchema);
