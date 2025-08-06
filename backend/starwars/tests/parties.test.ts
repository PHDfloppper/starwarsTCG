import request from 'supertest';
import app from '../src/server';
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
    utilisateur: "test",
};

const partieNonValide = {
    datePartie: "2025-07-20T14:00:00.000Z",
    adversaire: "JoueurTest",
    resultat: "victoire",
    commentaires: "Test de partie.",
    utilisateur: "test",
};

let idPartieCreee = "";

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/starwars_test');
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Tests des routes /api/parties', () => {

    //test d'un post valide
    it('POST /api/parties/ajouter - devrait créer une partie', async () => {
        const res = await request(app)
            .post('/api/parties/ajouter')
            .send({ partie: partieValide });

        expect(res.status).toBe(201);
        expect(res.body.partie).toHaveProperty('_id');
        expect(res.body.partie.adversaire).toBe(partieValide.adversaire);
        idPartieCreee = res.body.partie._id;
    });

    //test d'un post non valide avec un champ vide
    it('POST /api/parties/ajouter - doit renvoyer un message que le champ est obligatoire', async () => {
        const partieInvalide = { ...partieValide, adversaire: "" };
        const res = await request(app)
            .post('/api/parties/ajouter')
            .send({ partie: partieInvalide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("adversaire: Le nom de l'adversaire est obligatoire.");
    });

    //test invalide d'un poste avec un champ manquant
    it('POST /api/parties/ajouter - doit renvoyer un message que le champ est obligatoire', async () => {
        const res = await request(app)
            .post('/api/parties/ajouter')
            .send({ partie: partieNonValide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("deckUtilise: Le nom du deck utilisé est obligatoire.");
    });

    //test invalide d'un post avec un champ au mauvais format
    it('POST /api/parties/ajouter - doit renvoyer un message que la date n est pas au bon format', async () => {
        const partieInvalide = { ...partieValide, datePartie: "adawdawdwa" };
        const res = await request(app)
            .post('/api/parties/ajouter')
            .send({ partie: partieInvalide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("datePartie: Cast to date failed");
    });

    //test valide de get de tout les parties
    it('GET /api/parties/all - devrait retourner toutes les parties', async () => {
        const res = await request(app).get('/api/parties/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.parties)).toBe(true);
        expect(res.body.parties.length).toBeGreaterThanOrEqual(1);
    });

    //test valide de get selon l'id de la partie
    it('GET /api/parties/:id - devrait retourner la partie selon l id', async () => {
        const res = await request(app).get(`/api/parties/${idPartieCreee}`);
        expect(res.status).toBe(200);
        expect(res.body.parties._id).toContain(idPartieCreee);
    });

    //test valide d'un put sur une partie existante
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

    //test invalide d'un put avec un champ manquant
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

    //test invalide de put avec un champ au mauvais format
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

    //test invalide de put avec un id invalide
    it('PUT /api/parties/modifier/:id - PUT avec mauvais ID, devrait retourner une erreur 400', async () => {
        const res = await request(app)
            .put('/api/parties/modifier/invalid-id')
            .send({ partie: partieValide });
        expect(res.status).toBe(400);
    });

    //test qui delete un deck avec un id invalide
    it('DELETE /api/parties/supprimer/:id - devrait retouner un erreur que le id est pas bon', async () => {
        const res = await request(app).delete(`/api/parties/supprimer/6888e68bb`);
        expect(res.status).toBe(404);
        expect(res.body.error).toContain("ID de partie invalide");
    });

    //test valide de delete d'une partie
    it('DELETE /api/parties/supprimer/:id - devrait supprimer la partie', async () => {
        const res = await request(app).delete(`/api/parties/supprimer/${idPartieCreee}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("supprimé");
    });
});
