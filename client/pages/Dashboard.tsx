import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/auth-storage";
import { getStats } from "@/lib/user-api";

export default function Dashboard() {
  const local = getUserProfile();
  const email = local?.email || "";
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ appliedCount: number; totalTeachingMinutes: number; skillsTaught: string[]; skillsLearned: string[] } | null>(null);

  useEffect(() => {
    (async () => {
      if (!email) { setLoading(false); return; }
      try {
        const res = await getStats(email);
        setStats(res.stats);
      } catch {}
      setLoading(false);
    })();
  }, [email]);

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        {loading ? (
          <div>Loading...</div>
        ) : !stats ? (
          <div>No stats available.</div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-card border rounded-xl p-6">
              <div className="text-sm text-muted-foreground">Applications</div>
              <div className="text-3xl font-semibold">{stats.appliedCount}</div>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="text-sm text-muted-foreground">Teaching Time</div>
              <div className="text-3xl font-semibold">{Math.floor(stats.totalTeachingMinutes/60)}h {stats.totalTeachingMinutes%60}m</div>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="text-sm text-muted-foreground">Skills Taught</div>
              <div className="text-3xl font-semibold">{stats.skillsTaught.length}</div>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="text-sm text-muted-foreground">Skills Learned</div>
              <div className="text-3xl font-semibold">{stats.skillsLearned.length}</div>
            </div>
            <div className="md:col-span-2 bg-card border rounded-xl p-6">
              <div className="font-semibold mb-2">Taught</div>
              <div className="flex gap-2 flex-wrap">
                {stats.skillsTaught.length ? stats.skillsTaught.map((s, i) => (<span key={i} className="px-2 py-1 rounded bg-muted text-sm">{s}</span>)) : <span className="text-sm text-muted-foreground">No data</span>}
              </div>
            </div>
            <div className="md:col-span-2 bg-card border rounded-xl p-6">
              <div className="font-semibold mb-2">Learned</div>
              <div className="flex gap-2 flex-wrap">
                {stats.skillsLearned.length ? stats.skillsLearned.map((s, i) => (<span key={i} className="px-2 py-1 rounded bg-muted text-sm">{s}</span>)) : <span className="text-sm text-muted-foreground">No data</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
