import { pgTable, varchar, pgEnum, boolean, serial, integer, timestamp } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['ADMIN', 'DEVELOPER', 'USER']);

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('firstName', { length: 255 }),
    lastName: varchar('lastName', { length: 255 }),
    jobTitle: varchar('jobTitle', { length: 255 }),
    photo: varchar('photo', { length: 255 }),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    role: roleEnum('role').default('USER').notNull(),
    isVerified: boolean('isVerified').default(false).notNull(),
});

export const postsTable = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    userId: integer('userId').references(() => usersTable.id),
});
