import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '.';

const start = async () => {
    await migrate(db, { migrationsFolder: './src/database/migrations' });

    await pool.end();
};

void start();
