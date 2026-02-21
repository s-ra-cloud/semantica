import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSynonymGroupSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/synonym-groups", async (_req, res) => {
    const groups = await storage.getSynonymGroups();
    res.json(groups);
  });

  app.post("/api/synonym-groups", async (req, res) => {
    const parsed = insertSynonymGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const group = await storage.createSynonymGroup(parsed.data);
    res.status(201).json(group);
  });

  app.put("/api/synonym-groups/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const parsed = insertSynonymGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const group = await storage.updateSynonymGroup(id, parsed.data);
    if (!group) return res.status(404).json({ message: "Not found" });
    res.json(group);
  });

  app.delete("/api/synonym-groups/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const deleted = await storage.deleteSynonymGroup(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  });

  return httpServer;
}
