import type { SkillPost } from "./posts-storage";
import type { SafeUser } from "./auth-api";
import { getUserProfile } from "./auth-storage";

const json = (data: unknown, method: string = "POST") => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

export async function fetchPosts(params?: { search?: string; category?: string; type?: "all" | "teach" | "learn" | "exchange" }) {
  const qp = new URLSearchParams();
  if (params?.search) qp.set("search", params.search);
  if (params?.category) qp.set("category", params.category);
  if (params?.type) qp.set("type", params.type);
  const res = await fetch(`/api/posts${qp.toString() ? `?${qp.toString()}` : ""}`);
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(data?.error || "Failed to load posts");
  return data as { posts: SkillPost[] };
}

export type CreatePostInput = Omit<SkillPost, "id" | "user" | "postedTime" | "likes" | "responses">;

export async function createPost(input: CreatePostInput) {
  const profile = getUserProfile();
  if (!profile?.email) throw new Error("Please login to create a post");
  const res = await fetch("/api/posts", json({
    userEmail: profile.email,
    type: input.type,
    skill: input.skill,
    category: input.category,
    description: input.description,
    seekingSkill: (input as any).seekingSkill,
    offeringSkill: (input as any).offeringSkill,
    sessionType: input.sessionType,
    duration: input.duration,
    experienceLevel: input.experienceLevel,
    tags: input.tags || [],
  }));
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(data?.error || "Failed to create post");
  return data as { post: SkillPost };
}

export async function likePost(id: number) {
  const profile = getUserProfile();
  const email = profile?.email || "";
  const res = await fetch(`/api/posts/${id}/like`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userEmail: email }) });
  if (!res.ok) throw new Error("Failed to like post");
}

export async function respondToPost(id: number) {
  const res = await fetch(`/api/posts/${id}/respond`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to respond to post");
}
