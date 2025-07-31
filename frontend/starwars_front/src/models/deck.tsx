export type CarteDansDeck = {
  numero: number;
  quantite: number;
};

export type Deck = {
  _id: string;
  nom: string;
  description?: string;
  leader: string;
  base: string;
  createur: string;
  victoires: number;
  cartes: CarteDansDeck[];
};