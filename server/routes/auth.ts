import { RequestHandler } from "express";
import { getDb } from "../db/mongo";
import bcrypt from "bcryptjs";
import { z } from "zod";

const usersColl = async () => (await getDb()).collection("users");

const SignupSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) });
const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const SignoutSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const signup: RequestHandler = async (req, res) => {
  try {
    const body = SignupSchema.parse(req.body);
    const col = await usersColl();
    const existing = await col.findOne({ email: body.email });
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const hash = await bcrypt.hash(body.password, 10);
    const user = { name: body.name, email: body.email, passwordHash: hash, avatar: body.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2), rating: 0, completedExchanges: 0, location: "", createdAt: new Date() };
    await col.insertOne(user);
    const { passwordHash, ...safe } = user as any;
    res.json({ user: safe });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const body = LoginSchema.parse(req.body);
    const col = await usersColl();
    const user = await col.findOne({ email: body.email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(body.password, (user as any).passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const { passwordHash, ...safe } = user as any;
    res.json({ user: safe });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};

export const logout: RequestHandler = async (_req, res) => {
  // stateless logout for SPA
  res.json({ ok: true });
};

export const signout: RequestHandler = async (req, res) => {
  try {
    const body = SignoutSchema.parse(req.body);
    const col = await usersColl();
    const user = await col.findOne({ email: body.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const ok = await bcrypt.compare(body.password, (user as any).passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    await col.deleteOne({ _id: (user as any)._id });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};
