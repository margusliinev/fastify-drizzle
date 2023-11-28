import Fastify from 'fastify';

const fastify = Fastify({
    logger: process.env.NODE_ENV === 'production',
});

fastify.get('/', function handler() {
    return { hello: 'world' };
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
