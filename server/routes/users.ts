import { RequestHandler } from "express";
import { getDb } from "../db/mongo";
import { z } from "zod";

const users = async () => (await getDb()).collection("users");

const EmailQ = z.object({ email: z.string().email() });
const NameQ = z.object({ name: z.string().min(1) });
const UpdateBody = z.object({
  email: z.string().email(),
  updates: z.object({
    name: z.string().min(1).optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    links: z.object({ website: z.string().optional(), linkedin: z.string().optional(), twitter: z.string().optional() }).partial().optional(),
    experience: z.array(z.object({ role: z.string(), company: z.string(), period: z.string(), description: z.string().optional() })).optional(),
    education: z.array(z.object({ school: z.string(), degree: z.string(), period: z.string() })).optional(),
  }),
});

export const getMe: RequestHandler = async (req, res) => {
  try {
    const { email } = EmailQ.parse({ email: String(req.query.email || "") });
    const col = await users();
    const user = await col.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { passwordHash, ...safe } = user as any;
    res.json({ user: safe });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};

export const updateMe: RequestHandler = async (req, res) => {
  try {
    const body = UpdateBody.parse(req.body);
    const col = await users();
    await col.updateOne({ email: body.email }, { $set: body.updates });
    const user = await col.findOne({ email: body.email });
    const { passwordHash, ...safe } = user as any;
    res.json({ user: safe });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};

export const getByName: RequestHandler = async (req, res) => {
  try {
    const { name } = NameQ.parse({ name: String(req.query.name || "") });
    const col = await users();
    const user = await col.findOne({ name });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { passwordHash, ...safe } = user as any;
    res.json({ user: safe });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};

export const getStats: RequestHandler = async (req, res) => {
  try {
    const { email } = EmailQ.parse({ email: String(req.query.email || "") });
    const col = await users();
    const user = await col.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const stats = (user as any).stats || { appliedCount: 0, totalTeachingMinutes: 0, skillsTaught: [], skillsLearned: [] };
    res.json({ stats });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};
