import { MongoMemoryServer } from 'mongodb-memory-server';
import User from "./models/user.model"
import { connectDB, disconnectDB } from './db/db';

let mongod: MongoMemoryServer;

beforeAll(async () => {
    try {
        mongod = await MongoMemoryServer.create();
        process.env.RESTAURANT_DATABASE_URL = mongod.getUri();
        console.log('Inmemory mongodb started.')

        await connectDB()
        await User.insertMany([
            {
                name: 'Alice',
                email: 'alice@gmail.com',
                password: 'Alice@123'
            },
            {
                name: 'Bob',
                email: 'bob@gmail.com',
                password: 'Bob@123'
            },
            {
                name: 'admin',
                email: 'admin@gmail.com',
                password: 'Admin@123'
            },
            {
                name: 'user',
                email: 'user@gmail.com',
                password: 'User@123'
            }
        ])
    } catch (err) {
        console.error('Error connecting to Database:', err)
    }
})

afterAll(async () => {
    try {
        await User.deleteMany({})
        await disconnectDB()
    } catch (err) {
        console.error('Error disconnecting the database.', err)
    }

    if (mongod) {
        await mongod.stop();
    }
    console.log('InMemory Mongodb stopped.')
})
