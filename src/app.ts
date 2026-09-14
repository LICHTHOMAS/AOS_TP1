import express from 'express';
import { products } from './products.js';
import { z } from 'zod';

const IdParam = z.object({ id: z.string().regex(/^\d+$/, 'id must be a positiveinteger') });

export function buildApp() {
    const app = express();
    app.use(express.json());

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', service: 'product', uptime: process.uptime() });
    });

    app.get('/products', (_req, res) => {
        res.json(products);
    });

    app.get('/products/:id', (req, res) => {
        const parsed = IdParam.safeParse(req.params);
        if (!parsed.success) {
            res.status(400).type('application/problem+json').json({
                type: 'https://polyshop.fr/problems/validation',
                title: 'Validation failed',
                status: 400,
                errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message:
                i.message })),
            });
            return;
        }
        const product = products.find((p) => p.id === parsed.data.id);

        if (!product) {
            res.status(404).type('application/problem+json').json({
                type: 'https://polyshop.fr/problems/product-not-found',
                title: 'Product not found',
                status: 404,
                detail: `No product with id ${req.params.id}`,
                instance: req.originalUrl,
            });
        return;
        }
        res.json(product);
    });

    return app;
}