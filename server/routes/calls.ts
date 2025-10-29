import { RequestHandler } from "express";

export type CallRole = "caller" | "callee";

interface CallSession {
  id: string;
  from: string; // caller userId
  to: string; // callee userId
  status: "ringing" | "accepted" | "declined" | "ended";
  createdAt: number;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidatesFrom: RTCIceCandidateInit[]; // caller -> callee
  candidatesTo: RTCIceCandidateInit[]; // callee -> caller
}

const calls = new Map<string, CallSession>();

const userRingingIndex = new Map<string, Set<string>>(); // userId -> set of callIds where user is callee and status=ringing

function addRingingIndex(userId: string, callId: string) {
  const set = userRingingIndex.get(userId) ?? new Set<string>();
  set.add(callId);
  userRingingIndex.set(userId, set);
}

function removeFromRingingIndex(userId: string, callId: string) {
  const set = userRingingIndex.get(userId);
  if (set) {
    set.delete(callId);
    if (set.size === 0) userRingingIndex.delete(userId);
  }
}

export const initiateCall: RequestHandler = (req, res) => {
  const { from, to } = req.body as { from?: string; to?: string };
  if (!from || !to) {
    return res.status(400).json({ error: "from and to are required" });
  }
  const id = `call_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const session: CallSession = {
    id,
    from,
    to,
    status: "ringing",
    createdAt: Date.now(),
    candidatesFrom: [],
    candidatesTo: [],
  };
  calls.set(id, session);
  addRingingIndex(to, id);
  res.json({ callId: id, status: session.status });
};

export const getPendingForUser: RequestHandler = (req, res) => {
  const userId = String(req.query.userId || "");
  if (!userId) return res.status(400).json({ error: "userId required" });
  const set = userRingingIndex.get(userId);
  if (!set || set.size === 0) return res.json({ pending: null });
  // Return the most recent
  const latest = Array.from(set)
    .map((id) => calls.get(id)!)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
  res.json({
    pending: latest
      ? { id: latest.id, from: latest.from, to: latest.to, status: latest.status }
      : null,
  });
};

export const acceptCall: RequestHandler = (req, res) => {
  const { callId } = req.body as { callId?: string };
  if (!callId) return res.status(400).json({ error: "callId required" });
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  session.status = "accepted";
  removeFromRingingIndex(session.to, session.id);
  res.json({ status: session.status });
};

export const declineCall: RequestHandler = (req, res) => {
  const { callId } = req.body as { callId?: string };
  if (!callId) return res.status(400).json({ error: "callId required" });
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  session.status = "declined";
  removeFromRingingIndex(session.to, session.id);
  res.json({ status: session.status });
};

export const endCall: RequestHandler = (req, res) => {
  const { callId } = req.body as { callId?: string };
  if (!callId) return res.status(400).json({ error: "callId required" });
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  session.status = "ended";
  removeFromRingingIndex(session.to, session.id);
  res.json({ status: session.status });
};

export const postOffer: RequestHandler = (req, res) => {
  const { callId, offer } = req.body as { callId?: string; offer?: RTCSessionDescriptionInit };
  if (!callId || !offer) return res.status(400).json({ error: "callId and offer required" });
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  session.offer = offer;
  res.json({ ok: true });
};

export const getOffer: RequestHandler = (req, res) => {
  const callId = String(req.query.callId || "");
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  res.json({ offer: session.offer ?? null });
};

export const postAnswer: RequestHandler = (req, res) => {
  const { callId, answer } = req.body as { callId?: string; answer?: RTCSessionDescriptionInit };
  if (!callId || !answer) return res.status(400).json({ error: "callId and answer required" });
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  session.answer = answer;
  res.json({ ok: true });
};

export const getAnswer: RequestHandler = (req, res) => {
  const callId = String(req.query.callId || "");
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  res.json({ answer: session.answer ?? null });
};

export const postCandidate: RequestHandler = (req, res) => {
  const { callId, role, candidate } = req.body as {
    callId?: string;
    role?: CallRole;
    candidate?: RTCIceCandidateInit;
  };
  if (!callId || !role || !candidate)
    return res.status(400).json({ error: "callId, role and candidate required" });
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  if (role === "caller") session.candidatesFrom.push(candidate);
  else session.candidatesTo.push(candidate);
  res.json({ ok: true });
};

export const getCandidates: RequestHandler = (req, res) => {
  const callId = String(req.query.callId || "");
  const role = (req.query.role as CallRole) || "caller";
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  // Each side pulls the list destined to them, then we clear it
  const list = role === "caller" ? session.candidatesTo : session.candidatesFrom;
  const out = [...list];
  list.length = 0;
  res.json({ candidates: out });
};

export const getState: RequestHandler = (req, res) => {
  const callId = String(req.query.callId || "");
  const session = calls.get(callId);
  if (!session) return res.status(404).json({ error: "call not found" });
  res.json({ id: session.id, status: session.status, from: session.from, to: session.to });
};
