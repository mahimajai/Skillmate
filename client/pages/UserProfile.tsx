import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/auth-storage";

export default function UserProfile() {
  const { name = "" } = useParams();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/users/by-name?name=${encodeURIComponent(name)}`);
        const data = await res.json();
        if (res.ok) setProfile(data.user);
      } finally { setLoading(false); }
    })();
  }, [name]);

  if (loading) return <div className="min-h-screen bg-background pt-8"><div className="container mx-auto px-4 pb-8">Loading...</div></div>;
  if (!profile) return <div className="min-h-screen bg-background pt-8"><div className="container mx-auto px-4 pb-8">User not found</div></div>;

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-8 max-w-4xl">
        <div className="bg-card rounded-xl border p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">{profile.avatar}</div>
            <div>
              <div className="text-2xl font-semibold">{profile.name}</div>
              <div className="text-sm text-muted-foreground">{profile.location}</div>
            </div>
          </div>

          {profile.bio ? (
            <div>
              <div className="text-sm font-medium mb-1">About</div>
              <div className="text-muted-foreground whitespace-pre-line">{profile.bio}</div>
            </div>
          ) : null}

          {Array.isArray(profile.skills) && profile.skills.length ? (
            <div>
              <div className="text-sm font-medium mb-2">Skills</div>
              <div className="flex flex-wrap gap-2">{profile.skills.map((s: string, i: number) => (<Badge key={i}>{s}</Badge>))}</div>
            </div>
          ) : null}

          {Array.isArray(profile.experience) && profile.experience.length ? (
            <div>
              <div className="text-sm font-medium mb-2">Experience</div>
              <div className="space-y-3">
                {profile.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg border">
                    <div className="font-medium">{exp.role} • {exp.company}</div>
                    <div className="text-sm text-muted-foreground">{exp.period}</div>
                    {exp.description ? (<div className="text-sm mt-2 text-muted-foreground whitespace-pre-line">{exp.description}</div>) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {Array.isArray(profile.education) && profile.education.length ? (
            <div>
              <div className="text-sm font-medium mb-2">Education</div>
              <div className="space-y-3">
                {profile.education.map((ed: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg border">
                    <div className="font-medium">{ed.school} • {ed.degree}</div>
                    <div className="text-sm text-muted-foreground">{ed.period}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
