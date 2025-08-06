import mongoose, { Schema, Document } from 'mongoose';

export interface ICarte extends Document {
  nom: string;
  type: string;
  numero: number;
}

//Code partiellement généré par : OpenAI. (2023). ChatGPT (version 3 août 2023) [Modèle massif de langage]. https://chat.openai.com/chat
const CarteSchema: Schema = new Schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  numero: { type: Number, required: true },
});

export default mongoose.model<ICarte>('Carte', CarteSchema);
