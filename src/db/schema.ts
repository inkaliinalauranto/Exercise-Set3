import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Määritellään posts-muuttujaan luotava taulu sarakkeineen:
export const posts = sqliteTable("posts", {
    // primaryKey-metodi määrittelee sarakkeen myös automaattisesti NN:ksi: 
    id: integer("id").primaryKey(),
    topic: text("topic").notNull(), 
    content: text("content").notNull(), 
    createdAt: integer("created_at").notNull(),
    parentPostId: integer("parent_post_id"), 
    userId: integer("user_id").notNull()
});

