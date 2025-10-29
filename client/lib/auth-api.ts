export type SafeUser = { _id?: string; name: string; email: string; avatar?: string; rating?: number; completedExchanges?: number; location?: string; createdAt?: string };

const json = (data: unknown) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

export async function apiSignup(name: string, email: string, password: string) {
  const res = await fetch("/api/auth/signup", json({ name, email, password }));
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error((data as any)?.error || "Signup failed");
  return data as { user: SafeUser };
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch("/api/auth/login", json({ email, password }));
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error((data as any)?.error || "Login failed");
  return data as { user: SafeUser };
}

export async function apiLogout() {
  const res = await fetch("/api/auth/logout", json({}));
  if (!res.ok) throw new Error("Logout failed");
}

export async function apiSignout(email: string, password: string) {
  const res = await fetch("/api/auth/signout", json({ email, password }));
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error((data as any)?.error || "Signout failed");
}
