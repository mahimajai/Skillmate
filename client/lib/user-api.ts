import { SafeUser } from "./auth-api";

export type UserStats = { appliedCount: number; totalTeachingMinutes: number; skillsTaught: string[]; skillsLearned: string[] };

const json = (data: unknown, method: string = "POST") => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

export async function getMe(email: string) {
  const res = await fetch(`/api/users/me?email=${encodeURIComponent(email)}`);
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(data?.error || "Failed to load profile");
  return data as { user: SafeUser & any };
}

export async function updateMe(email: string, updates: Partial<SafeUser & { bio?: string; skills?: string[]; location?: string; links?: any; experience?: any[]; education?: any[] }>) {
  const res = await fetch(`/api/users/me`, json({ email, updates }, "PUT"));
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(data?.error || "Failed to update profile");
  return data as { user: SafeUser & any };
}

export async function getStats(email: string) {
  const res = await fetch(`/api/users/stats?email=${encodeURIComponent(email)}`);
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(data?.error || "Failed to load stats");
  return data as { stats: UserStats };
}
