import { pgTable, varchar, pgEnum, boolean, serial, integer, timestamp, date, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ENUMS

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'DEVELOPER', 'USER']);
export const projectRoleEnum = pgEnum('project_role', ['LEAD', 'MEMBER']);
export const projectStatusEnum = pgEnum('project_status', ['COMPLETED', 'MAINTENANCE', 'ON_HOLD', 'DEVELOPMENT', 'PLANNING']);
export const ticketStatusEnum = pgEnum('ticket_status', ['RESOLVED', 'ON_HOLD', 'IN_DEVELOPMENT', 'ASSIGNED', 'UNASSIGNED']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
export const ticketTypeEnum = pgEnum('ticket_type', ['FEATURE', 'BUG']);

// TABLES

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    first_name: varchar('first_name', { length: 255 }),
    last_name: varchar('last_name', { length: 255 }),
    photo: varchar('photo', { length: 255 }),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true, precision: 6 }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'date', withTimezone: true, precision: 6 }).defaultNow().notNull(),
    is_verified: boolean('is_verified').default(false).notNull(),
    role: userRoleEnum('role').default('USER').notNull(),
});

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    start_date: date('start_date').notNull(),
    due_date: date('due_date').notNull(),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true, precision: 6 }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'date', withTimezone: true, precision: 6 }).defaultNow().notNull(),
    completed_at: timestamp('completed_at', { mode: 'date', withTimezone: true, precision: 6 }),
    is_archived: boolean('is_archived').default(false).notNull(),
    status: projectStatusEnum('status').default('PLANNING').notNull(),
});

export const users_projects = pgTable(
    'users_projects',
    {
        user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        project_id: integer('project_id').references(() => projects.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        role: projectRoleEnum('role').default('MEMBER').notNull(),
    },
    (table) => {
        return {
            primaryKeys: primaryKey({ columns: [table.user_id, table.project_id] }),
        };
    },
);

export const tickets = pgTable('tickets', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true, precision: 6 }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'date', withTimezone: true, precision: 6 }).defaultNow().notNull(),
    resolved_at: timestamp('resolved_at', { mode: 'date', withTimezone: true, precision: 6 }),
    is_archived: boolean('is_archived').default(false).notNull(),
    type: ticketTypeEnum('type').default('BUG').notNull(),
    status: ticketStatusEnum('status').default('UNASSIGNED').notNull(),
    priority: ticketPriorityEnum('priority').default('LOW').notNull(),
    assignee_id: integer('assignee_id').references(() => users.id, { onDelete: 'set null', onUpdate: 'cascade' }),
    project_id: integer('project_id').references(() => projects.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    content: varchar('content', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { mode: 'date', withTimezone: true, precision: 6 }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'date', withTimezone: true, precision: 6 }).defaultNow().notNull(),
    user_id: integer('user_id').references(() => users.id, { onDelete: 'set null', onUpdate: 'cascade' }),
    ticket_id: integer('ticket_id').references(() => tickets.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
    users_projects: many(users_projects),
    tickets: many(tickets),
    comments: many(comments),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
    users_projects: many(users_projects),
    tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
    assignee: one(users, {
        fields: [tickets.assignee_id],
        references: [users.id],
    }),
    project: one(projects, {
        fields: [tickets.project_id],
        references: [projects.id],
    }),
    comments: many(comments),
}));

export const users_projects_relations = relations(users_projects, ({ one }) => ({
    user: one(users, {
        fields: [users_projects.user_id],
        references: [users.id],
    }),
    project: one(projects, {
        fields: [users_projects.project_id],
        references: [projects.id],
    }),
}));
