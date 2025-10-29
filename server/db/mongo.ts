import { MongoClient, Db } from "mongodb";
import { env } from "../env";

let client: MongoClient | null = null;
let db: Db | null = null;
let initialized = false;

export async function getDb(): Promise<Db> {
  if (db && client) return db;
  const uri = env.MONGODB_URI;
  const dbName = env.DB_NAME;
  client = new MongoClient(uri, {
    maxPoolSize: 20,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5_000,
    retryWrites: true,
  });
  await client.connect();
  db = client.db(dbName);

  if (!initialized) {
    await ensureIndexes(db);
    await ensureSeedPosts(db);
    initialized = true;
  }
  return db;
}

async function ensureIndexes(database: Db) {
  const users = database.collection("users");
  await users.createIndex({ email: 1 }, { unique: true, name: "users_email_unique" });

  const posts = database.collection("posts");
  await posts.createIndex({ createdAt: -1 }, { name: "posts_createdAt_desc" });
  await posts.createIndex({ category: 1, type: 1 }, { name: "posts_category_type" });
  await posts.createIndex({ skill: "text", description: "text", "user.name": "text" }, { name: "posts_text_all" });
  await posts.createIndex({ tags: 1 }, { name: "posts_tags" });
}

async function ensureSeedPosts(database: Db) {
  const posts = database.collection("posts");
  const count = await posts.estimatedDocumentCount();
  if (count > 0) return;
  const now = Date.now();
  const seed = [
    {
      id: now - 1000,
      user: { name: "Aarav Sharma", avatar: "AS", rating: 4.8, location: "Delhi, IN", completedExchanges: 12 },
      type: "teach",
      skill: "React.js for Beginners",
      category: "Programming",
      description: "Hands-on React basics: components, hooks, routing, and best practices.",
      seekingSkill: "UI/UX Design",
      sessionType: "Online Only",
      duration: "1 hour",
      experienceLevel: "All levels",
      tags: ["React", "JavaScript", "Frontend"],
      postedTime: "Just now",
      likes: 3,
      responses: 1,
      createdAt: new Date(now - 1000),
    },
    {
      id: now - 2000,
      user: { name: "Sara Khan", avatar: "SK", rating: 4.9, location: "Mumbai, IN", completedExchanges: 18 },
      type: "learn",
      skill: "Advanced English Speaking",
      category: "Language",
      description: "Looking to improve fluency and accent for professional settings.",
      offeringSkill: "Can offer Hindi speaking and basic Python",
      sessionType: "Both Online & In-Person",
      duration: "1 hour",
      experienceLevel: "Intermediate",
      tags: ["Language", "English"],
      postedTime: "5 min ago",
      likes: 2,
      responses: 0,
      createdAt: new Date(now - 5 * 60 * 1000),
    },
    {
      id: now - 3000,
      user: { name: "Rahul Verma", avatar: "RV", rating: 4.7, location: "Bengaluru, IN", completedExchanges: 22 },
      type: "exchange",
      skill: "Guitar for Beginners",
      category: "Music",
      description: "I can teach basic chords, strumming patterns, and simple songs.",
      seekingSkill: "Photography Basics",
      sessionType: "In-Person Only",
      duration: "1 hour",
      experienceLevel: "Beginner",
      tags: ["Music", "Guitar", "Exchange"],
      postedTime: "12 min ago",
      likes: 5,
      responses: 2,
      createdAt: new Date(now - 12 * 60 * 1000),
    },
    {
      id: now - 4000,
      user: { name: "Ananya Gupta", avatar: "AG", rating: 5.0, location: "Noida, IN", completedExchanges: 35 },
      type: "teach",
      skill: "UI/UX Design Fundamentals",
      category: "Design",
      description: "Learn user-centered design, wireframing, and Figma basics.",
      seekingSkill: "Public Speaking",
      sessionType: "Online Only",
      duration: "1.5 hours",
      experienceLevel: "All levels",
      tags: ["Design", "Figma", "UX"],
      postedTime: "20 min ago",
      likes: 9,
      responses: 3,
      createdAt: new Date(now - 20 * 60 * 1000),
    },
    {
      id: now - 5000,
      user: { name: "Vikram Singh", avatar: "VS", rating: 4.6, location: "Pune, IN", completedExchanges: 8 },
      type: "learn",
      skill: "Baking Cakes",
      category: "Cooking",
      description: "Want to learn sponges, frosting, and decoration basics.",
      offeringSkill: "Can teach Excel and basic data analysis",
      sessionType: "Both Online & In-Person",
      duration: "2 hours",
      experienceLevel: "Beginner",
      tags: ["Cooking", "Baking"],
      postedTime: "32 min ago",
      likes: 1,
      responses: 0,
      createdAt: new Date(now - 32 * 60 * 1000),
    },
    {
      id: now - 6000,
      user: { name: "Priya Patel", avatar: "PP", rating: 4.8, location: "Ahmedabad, IN", completedExchanges: 16 },
      type: "exchange",
      skill: "Digital Marketing 101",
      category: "Marketing",
      description: "I can teach basics of SEO, social media, and content strategy.",
      seekingSkill: "Advanced Excel",
      sessionType: "Online Only",
      duration: "1 hour",
      experienceLevel: "Beginner",
      tags: ["Marketing", "SEO"],
      postedTime: "45 min ago",
      likes: 4,
      responses: 1,
      createdAt: new Date(now - 45 * 60 * 1000),
    },
  ];
  await posts.insertMany(seed as any[]);
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    initialized = false;
  }
}
