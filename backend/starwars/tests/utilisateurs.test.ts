import request from 'supertest';
import app from '../src/server'; // adapte selon ton chemin réel
import mongoose from 'mongoose';

/**
 * ces tests sont inspiré des notes de dev web 3. 
 */
const utilisateurValide = {
    nom: "luke",
    motDePasse: "force123",
};

const utilisateurNonvalide = {
    motDePasse: "force123",
};


let idUtilisateurCreee = "";

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/starwars_test');
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Tests des routes /api/utilisateurs', () => {

    //test valide de post de utilisateur
    it('POST /api/utilisateurs/ajouter - devrait créer un utilisateur', async () => {
        const res = await request(app)
            .post('/api/utilisateurs/ajouter')
            .send({ utilisateur: utilisateurValide });

        expect(res.status).toBe(201);
        expect(res.body.utilisateur).toHaveProperty('_id');
        expect(res.body.utilisateur).toMatchObject({
            nom: utilisateurValide.nom,
        });
        idUtilisateurCreee = res.body.utilisateur._id;
    });

    //test invalide de post avec un champ vide
    it('POST /api/utilisateurs/ajouter - doit renvoyer un message que le champ est obligatoire', async () => {
        const utilisateurInvalide = { ...utilisateurValide, nom: "" };
        const res = await request(app)
            .post('/api/utilisateurs/ajouter')
            .send({ utilisateur: utilisateurInvalide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("nom: Le nom de l’utilisateur est obligatoire.");
    });

    //test invalide de poste avec un champ manquant
    it('POST /api/utilisateurs/ajouter - doit renvoyer un message que le champ est obligatoire', async () => {
        const res = await request(app)
            .post('/api/utilisateurs/ajouter')
            .send({ utilisateur: utilisateurNonvalide });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("nom: Le nom de l’utilisateur est obligatoire.");
    });

    //test valide de get de tout les utilisateurs
    it('GET /api/utilisateurs/all - devrait retourner touts les utilisateurs', async () => {
        const res = await request(app).get('/api/utilisateurs/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.utilisateurs)).toBe(true);
        expect(res.body.utilisateurs.length).toBeGreaterThanOrEqual(1);
    });

    //test valide de get de l'utilisateur selon son id
    it('GET /api/utilisateurs/:id - devrait retourner l utilisateurs selon l id', async () => {
        const res = await request(app).get(`/api/utilisateurs/${idUtilisateurCreee}`);
        expect(res.status).toBe(200);
        expect(res.body.utilisateur._id).toContain(idUtilisateurCreee);
    });

    //test invalide de delete avec un id invalide
    it('DELETE /api/utilisateurs/supprimer/:id - devrait retouner un erreur que le id est pas bon', async () => {
        const res = await request(app).delete(`/api/utilisateurs/supprimer/6888e68bb`);
        expect(res.status).toBe(404);
        expect(res.body.error).toContain("ID de utilisateur invalide");
    });

    //test valide de delete
    it('DELETE /api/utilisateurs/supprimer/:id - devrait supprimer le deck', async () => {
        const res = await request(app).delete(`/api/utilisateurs/supprimer/${idUtilisateurCreee}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("supprimé");
    });
});
