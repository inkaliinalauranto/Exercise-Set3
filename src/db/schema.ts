import { relations, sql } from "drizzle-orm";
import { AnySQLiteColumn, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Määritellään posts-muuttujaan luotava taulu sarakkeineen:
export const posts = sqliteTable("posts", {
    /* primaryKey-metodi määrittelee sarakkeen myös automaattisesti AI:ksi 
    ja NN:ksi: */
    id: integer("id").primaryKey(),
    content: text("content").notNull(), 
    createdAt: integer("created_at").notNull().default(sql`(current_timestamp)`),
    parentPostId: integer("parent_post_id").references((): AnySQLiteColumn => posts.id), 
    userId: integer("user_id").notNull()
});


// Relaatio aloitusviestistä vastausviesteihin:
export const fromStarterToResponse = relations(posts, ({ many }) => ({
    posts: many(posts, {
        relationName: "postRelations"
    })
}));


// Relaatio vastausviestistä aloitusviestiin:
export const fromResponseToStarter = relations(posts, ({ one }) => ({
    parent: one(posts, {
        /* Vierasavain, joka viittaa toisen (tässä tapaukessa oman) taulun 
        primary keyhyn: */
        fields: [posts.parentPostId], 
        /* Taulun ensisijainen avain, josta toisen (tässä tapauksessa oman) 
        taulun vierasavaimelle saadaan arvo eli viite: */
        references: [posts.id], 
        relationName: "postRelations"
    })
}))


