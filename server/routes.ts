import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSynonymGroupSchema, insertFeedbackSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/synonym-groups/export", async (_req, res) => {
    const groups = await storage.getSynonymGroups();
    const exportData = groups.map(({ id, ...rest }) => rest);
    res.setHeader('Content-Disposition', 'attachment; filename="semantica-expressions.json"');
    res.setHeader('Content-Type', 'application/json');
    res.json(exportData);
  });

  app.post("/api/synonym-groups/import", async (req, res) => {
    const { password, groups } = req.body;
    if (password !== 'Trismegiste') {
      return res.status(403).json({ message: "Invalid password" });
    }
    if (!Array.isArray(groups)) {
      return res.status(400).json({ message: "Invalid data: groups must be an array" });
    }
    const result = await storage.replaceAllSynonymGroups(groups);
    res.json({ message: `Imported ${result.length} expression groups`, count: result.length });
  });

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

  app.get("/api/feedback", async (_req, res) => {
    const entries = await storage.getFeedback();
    res.json(entries);
  });

  app.post("/api/feedback", async (req, res) => {
    const parsed = insertFeedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const entry = await storage.createFeedback(parsed.data);
    res.status(201).json(entry);
  });

  return httpServer;
}
