import mongoose, { Schema, Document } from 'mongoose';

interface CarteDansDeck {
  numero: number;
  quantite: number;
}

export interface IDeck extends Document {
  nom: string;
  description?: string;
  leader: string;
  base: string;
  createur: string;
  victoires: number;
  cartes: CarteDansDeck[];
}

//schema partiellement généré par : OpenAI. (2023). ChatGPT (version 3 août 2023) [Modèle massif de langage]. https://chat.openai.com/chat
const CarteDansDeckSchema: Schema = new Schema({
  numero: { 
    type: Number, 
    required: [true, 'Le numéro de la carte est obligatoire.'] 
  },
  quantite: { 
    type: Number, 
    required: [true, 'La quantité est obligatoire.'], 
    min: [1, 'La quantité doit être au moins de 1.'] 
  },
}, { _id: false });

const DeckSchema: Schema = new Schema({
  nom: { 
    type: String, 
    required: [true, 'Le nom du deck est obligatoire.'] 
  },
  description: { 
    type: String 
  },
  leader: { 
    type: String, 
    required: [true, 'Le leader du deck est obligatoire.'] 
  },
  base: { 
    type: String, 
    required: [true, 'La base du deck est obligatoire.'] 
  },
  createur: { 
    type: String, 
    required: [true, 'Le créateur du deck est obligatoire.'] 
  },
  victoires: { 
    type: Number, 
    default: 0, 
    min: [0, 'Le nombre de victoires ne peut pas être négatif.'] 
  },
  cartes: { 
    type: [CarteDansDeckSchema], 
    default: [] 
  },
}, { timestamps: true });

export default mongoose.model<IDeck>('Deck', DeckSchema);
