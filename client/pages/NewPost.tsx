import { Plus, BookOpen, GraduationCap, ArrowRightLeft, MapPin, Clock, Users, Save, Send, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "@/lib/posts-api";
import { useToast } from "@/hooks/use-toast";

const skillCategories = [
  "Programming", "Design", "Marketing", "Business", "Language", "Music", 
  "Art", "Photography", "Writing", "Cooking", "Fitness", "Crafts", "Finance",
  "Communication", "Data Analysis", "Video Editing", "Teaching", "Health"
];

const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const sessionDurations = ["30 minutes", "1 hour", "1.5 hours", "2 hours", "2+ hours", "Flexible"];
const sessionTypes = ["Online Only", "In-Person Only", "Both Online & In-Person"];

export default function NewPost() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postType, setPostType] = useState<"teach" | "learn" | "exchange">("teach");
  const [skillTitle, setSkillTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [seekingSkill, setSeekingSkill] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const handleSubmit = async () => {
    if (!skillTitle || !description) { toast({ title: "Please fill title and description" }); return; }
    setIsSubmitting(true);
    try {
      const postData = {
        type: postType,
        skill: skillTitle,
        category: category || "Other",
        description,
        sessionType: sessionType || "Online/In-person",
        duration: sessionDuration || "1 hour",
        experienceLevel: experienceLevel || "All levels",
        tags: selectedCategories.length > 0 ? selectedCategories : [category].filter(Boolean),
        ...(postType === "teach" || postType === "exchange" ? { seekingSkill } : {}),
        ...(postType === "learn" ? { offeringSkill: seekingSkill } : {}),
      } as any;
      await createPost(postData);
      toast({ title: "Post Published" });
      navigate(`/browse?search=${encodeURIComponent(skillTitle)}`);
    } catch (e) {
      toast({ title: "Error", description: "Could not save post" });
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3"><Plus className="w-8 h-8" />Share Your Skills</h1>
            <p className="text-muted-foreground">Post what you can teach or what you'd like to learn. Connect with fellow skill enthusiasts!</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl p-6 border bg-card">
                <h2 className="text-lg font-semibold mb-4">What would you like to do?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button onClick={() => setPostType("teach")} className={`p-4 rounded-xl border-2 transition ${postType === "teach" ? 'border-blue-500 bg-blue-50/10' : 'border-border/20 hover:border-blue-300'}`}>
                    <div className="text-center space-y-2">
                      <GraduationCap className="w-8 h-8 text-blue-500 mx-auto" />
                      <h3 className="font-semibold">Teach a Skill</h3>
                      <p className="text-sm text-muted-foreground">Share your expertise</p>
                    </div>
                  </button>
                  <button onClick={() => setPostType("learn")} className={`p-4 rounded-xl border-2 transition ${postType === "learn" ? 'border-green-500 bg-green-50/10' : 'border-border/20 hover:border-green-300'}`}>
                    <div className="text-center space-y-2">
                      <BookOpen className="w-8 h-8 text-green-500 mx-auto" />
                      <h3 className="font-semibold">Learn a Skill</h3>
                      <p className="text-sm text-muted-foreground">Find someone to teach you</p>
                    </div>
                  </button>
                  <button onClick={() => setPostType("exchange")} className={`p-4 rounded-2xl border-2 transition ${postType === "exchange" ? 'border-purple-500 bg-purple-50/10' : 'border-border/20 hover:border-purple-300'}`}>
                    <div className="text-center space-y-2">
                      <ArrowRightLeft className="w-8 h-8 text-purple-500 mx-auto" />
                      <h3 className="font-semibold">Skill Exchange</h3>
                      <p className="text-sm text-muted-foreground">Teach one, learn another</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl p-6 border bg-card space-y-4">
                <h2 className="text-lg font-semibold">{postType === "teach" ? "What skill can you teach?" : postType === "learn" ? "What skill do you want to learn?" : "What skill do you want to teach?"}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Skill Title *</label>
                    <Input placeholder={postType === "teach" ? "e.g., React.js Development for Beginners" : postType === "learn" ? "e.g., Photography and Photo Editing" : "e.g., Web Development with JavaScript"} value={skillTitle} onChange={(e) => setSkillTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Textarea rows={5} placeholder={postType === "teach" ? "Describe your experience and what you'll cover..." : postType === "learn" ? "Explain what you want to learn and your goals..." : "Describe what you can teach and what you hope to learn in return..."} value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground">
                        <option value="">Select a category</option>
                        {skillCategories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{postType === "learn" ? "Your Current Level" : "Experience Level Required"}</label>
                      <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground">
                        <option value="">Select level</option>
                        {experienceLevels.map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {(postType === "teach" || postType === "exchange") && (
                <div className="rounded-2xl p-6 border bg-card">
                  <h2 className="text-lg font-semibold mb-3">What would you like to learn in return?</h2>
                  <Input placeholder="e.g., UI/UX Design, Photography, Marketing..." value={seekingSkill} onChange={(e) => setSeekingSkill(e.target.value)} />
                  <p className="text-sm text-muted-foreground mt-2">This helps match you with people who can teach what you want to learn</p>
                </div>
              )}
              {postType === "learn" && (
                <div className="rounded-2xl p-6 border bg-card">
                  <h2 className="text-lg font-semibold mb-3">What can you offer in return?</h2>
                  <Input placeholder="e.g., Python Programming, Cooking, Music Theory" value={seekingSkill} onChange={(e) => setSeekingSkill(e.target.value)} />
                </div>
              )}

              <div className="rounded-2xl p-6 border bg-card">
                <h2 className="text-lg font-semibold mb-4">Session Preferences</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2"><Clock className="w-4 h-4 inline mr-1" />Session Duration</label>
                    <select value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground">
                      <option value="">Select duration</option>
                      {sessionDurations.map((d) => (<option key={d} value={d}>{d}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2"><MapPin className="w-4 h-4 inline mr-1" />Session Type</label>
                    <select value={sessionType} onChange={(e) => setSessionType(e.target.value)} className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground">
                      <option value="">Select type</option>
                      {sessionTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border bg-card">
                <h2 className="text-lg font-semibold mb-4">Add Tags (Optional)</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategories.map((cat) => (
                    <Badge key={cat} variant="default" className="cursor-pointer" onClick={() => toggleCategory(cat)}>
                      {cat}<X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillCategories.filter((c) => !selectedCategories.includes(c)).map((cat) => (
                    <Badge key={cat} variant="outline" className="cursor-pointer" onClick={() => toggleCategory(cat)}>
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl p-6 border bg-card">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="p-4 rounded-xl bg-background border space-y-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {(() => { const raw = localStorage.getItem("skillmate_user_profile"); const profile = raw ? JSON.parse(raw) : null; const initials = profile?.name ? profile.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2) : ""; return (
                        <>
                          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">{initials}</div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{profile?.name || ""}</p>
                            <div className="flex items-center space-x-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><span className="text-xs text-muted-foreground">{typeof profile?.rating === 'number' ? profile.rating : 0}</span></div>
                          </div>
                        </>
                      ); })()}
                    </div>
                    <Badge className={postType === 'teach' ? 'bg-blue-100 text-blue-800' : postType === 'learn' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                      {postType === 'teach' ? 'Teaching' : postType === 'learn' ? 'Learning' : 'Exchange'}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{skillTitle || "Your skill title will appear here"}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{description || "Your description will appear here..."}</p>
                  {seekingSkill && (
                    <div className="bg-muted/30 rounded-lg p-2 mb-3 text-xs"><span className="font-medium">{postType === 'learn' ? 'Offering:' : 'Seeking:'}</span> {seekingSkill}</div>
                  )}
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Just now</span><span>{sessionDuration || "Duration TBD"}</span></div>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full" onClick={handleSubmit} disabled={!skillTitle || !description || isSubmitting}>
                  {isSubmitting ? (<><div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />Publishing...</>) : (<><Send className="w-4 h-4 mr-2" />Publish Post</>) }
                </Button>
                <Button variant="outline" className="w-full" disabled={isSubmitting}><Save className="w-4 h-4 mr-2" />Save as Draft</Button>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/browse')} disabled={isSubmitting}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
