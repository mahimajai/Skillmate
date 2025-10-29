import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  accept,
  decline,
  end,
  getAnswer,
  getOffer,
  initiateCall,
  postAnswer,
  postOffer,
  postCandidate,
  pullCandidates,
  getPending,
} from "@/lib/call-api";

export type Role = "caller" | "callee";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  role: Role;
  selfId: string;
  peerId: string;
  callId?: string; // for callee path
};

const STUN = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }];

export function VideoCallModal({ open, onOpenChange, role, selfId, peerId, callId }: Props) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<string>(role === "caller" ? "calling" : "ringing");
  const [id, setId] = useState<string | undefined>(callId);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const pc = useMemo(() => new RTCPeerConnection({ iceServers: STUN }), []);
  const pullInterval = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;

    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (!active) return;
      setLocalStream(stream);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      pc.ontrack = (e) => {
        const [s] = e.streams;
        setRemoteStream(s);
      };
      pc.onicecandidate = (e) => {
        if (e.candidate && id) {
          postCandidate(id, role, e.candidate.toJSON());
        }
      };

      try {
        if (role === "caller") {
          const { callId } = await initiateCall(selfId, peerId);
          setId(callId);
          const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
          await pc.setLocalDescription(offer);
          await postOffer(callId, offer);
          setStatus("ringing");
        } else if (role === "callee" && id) {
          await accept(id);
          setStatus("connecting");
          const { offer } = await getOffer(id);
          if (offer) {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await postAnswer(id, answer);
          }
        }
      } catch {
        onOpenChange(false);
        return;
      }

      pullInterval.current = window.setInterval(async () => {
        if (!id) return;
        if (role === "caller") {
          const { answer } = await getAnswer(id);
          if (answer && !pc.currentRemoteDescription) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            setStatus("connected");
          }
        }
        const { candidates } = await pullCandidates(id, role);
        for (const c of candidates) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          } catch {}
        }
      }, 750);
    })();

    return () => {
      active = false;
      if (pullInterval.current) window.clearInterval(pullInterval.current);
      pc.getSenders().forEach((s) => s.track && s.track.stop());
      localStream?.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
      setRemoteStream(null);
      if (id) end(id).catch(() => {});
      pc.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (localRef.current && localStream) localRef.current.srcObject = localStream;
  }, [localStream]);
  useEffect(() => {
    if (remoteRef.current && remoteStream) remoteRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-3xl rounded-xl border bg-background p-4 text-foreground">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Video Call {status !== "connected" ? `- ${status}` : ""}</div>
          <div className="text-sm opacity-70">You: {selfId} • Peer: {peerId}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <video ref={remoteRef} autoPlay playsInline className="w-full aspect-video rounded-lg bg-black" />
          <video ref={localRef} autoPlay muted playsInline className="w-full aspect-video rounded-lg bg-black" />
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          {role === "callee" && status === "ringing" && id && (
            <>
              <Button onClick={async () => { await accept(id); setStatus("connecting"); }}>
                Accept
              </Button>
              <Button variant="destructive" onClick={async () => { await decline(id); onOpenChange(false); }}>
                Decline
              </Button>
            </>
          )}
          <Button variant="destructive" onClick={() => onOpenChange(false)}>End</Button>
        </div>
      </div>
    </div>
  );
}

export function useIncomingCall(selfId: string) {
  const [incoming, setIncoming] = useState<{ id: string; from: string; to: string } | null>(null);
  useEffect(() => {
    if (!selfId) return;
    const i = window.setInterval(async () => {
      try {
        const res = await getPending(selfId);
        if (res.pending) setIncoming(res.pending);
      } catch {}
    }, 1000);
    return () => window.clearInterval(i);
  }, [selfId]);
  return { incoming, clear: () => setIncoming(null) };
}
