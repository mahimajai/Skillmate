export type CallRole = "caller" | "callee";

const json = (data: unknown) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

let serverAvailable = true;
let lastHealthCheck = 0;
async function checkHealthIfNeeded() {
  const now = Date.now();
  if (serverAvailable) return true;
  if (now - lastHealthCheck < 15000) return false;
  lastHealthCheck = now;
  try {
    const res = await withTimeout(fetch("/healthz"), 2000);
    serverAvailable = res.ok;
  } catch {
    serverAvailable = false;
  }
  return serverAvailable;
}

export async function initiateCall(from: string, to: string) {
  if (!(await checkHealthIfNeeded())) throw new Error("Calls service unavailable");
  const res = await fetch("/api/calls/initiate", json({ from, to }));
  if (!res.ok) throw new Error("initiate failed");
  return (await res.json()) as { callId: string; status: string };
}

function withTimeout<T>(p: Promise<T>, ms = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("request timeout")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

export async function getPending(userId: string) {
  if (!userId) return { pending: null } as any;
  if (!(await checkHealthIfNeeded())) return { pending: null } as any;
  try {
    const res = await withTimeout(fetch(`/api/calls/pending?userId=${encodeURIComponent(userId)}`));
    if (!res.ok) return { pending: null } as any;
    return (await res.json()) as { pending: { id: string; from: string; to: string; status: string } | null };
  } catch {
    serverAvailable = false;
    lastHealthCheck = Date.now();
    return { pending: null } as any;
  }
}

export async function accept(callId: string) {
  const res = await fetch("/api/calls/accept", json({ callId }));
  if (!res.ok) throw new Error("accept failed");
}

export async function decline(callId: string) {
  const res = await fetch("/api/calls/decline", json({ callId }));
  if (!res.ok) throw new Error("decline failed");
}

export async function end(callId: string) {
  const res = await fetch("/api/calls/end", json({ callId }));
  if (!res.ok) throw new Error("end failed");
}

export async function postOffer(callId: string, offer: RTCSessionDescriptionInit) {
  const res = await fetch("/api/calls/offer", json({ callId, offer }));
  if (!res.ok) throw new Error("offer failed");
}
export async function getOffer(callId: string) {
  try {
    const res = await withTimeout(fetch(`/api/calls/offer?callId=${encodeURIComponent(callId)}`));
    if (!res.ok) return { offer: null } as any;
    return (await res.json()) as { offer: RTCSessionDescriptionInit | null };
  } catch {
    return { offer: null } as any;
  }
}

export async function postAnswer(callId: string, answer: RTCSessionDescriptionInit) {
  const res = await fetch("/api/calls/answer", json({ callId, answer }));
  if (!res.ok) throw new Error("answer failed");
}
export async function getAnswer(callId: string) {
  try {
    const res = await withTimeout(fetch(`/api/calls/answer?callId=${encodeURIComponent(callId)}`));
    if (!res.ok) return { answer: null } as any;
    return (await res.json()) as { answer: RTCSessionDescriptionInit | null };
  } catch {
    return { answer: null } as any;
  }
}

export async function postCandidate(callId: string, role: CallRole, candidate: RTCIceCandidateInit) {
  const res = await fetch("/api/calls/candidate", json({ callId, role, candidate }));
  if (!res.ok) throw new Error("candidate failed");
}
export async function pullCandidates(callId: string, role: CallRole) {
  try {
    const res = await withTimeout(fetch(`/api/calls/candidates?callId=${encodeURIComponent(callId)}&role=${role}`));
    if (!res.ok) return { candidates: [] } as any;
    return (await res.json()) as { candidates: RTCIceCandidateInit[] };
  } catch {
    return { candidates: [] } as any;
  }
}

export async function getState(callId: string) {
  const res = await fetch(`/api/calls/state?callId=${encodeURIComponent(callId)}`);
  if (!res.ok) throw new Error("state failed");
  return (await res.json()) as { id: string; status: string; from: string; to: string };
}
