
import { pgTable, serial, varchar, text, timestamp, uuid ,date} from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

export const usersTable = pgTable('usersTable', {
  id: uuid('id').default(uuidv4()).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).default(null), 
  firstName: varchar('firstname', { length: 100 }).notNull(),
  lastName: varchar('lastname', { length: 100 }).notNull(),
  picture: text('picture'), 
  googleAccessToken: text('googleAccessToken').default(null), 
  createdAt: timestamp('createdAt').defaultNow(),
});



export const refreshTokenTable = pgTable('tokenstable', {
  id: uuid('id').default(uuidv4()).primaryKey(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiryDate: date('expiryDate').notNull(),
  userId: uuid('userId').notNull().references(() => usersTable.id),
});