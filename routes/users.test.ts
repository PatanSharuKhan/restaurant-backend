import request from 'supertest';
var app = require('../app');
import User from '../models/user.model'

describe('Users API', () => {
    let testUser: InstanceType<typeof User> | null;

    beforeAll(async () => {
        testUser = await User.findOne({ email: 'alice@gmail.com' })
    })

    it('GET /users --> array users', async () => {
        const response = await request(app).get('/users').expect('Content-Type', /json/).expect(200);
        expect(Array.isArray(response.body)).toBe(true);
    })

    it('GET /users/id --> specific user by ID', async () => {
        const response = await request(app).get(`/users/${testUser?._id}`).expect('Content-Type', /json/).expect(200);
        expect(response.body._id).toBe(testUser?._id.toString());
        expect(response.body.name).toBe(testUser?.name);
        expect(response.body.email).toBe(testUser?.email);
    });

    it('GET /users/id --> 404 if not found', () => {
        return request(app).get('/users/65ea8d9e4f1a3a5e6d3b2c1f').expect(404);
    });

    it('POST /users/register --> user registered', async () => {
        const response = await request(app).post('/users/register').send({
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

    it('POST /users/register --> error registering users with invalid validation', async () => {
        const response = await request(app).post('/users/register').send({
            name: 'test',
            email: {},
            password: 'test123'
        }).expect('Content-Type', /json/).expect(422);
        expect(response.body).toMatchObject({
            name: 'ValidationError'
        });
    });

    it('POST /users/register --> validates request body', async () => {
        await request(app).post('/users/register').send({
            name: 'test',
            email: 123,
        }).expect(422);
    });

    it('DELETE /users/id --> Deleted User', async () => {
        const response = await request(app).post('/users/register').send({
            name: 'test',
            email: 'test@test.com',
            password: 'password'
        }).expect(201);
        const res = await request(app).delete(`/users/${response.body._id}`).expect(200);
        expect(res.body).toEqual('Deleted Successfully');
    })

    it('DELETE /users/id --> Error if Delete Invalid User', async () => {
        await request(app).delete('/users/1').expect(422);
    })

    it('POST /login --> login user with valid credentials', async () => {
        const response = await request(app).post('/login').send({
            email: testUser?.email,
            password: testUser?.password
        }).expect(200);
        expect(response.body).toEqual('jwt-token')
    })

    it('POST /login --> login user with invalid credentials - wrong password', async () => {
        const response = await request(app).post('/login').send({
            email: testUser?.email,
            password: 'alice1234'
        }).expect(422);
        expect(response.body).toEqual('Invalid Password')
    })

    it('POST /login --> login user with valid credentials - wrong email', async () => {
        const response = await request(app).post('/login').send({
            email: 'alice@yahoo.com',
            password: testUser?.password
        }).expect(422);
        expect(response.body).toEqual('Invalid Credentials')
    })
})
