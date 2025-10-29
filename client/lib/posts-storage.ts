export interface User { name: string; avatar: string; rating: number; location: string; completedExchanges: number; }
export interface SkillPost {
  id: number;
  user: User;
  type: "teach" | "learn" | "exchange";
  skill: string;
  category: string;
  description: string;
  seekingSkill?: string;
  offeringSkill?: string;
  sessionType: string;
  duration: string;
  experienceLevel: string;
  tags: string[];
  postedTime: string;
  likes: number;
  responses: number;
}

import { getUserProfile } from "@/lib/auth-storage";

export const getCurrentUser = (): User => {
  const p = getUserProfile();
  if (p) {
    return {
      name: p.name,
      avatar: p.avatar,
      rating: typeof (p as any).rating === "number" ? (p as any).rating : 4.9,
      location: (p as any).location || "",
      completedExchanges: typeof (p as any).completedExchanges === "number" ? (p as any).completedExchanges : 0,
    };
  }
  return { name: "John Doe", avatar: "JD", rating: 4.9, location: "San Francisco, CA", completedExchanges: 42 };
};

const mockPosts: SkillPost[] = [
  { id: 1, user: { name: "Sarah Chen", avatar: "SC", rating: 4.9, location: "San Francisco, CA", completedExchanges: 42 }, type: "teach", skill: "React.js & Frontend Development", category: "Programming", description: "I can teach you React.js from basics to advanced concepts. I have 5+ years of experience in frontend development and have built several production apps.", seekingSkill: "UI/UX Design principles", sessionType: "Online/In-person", duration: "1-2 hours", experienceLevel: "Beginner to Advanced", tags: ["React", "JavaScript", "Frontend", "Web Development"], postedTime: "2 hours ago", likes: 15, responses: 8 },
];

const POSTS_STORAGE_KEY = "skillmate_posts";

export const getAllPosts = (): SkillPost[] => {
  try {
    const userPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    const saved: SkillPost[] = userPosts ? JSON.parse(userPosts) : [];
    return [...saved, ...mockPosts];
  } catch {
    return mockPosts;
  }
};

export const addPost = (postData: Omit<SkillPost, "id" | "user" | "postedTime" | "likes" | "responses">): SkillPost => {
  const existing = getUserPosts();
  const newPost: SkillPost = { ...postData, id: Date.now(), user: getCurrentUser(), postedTime: "Just now", likes: 0, responses: 0 };
  const updated = [newPost, ...existing];
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
  return newPost;
};

export const getUserPosts = (): SkillPost[] => {
  try { const userPosts = localStorage.getItem(POSTS_STORAGE_KEY); return userPosts ? JSON.parse(userPosts) : []; } catch { return []; }
};

export const deleteUserPost = (postId: number): void => {
  const existing = getUserPosts();
  const updated = existing.filter(p => p.id !== postId);
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
};

export const updatePostInteraction = (postId: number, field: "likes" | "responses", increment: number = 1): void => {
  const existing = getUserPosts();
  const updated = existing.map(p => p.id === postId ? { ...p, [field]: Math.max(0, (p as any)[field] + increment) } : p);
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
};

export const getTimeAgo = (postedTime: string): string => postedTime === "Just now" ? postedTime : postedTime;
