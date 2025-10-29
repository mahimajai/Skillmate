import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getUserProfile } from "@/lib/auth-storage";
import { getMe, updateMe } from "@/lib/user-api";

export default function Profile() {
  const local = getUserProfile();
  const email = local?.email || "";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [skillInput, setSkillInput] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!email) { setLoading(false); return; }
      try {
        const { user } = await getMe(email);
        if (!user.skills) user.skills = [];
        setProfile(user);
      } catch {}
      setLoading(false);
    })();
  }, [email]);

  const save = async () => {
    if (!email || !profile) return;
    setSaving(true);
    try {
      const { user } = await updateMe(email, {
        name: profile.name,
        location: profile.location || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        links: profile.links || {},
        experience: profile.experience || [],
        education: profile.education || [],
      });
      setProfile(user);
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background pt-8"><div className="container mx-auto px-4 pb-8">Loading...</div></div>;
  if (!profile) return <div className="min-h-screen bg-background pt-8"><div className="container mx-auto px-4 pb-8">No profile</div></div>;

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-8 max-w-4xl">
        <div className="bg-card rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">{profile.avatar}</div>
              <div>
                <div className="text-2xl font-semibold">{profile.name}</div>
                <div className="text-sm text-muted-foreground">{profile.email}</div>
                <div className="text-sm text-muted-foreground">{profile.location}</div>
              </div>
            </div>
            {editing ? (
              <div className="flex gap-2"><Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button></div>
            ) : (
              <Button onClick={() => setEditing(true)}>Edit</Button>
            )}
          </div>

          {editing ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium">Headline / Bio</label>
                  <Textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell people about you" />
                  <label className="text-sm font-medium">Location</label>
                  <Input value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="City, Country" />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Skills</label>
                  <div className="flex gap-2">
                    <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" />
                    <Button onClick={() => { if (skillInput.trim()) { setProfile({ ...profile, skills: [...(profile.skills||[]), skillInput.trim()] }); setSkillInput(""); } }}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(profile.skills || []).map((s: string, i: number) => (
                      <Badge key={i} className="cursor-pointer" onClick={() => setProfile({ ...profile, skills: (profile.skills || []).filter((x: string) => x !== s) })}>{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="font-semibold">Experience</div>
                  {(profile.experience || []).map((exp: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border space-y-2">
                      <Input placeholder="Role" value={exp.role || ""} onChange={(e) => {
                        const next = [...(profile.experience || [])];
                        next[idx] = { ...next[idx], role: e.target.value };
                        setProfile({ ...profile, experience: next });
                      }} />
                      <Input placeholder="Company" value={exp.company || ""} onChange={(e) => {
                        const next = [...(profile.experience || [])];
                        next[idx] = { ...next[idx], company: e.target.value };
                        setProfile({ ...profile, experience: next });
                      }} />
                      <Input placeholder="Period (e.g., 2022–2024)" value={exp.period || ""} onChange={(e) => {
                        const next = [...(profile.experience || [])];
                        next[idx] = { ...next[idx], period: e.target.value };
                        setProfile({ ...profile, experience: next });
                      }} />
                      <Textarea placeholder="Description" value={exp.description || ""} onChange={(e) => {
                        const next = [...(profile.experience || [])];
                        next[idx] = { ...next[idx], description: e.target.value };
                        setProfile({ ...profile, experience: next });
                      }} />
                      <div className="flex justify-end">
                        <Button variant="destructive" size="sm" onClick={() => {
                          const next = (profile.experience || []).filter((_: any, i: number) => i !== idx);
                          setProfile({ ...profile, experience: next });
                        }}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setProfile({ ...profile, experience: [ ...(profile.experience||[]), { role: "", company: "", period: "", description: "" } ] })}>Add Experience</Button>
                </div>
                <div className="space-y-3">
                  <div className="font-semibold">Education</div>
                  {(profile.education || []).map((ed: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border space-y-2">
                      <Input placeholder="School" value={ed.school || ""} onChange={(e) => {
                        const next = [...(profile.education || [])];
                        next[idx] = { ...next[idx], school: e.target.value };
                        setProfile({ ...profile, education: next });
                      }} />
                      <Input placeholder="Degree" value={ed.degree || ""} onChange={(e) => {
                        const next = [...(profile.education || [])];
                        next[idx] = { ...next[idx], degree: e.target.value };
                        setProfile({ ...profile, education: next });
                      }} />
                      <Input placeholder="Period (e.g., 2018–2022)" value={ed.period || ""} onChange={(e) => {
                        const next = [...(profile.education || [])];
                        next[idx] = { ...next[idx], period: e.target.value };
                        setProfile({ ...profile, education: next });
                      }} />
                      <div className="flex justify-end">
                        <Button variant="destructive" size="sm" onClick={() => {
                          const next = (profile.education || []).filter((_: any, i: number) => i !== idx);
                          setProfile({ ...profile, education: next });
                        }}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setProfile({ ...profile, education: [ ...(profile.education||[]), { school: "", degree: "", period: "" } ] })}>Add Education</Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {profile.bio ? (
                <div>
                  <div className="text-sm font-medium mb-1">About</div>
                  <div className="text-muted-foreground whitespace-pre-line">{profile.bio}</div>
                </div>
              ) : null}

              {(profile.skills || []).length ? (
                <div>
                  <div className="text-sm font-medium mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">{(profile.skills || []).map((s: string, i: number) => (<Badge key={i}>{s}</Badge>))}</div>
                </div>
              ) : null}

              {(profile.experience || []).length ? (
                <div>
                  <div className="text-sm font-medium mb-2">Experience</div>
                  <div className="space-y-3">
                    {(profile.experience || []).map((exp: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg border">
                        <div className="font-medium">{exp.role} • {exp.company}</div>
                        <div className="text-sm text-muted-foreground">{exp.period}</div>
                        {exp.description ? (<div className="text-sm mt-2 text-muted-foreground whitespace-pre-line">{exp.description}</div>) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {(profile.education || []).length ? (
                <div>
                  <div className="text-sm font-medium mb-2">Education</div>
                  <div className="space-y-3">
                    {(profile.education || []).map((ed: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg border">
                        <div className="font-medium">{ed.school} • {ed.degree}</div>
                        <div className="text-sm text-muted-foreground">{ed.period}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
