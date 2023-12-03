import dotenv from 'dotenv';
dotenv.config();
import { users } from './schema';
import { db } from '.';
import mockUsers from './users.json';
import bcrypt from 'bcryptjs';

async function seed() {
    await db.delete(users);
    for (const user of mockUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db
            .insert(users)
            .values({
                username: user.username,
                email: user.email,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .returning();
    }
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
