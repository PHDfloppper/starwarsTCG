import request from 'supertest';
import app from '../src/server'; // adapte selon ton chemin réel
import mongoose from 'mongoose';


beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/starwars_test');
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Tests des routes /api/cartes', () => {

    //test qui récupère toute les cartes
    it('GET /api/cartes/all - devrait retourner toutes les cartes', async () => {
        const res = await request(app).get('/api/cartes/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.cartes)).toBe(true);
        expect(res.body.cartes.length).toBeGreaterThanOrEqual(1);
    });

});
