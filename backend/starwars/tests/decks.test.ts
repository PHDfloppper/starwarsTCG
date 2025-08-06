import request from 'supertest';
import app from '../src/server'; // adapte selon ton chemin réel
import mongoose from 'mongoose';

/**
 * ces tests sont inspiré des notes de dev web 3. 
 */
const deckValide = {
    nom: "Deck Jedi",
    description: "Un deck basé sur les Jedi.",
    leader: "Luke Skywalker",
    base: "Base Echo",
    createur: "utilisateur123",
    victoires: 5,
    cartes: [
        { numero: 101, quantite: 2 },
        { numero: 202, quantite: 1 }
    ]
};

const deckValideModifie = {
    nom: "Deck modif",
    description: "Un deck basé sur les Jedi.",
    leader: "Luke Skywalker",
    base: "Base Echo",
    createur: "utilisateur123",
    victoires: 5,
    cartes: [
        { numero: 101, quantite: 2 },
        { numero: 202, quantite: 1 }
    ]
};


const deckNonValide = {
    description: "Un deck basé sur les Jedi.",
    leader: "Luke Skywalker",
    base: "Base Echo",
    createur: "utilisateur123",
    victoires: 5,
    cartes: [
        { numero: 101, quantite: 2 },
        { numero: 202, quantite: 1 }
    ]
};

const deckNonValideModif = {
    description: "Un deck modifie",
    leader: "Luke Skywalker",
    base: "Base Echo",
    createur: "utilisateur123",
    victoires: 5,
    cartes: [
        { numero: 101, quantite: 2 },
        { numero: 202, quantite: 1 }
    ]
};

let idDeckCreee = "";

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/starwars_test');
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Tests des routes /api/decks', () => {

    //test qui post un deck
    it('POST /api/decks/ajouter - devrait créer un deck', async () => {
        const res = await request(app)
            .post('/api/decks/ajouter')
            .send({ deck: deckValide });

        expect(res.status).toBe(201);
        expect(res.body.deck).toHaveProperty('_id');
        expect(res.body.deck).toMatchObject({
            nom: deckValide.nom,
            description: deckValide.description,
            leader: deckValide.leader,
            base: deckValide.base,
            createur: deckValide.createur,
            victoires: deckValide.victoires,
        });
        idDeckCreee = res.body.deck._id;
    });

    //test qui post avec un champ vide
    it('POST /api/decks/ajouter - doit renvoyer un message que le champ est obligatoire', async () => {
        const deckInvalide = { ...deckValide, base: "" };
        const res = await request(app)
            .post('/api/decks/ajouter')
            .send({ deck: deckInvalide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("base: La base du deck est obligatoire.");
    });

    //test qui poste avec un champ inexistant
    it('POST /api/decks/ajouter - doit renvoyer un message que le champ est obligatoire', async () => {
        const res = await request(app)
            .post('/api/decks/ajouter')
            .send({ deck: deckNonValide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("nom: Le nom du deck est obligatoire.");
    });

    //test qui post avec un champ pas au bon format
    it('POST /api/decks/ajouter - doit renvoyer un message que la victoire n est pas au bon format', async () => {
        const deckInvalide = { ...deckValide, victoires: "adawdawdwa" };
        const res = await request(app)
            .post('/api/decks/ajouter')
            .send({ deck: deckInvalide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("victoires: Cast to Number failed");
    });

    //test qui get tout les decks
    it('GET /api/decks/all - devrait retourner touts les decks', async () => {
        const res = await request(app).get('/api/decks/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.decks)).toBe(true);
        expect(res.body.decks.length).toBeGreaterThanOrEqual(1);
    });

    //test qui get un deck selon l'id
    it('GET /api/decks/:id - devrait retourner le deck selon l id', async () => {
        const res = await request(app).get(`/api/decks/${idDeckCreee}`);
        expect(res.status).toBe(200);
        expect(res.body.decks._id).toContain(idDeckCreee);
    });

    //test qui modifie un deck existant
    it('PUT /api/parties/modifier/:id - devrait modifier un deck existant', async () => {
        const res = await request(app)
            .put(`/api/decks/modifier/${idDeckCreee}`)
            .send({ deck: deckValideModifie });

        expect(res.status).toBe(200);
        expect(res.body.deck.nom).toBe("Deck modif");
    });

    //test qui modifie un deck avec un champ vide
    it('PUT /api/decks/modifier/:id - devrait renvoyer un message d erreur de nom manquant', async () => {
        const res = await request(app)
            .put(`/api/decks/modifier/${idDeckCreee}`)
            .send({ deck: deckNonValideModif });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("nom: Le nom du deck est obligatoire.");
    });

    //test qui modifie un deck avec un id inexistant
    it('PUT /api/decks/modifier/:id - PUT avec mauvais ID, devrait retourner une erreur 400', async () => {
        const res = await request(app)
            .put('/api/decks/modifier/invalid-id')
            .send({ deck: deckValide });
        expect(res.status).toBe(400);
        expect(res.body.error).toContain("ID de deck invalide");
    });

    //test qui delete un deck avec un id invalide
    it('DELETE /api/decks/supprimer/:id - devrait retouner un erreur que le id est pas bon', async () => {
        const res = await request(app).delete(`/api/decks/supprimer/6888e68bb`);
        expect(res.status).toBe(404);
        expect(res.body.error).toContain("ID de deck invalide");
    });

    //test qui delete un deck
    it('DELETE /api/decks/supprimer/:id - devrait supprimer le deck', async () => {
        const res = await request(app).delete(`/api/decks/supprimer/${idDeckCreee}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("supprimé");
    });
});
