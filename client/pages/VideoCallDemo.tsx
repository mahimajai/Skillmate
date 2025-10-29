import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoCallModal, useIncomingCall } from "@/components/VideoCallModal";

export default function VideoCallDemo() {
  const [selfId, setSelfId] = useState("");
  const [peerId, setPeerId] = useState("");
  const [outgoing, setOutgoing] = useState(false);
  const [incomingOpen, setIncomingOpen] = useState(false);

  const { incoming, clear } = useIncomingCall(selfId);

  useEffect(() => {
    if (incoming) setIncomingOpen(true);
  }, [incoming]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">WebRTC Video Call Demo</h1>
        <p className="text-slate-600 text-sm">
          Enter your ID and your peer's ID (e.g., your email or name), then start a call. Have your peer open the site and enter their own ID to receive the incoming call.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Your ID</label>
            <input className="w-full rounded-md border px-3 py-2" value={selfId} onChange={(e) => setSelfId(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Peer ID</label>
            <input className="w-full rounded-md border px-3 py-2" value={peerId} onChange={(e) => setPeerId(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOutgoing(true)} disabled={!selfId || !peerId}>Start Call</Button>
        </div>

        {outgoing && (
          <VideoCallModal open={outgoing} onOpenChange={(v) => setOutgoing(v)} role="caller" selfId={selfId} peerId={peerId} />
        )}
        {incoming && incomingOpen && (
          <VideoCallModal
            open={incomingOpen}
            onOpenChange={(v) => { setIncomingOpen(v); if (!v) clear(); }}
            role="callee"
            selfId={selfId}
            peerId={incoming.from}
            callId={incoming.id}
          />
        )}
      </div>
    </div>
  );
}
