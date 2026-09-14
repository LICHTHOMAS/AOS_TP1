import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from '../src/app.js';

const app = buildApp();

describe('GET /products/:id', () => {
    it('renvoie 200 et le produit', async () => {
        const res = await request(app).get('/products/2');
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Souris sans fil');
    });
    it('renvoie 404 en problem+json si absent', async () => {
        const res = await request(app).get('/products/999');
        expect(res.status).toBe(404);
        expect(res.headers['content-type']).toContain('application/problem+json');
    });
    it("renvoie 400 si l'id est invalide", async () => {
        const res = await request(app).get('/products/abc');
        expect(res.status).toBe(400);
    });
});

describe('GET /products', () =>{
    it('renvoie 5 produits', async () => {
        const res = await request(app).get('/products');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(5);
    });
});

describe('GET /health', () => {
    it('renvoie 200 et un status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});