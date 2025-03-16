import request from 'supertest';
var app = require('../app');

describe('Users API', () => {
    it('GET /users --> array users', async () => {
        const response = await request(app).get('/users').expect('Content-Type', /json/).expect(200);
        expect(Array.isArray(response.body)).toBe(true);
    })

    it('GET /users/id --> specific user by ID', async () => {
        const response = await request(app).get('/users/1').expect('Content-Type', /json/).expect(200);
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe('Alice');
        expect(response.body.email).toBe('alice@gmail.com');
    });

    it('GET /users/id --> 404 if not found', () => {
        return request(app).get('/users/100').expect(404);
    });

    it('POST /users --> created users', async () => {
        const response = await request(app).post('/users').send({
            name: 'test',
            email: 'test@gmail.com',
            password: 'test123'
        }).expect('Content-Type', /json/).expect(201);
        expect(response.body).toMatchObject({
            name: 'test',
            email: 'test@gmail.com',
            password: 'test123'
        });
    });

    it('GET /users --> validates request body', async () => {
        const response = await request(app).post('/users').send({
            name: 'test',
            email: 123,
        }).expect(422);
    });
})