import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const synonymGroups = pgTable("synonym_groups", {
  id: serial("id").primaryKey(),
  language: text("language").notNull().default("en"),
  words: text("words").array().notNull(),
  type: text("type").notNull().default("semantic"),
  groupKey: text("group_key"),
  excludedPropositions: text("excluded_propositions").array(),
});

export const insertSynonymGroupSchema = createInsertSchema(synonymGroups).omit({ id: true });
export type InsertSynonymGroup = z.infer<typeof insertSynonymGroupSchema>;
export type SynonymGroup = typeof synonymGroups.$inferSelect;

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  propositionId: text("proposition_id").notNull(),
  language: text("language").notNull().default("en"),
  message: text("message").notNull(),
  name: text("name"),
  email: text("email"),
  type: text("type").notNull().default("feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({ id: true, createdAt: true });
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
