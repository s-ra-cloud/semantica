import { type SynonymGroup, type InsertSynonymGroup, synonymGroups, type Feedback, type InsertFeedback, feedback } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSynonymGroups(): Promise<SynonymGroup[]>;
  getSynonymGroup(id: number): Promise<SynonymGroup | undefined>;
  createSynonymGroup(group: InsertSynonymGroup): Promise<SynonymGroup>;
  updateSynonymGroup(id: number, group: InsertSynonymGroup): Promise<SynonymGroup | undefined>;
  deleteSynonymGroup(id: number): Promise<boolean>;
  getFeedback(): Promise<Feedback[]>;
  createFeedback(entry: InsertFeedback): Promise<Feedback>;
}

export class DatabaseStorage implements IStorage {
  async getSynonymGroups(): Promise<SynonymGroup[]> {
    return db.select().from(synonymGroups);
  }

  async getSynonymGroup(id: number): Promise<SynonymGroup | undefined> {
    const [group] = await db.select().from(synonymGroups).where(eq(synonymGroups.id, id));
    return group;
  }

  async createSynonymGroup(group: InsertSynonymGroup): Promise<SynonymGroup> {
    const [created] = await db.insert(synonymGroups).values(group).returning();
    return created;
  }

  async updateSynonymGroup(id: number, group: InsertSynonymGroup): Promise<SynonymGroup | undefined> {
    const [updated] = await db.update(synonymGroups).set(group).where(eq(synonymGroups.id, id)).returning();
    return updated;
  }

  async deleteSynonymGroup(id: number): Promise<boolean> {
    const [deleted] = await db.delete(synonymGroups).where(eq(synonymGroups.id, id)).returning();
    return !!deleted;
  }

  async getFeedback(): Promise<Feedback[]> {
    return db.select().from(feedback).orderBy(desc(feedback.createdAt));
  }

  async createFeedback(entry: InsertFeedback): Promise<Feedback> {
    const [created] = await db.insert(feedback).values(entry).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
