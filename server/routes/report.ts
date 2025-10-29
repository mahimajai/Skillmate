import { RequestHandler } from "express";
import { z } from "zod";
import { getDb } from "../db/mongo";

const ReportSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  category: z.enum(["bug", "abuse", "payment", "privacy", "other"]).default("other"),
  subject: z.string().min(3),
  description: z.string().min(10),
});

export const postReport: RequestHandler = async (req, res) => {
  try {
    const body = ReportSchema.parse(req.body);
    const db = await getDb();
    const col = db.collection("reports");
    const doc = { ...body, status: "open", createdAt: new Date() };
    const result = await col.insertOne(doc);
    res.status(201).json({ id: result.insertedId, ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};
