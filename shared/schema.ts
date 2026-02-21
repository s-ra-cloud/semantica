import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const synonymGroups = pgTable("synonym_groups", {
  id: serial("id").primaryKey(),
  language: text("language").notNull().default("en"),
  words: text("words").array().notNull(),
});

export const insertSynonymGroupSchema = createInsertSchema(synonymGroups).omit({ id: true });
export type InsertSynonymGroup = z.infer<typeof insertSynonymGroupSchema>;
export type SynonymGroup = typeof synonymGroups.$inferSelect;
