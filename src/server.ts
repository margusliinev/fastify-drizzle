import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify';
import { db } from './database';

const fastify = Fastify({
    logger: false,
});

fastify.get('/', async function handler() {
    const users = await db.query.users.findMany();
    return { success: true, data: users };
});

const start = async () => {
    try {
        await fastify.listen({ port: 5000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

void start();
