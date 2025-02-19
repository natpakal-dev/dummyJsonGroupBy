import request from 'supertest';
import app from './server';

describe('GET /transformed-data', () => {
    it('should return transformed data', async () => {
        const response = await request(app).get('/transformed-data');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(typeof response.body).toBe('object');
    });
});
