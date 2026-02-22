import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage, seedDatabaseIfEmpty } from "./storage";
import { insertSynonymGroupSchema, insertFeedbackSchema } from "@shared/schema";
import archiver from "archiver";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const activeSessions = new Map<string, { createdAt: number }>();
const SESSION_TTL = 24 * 60 * 60 * 1000;

const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION = 15 * 60 * 1000;
const failedAttempts = new Map<string, { count: number; blockedUntil: number | null }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return first.trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function isIpBlocked(ip: string): boolean {
  const record = failedAttempts.get(ip);
  if (!record || !record.blockedUntil) return false;
  if (Date.now() > record.blockedUntil) {
    failedAttempts.delete(ip);
    return false;
  }
  return true;
}

function recordFailedAttempt(ip: string): boolean {
  const record = failedAttempts.get(ip) || { count: 0, blockedUntil: null };
  record.count += 1;
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.blockedUntil = Date.now() + BLOCK_DURATION;
    failedAttempts.set(ip, record);
    return true;
  }
  failedAttempts.set(ip, record);
  return false;
}

function clearFailedAttempts(ip: string) {
  failedAttempts.delete(ip);
}

function cleanExpiredSessions() {
  const now = Date.now();
  const tokens = Array.from(activeSessions.keys());
  for (const token of tokens) {
    const session = activeSessions.get(token);
    if (session && now - session.createdAt > SESSION_TTL) {
      activeSessions.delete(token);
    }
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const token = authHeader.slice(7);
  const session = activeSessions.get(token);
  if (!session || Date.now() - session.createdAt > SESSION_TTL) {
    activeSessions.delete(token);
    return res.status(401).json({ message: "Session expired, please log in again" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedDatabaseIfEmpty();

  setInterval(cleanExpiredSessions, 60 * 60 * 1000);

  app.post("/api/auth/login", (req, res) => {
    const ip = getClientIp(req);

    if (isIpBlocked(ip)) {
      return res.status(429).json({ message: "Too many failed attempts. Please try again in 15 minutes." });
    }

    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    if (password !== adminPassword) {
      const blocked = recordFailedAttempt(ip);
      if (blocked) {
        return res.status(429).json({ message: "Too many failed attempts. Please try again in 15 minutes." });
      }
      return res.status(401).json({ message: "Invalid password" });
    }
    clearFailedAttempts(ip);
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, { createdAt: Date.now() });
    res.json({ token });
  });

  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      activeSessions.delete(authHeader.slice(7));
    }
    res.json({ message: "Logged out" });
  });

  app.get("/api/auth/verify", requireAuth, (_req, res) => {
    res.json({ authenticated: true });
  });

  app.get("/api/synonym-groups/export", async (_req, res) => {
    const groups = await storage.getSynonymGroups();
    const exportData = groups.map(({ id, ...rest }) => rest);
    res.setHeader('Content-Disposition', 'attachment; filename="semantica-expressions.json"');
    res.setHeader('Content-Type', 'application/json');
    res.json(exportData);
  });

  app.post("/api/synonym-groups/import", requireAuth, async (req, res) => {
    const { groups } = req.body;
    if (!Array.isArray(groups)) {
      return res.status(400).json({ message: "Invalid data: groups must be an array" });
    }
    const result = await storage.replaceAllSynonymGroups(groups);
    res.json({ message: `Imported ${result.length} expression groups`, count: result.length });
  });

  app.get("/api/download-project", async (_req, res) => {
    try {
      const groups = await storage.getSynonymGroups();
      const exportData = groups.map(({ id, ...rest }) => rest);

      res.setHeader('Content-Disposition', 'attachment; filename="semantica-project.zip"');
      res.setHeader('Content-Type', 'application/zip');

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(res);

      const projectRoot = path.resolve(process.cwd());

      const includeDirs = ['client/src', 'server', 'shared'];
      const includeFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'drizzle.config.ts', 'tailwind.config.ts'];

      for (const dir of includeDirs) {
        const dirPath = path.join(projectRoot, dir);
        if (fs.existsSync(dirPath)) {
          archive.directory(dirPath, dir);
        }
      }

      for (const file of includeFiles) {
        const filePath = path.join(projectRoot, file);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: file });
        }
      }

      archive.append(JSON.stringify(exportData, null, 2), { name: 'database/expressions.json' });

      const feedback = await storage.getFeedback();
      archive.append(JSON.stringify(feedback, null, 2), { name: 'database/feedback.json' });

      await archive.finalize();
    } catch (err) {
      console.error('Error creating project zip:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to create project archive' });
      }
    }
  });

  app.get("/api/synonym-groups", async (_req, res) => {
    const groups = await storage.getSynonymGroups();
    res.json(groups);
  });

  app.post("/api/synonym-groups", requireAuth, async (req, res) => {
    const parsed = insertSynonymGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const group = await storage.createSynonymGroup(parsed.data);
    res.status(201).json(group);
  });

  app.put("/api/synonym-groups/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const parsed = insertSynonymGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const group = await storage.updateSynonymGroup(id, parsed.data);
    if (!group) return res.status(404).json({ message: "Not found" });
    res.json(group);
  });

  app.delete("/api/synonym-groups/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const deleted = await storage.deleteSynonymGroup(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  });

  app.get("/api/feedback", requireAuth, async (_req, res) => {
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
