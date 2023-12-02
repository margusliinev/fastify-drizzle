import dotenv from 'dotenv';
dotenv.config();
import { usersTable } from './schema';
import { db } from '.';
import users from './users.json';
import bcrypt from 'bcryptjs';

async function seed() {
    await db.delete(usersTable);
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db
            .insert(usersTable)
            .values({
                username: user.username,
                email: user.email,
                password: hashedPassword,
            })
            .returning();
    }
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
