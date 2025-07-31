import * as fs from "fs";

async function fetchCards() {
  const response = await fetch("https://api.swu-db.com/cards/twi");
  const cards = await response.json();
  console.log(cards);
    const cardsArray = cards.data;
  const filtered = cardsArray.map(card => ({
    nom: card.Name,
    type: card.Type,
    numero: card.Number
  }));

  fs.writeFileSync("twilight_of_the_republic_cards.json", JSON.stringify(filtered, null, 2), "utf-8");
  console.log("Fichier JSON créé : twilight_of_the_republic_cards.json");
}

fetchCards().catch(console.error);