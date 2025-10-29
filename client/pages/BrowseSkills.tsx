import { Search, Filter, MapPin, Clock, Star, User, MessageCircle, Heart, MoreHorizontal, RefreshCw, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { SkillPost } from "@/lib/posts-storage";
import { fetchPosts, likePost, respondToPost } from "@/lib/posts-api";
import { getCurrentUser } from "@/lib/posts-storage";
import { createMessageNotification, createConnectNotification } from "@/lib/notifications-storage";
import { useToast } from "@/hooks/use-toast";
import { VideoCallModal, useIncomingCall } from "@/components/VideoCallModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const categories = ["All", "Programming", "Design", "Marketing", "Music", "Creative", "Lifestyle", "Communication", "Business"];
const postTypes = ["All", "Teaching", "Learning", "Exchange"];

export default function BrowseSkills() {
  const [searchParams] = useSearchParams();
  const [skillPosts, setSkillPosts] = useState<SkillPost[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const navigate = useNavigate();
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [videoPeerId, setVideoPeerId] = useState("");
  const selfId = getCurrentUser().name;

  const { incoming, clear } = useIncomingCall(selfId);
  const [incomingOpen, setIncomingOpen] = useState(false);

  useEffect(() => { loadPosts(); }, []);
  useEffect(() => { /* react to url changes */ setSearchTerm(searchParams.get("search") || ""); }, [searchParams]);
  useEffect(() => { if (incoming) setIncomingOpen(true); }, [incoming]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const { posts } = await fetchPosts();
      setSkillPosts(posts);
    } catch {}
    setIsLoading(false);
  };

  const handleLike = async (postId: number) => { try { await likePost(postId); } catch {} loadPosts(); };
  const handleResponse = async (postId: number) => { try { await respondToPost(postId); } catch {} loadPosts(); };

  const handleMessage = (post: SkillPost) => {
    const currentUser = getCurrentUser();
    if (post.user.name === currentUser.name) { toast({ title: "Cannot message yourself" }); return; }
    createMessageNotification({ name: currentUser.name, avatar: currentUser.avatar }, `Hi! I'm interested in your ${post.skill}.`);
    window.dispatchEvent(new Event("notificationUpdated"));
    toast({ title: "Message sent!", description: `Sent to ${post.user.name}` });
  };

  const handleConnect = (post: SkillPost) => {
    const currentUser = getCurrentUser();
    if (post.user.name === currentUser.name) { toast({ title: "Cannot connect to yourself" }); return; }
    createConnectNotification({ name: currentUser.name, avatar: currentUser.avatar }, post.skill);
    window.dispatchEvent(new Event("notificationUpdated"));
    toast({ title: "Connect request sent!", description: `Sent to ${post.user.name}` });
  };

  const handleVideoCall = (post: SkillPost) => {
    const currentUser = getCurrentUser();
    if (post.user.name === currentUser.name) { toast({ title: "Cannot call yourself" }); return; }
    setVideoPeerId(post.user.name);
    setVideoCallOpen(true);
  };

  const filteredPosts = skillPosts.filter(post => {
    const matchesSearch = post.skill.toLowerCase().includes(searchTerm.toLowerCase()) || post.description.toLowerCase().includes(searchTerm.toLowerCase()) || post.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesType = selectedType === "All" || (selectedType === "Teaching" && post.type === "teach") || (selectedType === "Learning" && post.type === "learn") || (selectedType === "Exchange" && post.type === "exchange");
    return matchesSearch && matchesCategory && matchesType;
  });

  const getPostTypeColor = (type: string) => type === 'teach' ? 'bg-blue-100 text-blue-800' : type === 'learn' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';
  const getPostTypeLabel = (type: string) => type === 'teach' ? 'Teaching' : type === 'learn' ? 'Learning' : 'Exchange';

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Browse Skills</h1>
                <p className="text-muted-foreground">Discover amazing skills from our community.</p>
              </div>
              <Button variant="outline" onClick={loadPosts} disabled={isLoading} className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />Refresh
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input placeholder="Search skills, people, or descriptions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12 text-base" />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2"><Filter className="w-4 h-4" />Filters</Button>
              <div className="flex flex-wrap gap-2">
                {postTypes.map((type) => (
                  <Button key={type} variant={selectedType === type ? "default" : "outline"} size="sm" onClick={() => setSelectedType(type)}>{type}</Button>
                ))}
              </div>
            </div>
            {showFilters && (
              <div className="bg-card rounded-xl p-6 border border-border/20 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category} variant={selectedCategory === category ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory(category)}>{category}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-16">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No skills found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-card rounded-xl p-6 border border-border/20 hover:shadow-lg transition-all duration-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">{post.user.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-foreground">{post.user.name}</h3>
                            <div className="flex items-center space-x-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="text-sm text-muted-foreground">{post.user.rating}</span></div>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{post.user.completedExchanges} exchanges</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{post.user.location}</span></div>
                            <div className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{post.postedTime}</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPostTypeColor(post.type)}>{getPostTypeLabel(post.type)}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/user/${encodeURIComponent(post.user.name)}`)}>View user profile</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">{post.skill}</h4>
                        <p className="text-muted-foreground leading-relaxed">{post.description}</p>
                        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
                          <div className="bg-muted/30 rounded-md p-2">
                            <span className="font-medium">Teach:</span> {post.type === 'learn' ? (post.offeringSkill || '—') : post.skill}
                          </div>
                          <div className="bg-muted/30 rounded-md p-2">
                            <span className="font-medium">Learn:</span> {post.type === 'learn' ? post.skill : (post.seekingSkill || '—')}
                          </div>
                          <div className="bg-muted/30 rounded-md p-2">
                            <span className="font-medium">Session:</span> {post.sessionType} • {post.duration}
                          </div>
                          <div className="bg-muted/30 rounded-md p-2">
                            <span className="font-medium">Level:</span> {post.experienceLevel}
                          </div>
                          {post.tags?.length ? (
                            <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
                              {post.tags.map((t, i) => (<Badge key={i} variant="outline">{t}</Badge>))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border/20">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <button className="flex items-center space-x-1 hover:text-foreground" onClick={() => handleLike(post.id)}><Heart className="w-4 h-4" /><span>{post.likes}</span></button>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleMessage(post)}><MessageCircle className="w-4 h-4 mr-2" />Message</Button>
                          <Button variant="secondary" size="sm" onClick={() => handleVideoCall(post)}><Video className="w-4 h-4 mr-2" />Video Call</Button>
                          <Button size="sm" onClick={() => handleConnect(post)}><User className="w-4 h-4 mr-2" />Connect</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {videoCallOpen && (
        <VideoCallModal
          open={videoCallOpen}
          onOpenChange={(v) => setVideoCallOpen(v)}
          role="caller"
          selfId={selfId}
          peerId={videoPeerId}
        />
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
  );
}
