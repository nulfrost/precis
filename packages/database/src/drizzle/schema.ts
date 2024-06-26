import { sql, relations } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const users = sqliteTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  username: text("username"),
  created_at: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const guestbooks = sqliteTable("guestbooks", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  api_key: text("api_key"),
  api_url: text("api_url"),
  created_at: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
});

export const messages = sqliteTable("messages", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  username: text("name").notNull(),
  message: text("message").notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  guestbook_id: text("guestbook_id"),
});

export const usersRelations = relations(users, ({ one }) => ({
  guestbook: one(guestbooks, {
    fields: [users.id],
    references: [guestbooks.user_id],
    relationName: "user_guestbook",
  }),
}));

export const guestbooksRelations = relations(guestbooks, ({ many }) => ({
  messages: many(messages, {
    relationName: "guestbook_messages",
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  guestbook: one(guestbooks, {
    fields: [messages.guestbook_id],
    references: [guestbooks.id],
    relationName: "guestbook_messages",
  }),
}));
