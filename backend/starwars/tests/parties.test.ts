import request from 'supertest';
import app from '../src/server'; // adapte selon ton chemin réel
import mongoose from 'mongoose';

/**
 * inspiré des notes de dev web 3. 
 */
const partieValide = {
    datePartie: "2025-07-20T14:00:00.000Z",
    adversaire: "JoueurTest",
    deckUtilise: "Deck Test",
    resultat: "victoire",
    commentaires: "Test de partie.",
};

const partieNonValide = {
    datePartie: "2025-07-20T14:00:00.000Z",
    adversaire: "JoueurTest",
    resultat: "victoire",
    commentaires: "Test de partie.",
};

let idPartieCreee = "";

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/starwars_test');
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Tests des routes /api/parties', () => {

    it('POST /api/parties/ajouter - devrait créer une partie', async () => {
        const res = await request(app)
            .post('/api/parties/ajouter')
            .send({ partie: partieValide });

        expect(res.status).toBe(201);
        console.log(res.body);
        expect(res.body.partie).toHaveProperty('_id');
        expect(res.body.partie.adversaire).toBe(partieValide.adversaire);
        idPartieCreee = res.body.partie._id;
    });

    it('POST /api/parties/ajouter - doit renvoyer un message que le champ est obligatoire', async () => {
        const partieInvalide = { ...partieValide, adversaire: "" };
        const res = await request(app)
            .post('/api/parties/ajouter')
            .send({ partie: partieInvalide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("adversaire: Le nom de l'adversaire est obligatoire.");
    });

    it('POST /api/parties/ajouter - doit renvoyer un message que le champ est obligatoire', async () => {
        const res = await request(app)
            .post('/api/parties/ajouter')
            .send({ partie: partieNonValide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("deckUtilise: Le nom du deck utilisé est obligatoire.");
    });

    it('POST /api/parties/ajouter - doit renvoyer un message que la date n est pas au bon format', async () => {
        const partieInvalide = { ...partieValide, datePartie: "adawdawdwa" };
        const res = await request(app)
            .post('/api/parties/ajouter')
            .send({ partie: partieInvalide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("datePartie: Cast to date failed");
    });

    it('GET /api/parties/all - devrait retourner toutes les parties', async () => {
        const res = await request(app).get('/api/parties/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.parties)).toBe(true);
        expect(res.body.parties.length).toBeGreaterThanOrEqual(1);
    });

    it('PUT /api/parties/modifier/:id - devrait modifier une partie existante', async () => {
        const nouvellePartie = {
            datePartie: "2025-07-29T15:00:00.000Z",
            adversaire: "Adversaire Modifié",
            deckUtilise: "Deck Modifié",
            resultat: "défaite",
            commentaires: "Modifié pour test.",
        };

        const res = await request(app)
            .put(`/api/parties/modifier/${idPartieCreee}`)
            .send({ partie: nouvellePartie });

        expect(res.status).toBe(200);
        expect(res.body.partie.adversaire).toBe("Adversaire Modifié");
    });

    it('PUT /api/parties/modifier/:id - devrait renvoyer un message d erreur de message manquant', async () => {
        const nouvellePartie = {
            datePartie: "2025-07-29T15:00:00.000Z",
            deckUtilise: "Deck Modifié",
            resultat: "défaite",
            commentaires: "Modifié pour test.",
        };

        const res = await request(app)
            .put(`/api/parties/modifier/${idPartieCreee}`)
            .send({ partie: nouvellePartie });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("adversaire: Le nom de l'adversaire est obligatoire.");
    });

    it('PUT /api/parties/modifier/:id - devrait renvoyer un message d erreur que la date est pas au bon format', async () => {
        const nouvellePartie = {
            datePartie: "awdawdwaddaw",
            deckUtilise: "Deck Modifié",
            adversaire: "Adversaire Modifié",
            resultat: "défaite",
            commentaires: "Modifié pour test.",
        };

        const res = await request(app)
            .put(`/api/parties/modifier/${idPartieCreee}`)
            .send({ partie: nouvellePartie });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("datePartie: Cast to date failed");
    });

    it('PUT avec mauvais ID - devrait retourner une erreur 400', async () => {
        const res = await request(app)
            .put('/api/parties/modifier/invalid-id')
            .send({ partie: partieValide });
        expect(res.status).toBe(400);
    });

    it('DELETE /api/parties/supprimer/:id - devrait supprimer la partie', async () => {
        const res = await request(app).delete(`/api/parties/supprimer/${idPartieCreee}`);
        console.log(idPartieCreee);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/supprimé/i);
    });
});
