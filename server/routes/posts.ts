import { RequestHandler } from "express";
import { z } from "zod";
import { getDb } from "../db/mongo";

const PostsColl = async () => (await getDb()).collection("posts");
const UsersColl = async () => (await getDb()).collection("users");

const CreatePostSchema = z.object({
  userEmail: z.string().email(),
  type: z.enum(["teach", "learn", "exchange"]),
  skill: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  seekingSkill: z.string().optional(),
  offeringSkill: z.string().optional(),
  sessionType: z.string().min(1),
  duration: z.string().min(1),
  experienceLevel: z.string().min(1),
  tags: z.array(z.string()).default([]),
});

const ListQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(["all", "teach", "learn", "exchange"]).optional(),
});

export const createPost: RequestHandler = async (req, res) => {
  try {
    const body = CreatePostSchema.parse(req.body);
    const users = await UsersColl();
    const user = await users.findOne({ email: body.userEmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userInfo = {
      name: (user as any).name,
      avatar: (user as any).avatar ?? String((user as any).name || "").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
      rating: typeof (user as any).rating === "number" ? (user as any).rating : 0,
      location: (user as any).location || "",
      completedExchanges: typeof (user as any).completedExchanges === "number" ? (user as any).completedExchanges : 0,
    };

    const doc = {
      id: Date.now(),
      user: userInfo,
      type: body.type,
      skill: body.skill,
      category: body.category,
      description: body.description,
      seekingSkill: body.seekingSkill,
      offeringSkill: body.offeringSkill,
      sessionType: body.sessionType,
      duration: body.duration,
      experienceLevel: body.experienceLevel,
      tags: body.tags,
      postedTime: "Just now",
      likes: 0,
      likedBy: [],
      responses: 0,
      createdAt: new Date(),
    };

    const posts = await PostsColl();
    await posts.insertOne(doc as any);
    res.status(201).json({ post: doc });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};

export const listPosts: RequestHandler = async (req, res) => {
  try {
    const q = ListQuerySchema.parse({
      search: req.query.search ? String(req.query.search) : undefined,
      category: req.query.category ? String(req.query.category) : undefined,
      type: req.query.type ? (String(req.query.type) as any) : undefined,
    });

    const posts = await PostsColl();
    const filter: any = {};
    if (q.search) {
      const rx = new RegExp(q.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { skill: rx },
        { description: rx },
        { "user.name": rx },
        { tags: rx },
      ];
    }
    if (q.category && q.category !== "All") filter.category = q.category;
    if (q.type && q.type !== "all") filter.type = q.type;

    const results = await posts.find(filter).sort({ createdAt: -1 }).limit(200).toArray();
    // Ensure postedTime is present (fallback to relative simple formatting)
    const now = Date.now();
    const mapped = results.map((p: any) => {
      if (!p.postedTime && p.createdAt) {
        const minutes = Math.max(1, Math.floor((now - new Date(p.createdAt).getTime()) / 60000));
        p.postedTime = minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} hours ago`;
      }
      return p;
    });

    res.json({ posts: mapped });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};

const IdParamSchema = z.object({ id: z.coerce.number() });

export const likePost: RequestHandler = async (req, res) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const email = String((req.body as any)?.userEmail || "");
    if (!email) return res.status(400).json({ error: "userEmail required" });
    const posts = await PostsColl();
    const result = await posts.updateOne({ id, likedBy: { $ne: email } }, { $inc: { likes: 1 }, $addToSet: { likedBy: email } });
    const post = await posts.findOne({ id });
    if (!result.matchedCount) return res.status(200).json({ post });
    res.json({ post });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};

export const respondPost: RequestHandler = async (req, res) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const posts = await PostsColl();
    await posts.updateOne({ id }, { $inc: { responses: 1 } });
    const post = await posts.findOne({ id });
    res.json({ post });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Invalid request" });
  }
};
