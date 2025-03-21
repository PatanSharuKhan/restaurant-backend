import request from 'supertest';
var app = require('../app');
import User from '../models/user.model'
import { UserTypes } from './users'
import { connectDB, disconnectDB } from '../db/db'

describe('Users API', () => {
    let testUser: UserTypes;

    beforeAll(async () => {
        try {
            await connectDB()
            testUser = await User.create({
                name: 'Alice',
                email: 'alice@gmail.com',
                password: 'test123'
            })
        } catch (err) {
            console.error('Error connecting to Database:', err)
        }
    })

    afterAll(async () => {
        try {
            await disconnectDB()
        } catch (err) {
            console.error('Error disconnecting the database.', err)
        }
    })

    it('GET /users --> array users', async () => {
        const response = await request(app).get('/users').expect('Content-Type', /json/).expect(200);
        expect(Array.isArray(response.body)).toBe(true);
    })

    it('GET /users/id --> specific user by ID', async () => {
        const response = await request(app).get(`/users/${testUser._id}`).expect('Content-Type', /json/).expect(200);
        expect(response.body._id).toBe(testUser._id.toString());
        expect(response.body.name).toBe(testUser.name);
        expect(response.body.email).toBe(testUser.email);
    });

    it('GET /users/id --> 404 if not found', () => {
        return request(app).get('/users/65ea8d9e4f1a3a5e6d3b2c1f').expect(404);
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
        await request(app).delete(`/users/${response.body._id}`).expect(200)
    });

    it('POST /users --> error creating users with invalid validation', async () => {
        const response = await request(app).post('/users').send({
            name: 'test',
            email: {},
            password: 'test123'
        }).expect('Content-Type', /json/).expect(422);
        expect(response.body).toMatchObject({
            name: 'ValidationError'
        });
    });

    it('GET /users --> validates request body', async () => {
        await request(app).post('/users').send({
            name: 'test',
            email: 123,
        }).expect(422);
    });

    it('DELETE /users/id --> Deleted User', async () => {
        const response = await request(app).post('/users').send({
            name: 'test',
            email: 'test@test.com',
            password: 'password'
        }).expect(201);
        await request(app).delete(`/users/${response.body._id}`).expect(200);
    })

    it('DELETE /users/id --> Error if Delete Invalid User', async () => {
        await request(app).delete('/users/1').expect(422);
    })
})