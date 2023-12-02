import { pgTable, varchar, pgEnum, boolean, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['ADMIN', 'DEVELOPER', 'USER']);

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: false, precision: 6 }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'date', withTimezone: false, precision: 6 }).defaultNow().notNull(),
    is_verified: boolean('is_verified').default(false).notNull(),
    role: roleEnum('role').default('USER').notNull(),
});

export const postsTable = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: false, precision: 6 }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'date', withTimezone: false, precision: 6 }).defaultNow().notNull(),
    author_id: integer('author_id').references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
    posts: many(postsTable),
}));

export const postsRelations = relations(postsTable, ({ one }) => ({
    author: one(usersTable, {
        fields: [postsTable.author_id],
        references: [usersTable.id],
    }),
}));
