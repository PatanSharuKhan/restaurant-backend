import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.RESTAURANT_DATABASE_URL = mongod.getUri();
    console.log('Inmemory mongodb started.')
})

afterAll(async () => {
    if (mongod) {
        await mongod.stop();
    }
    console.log('InMemory Mongodb stopped.')
})
