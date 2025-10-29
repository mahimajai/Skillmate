import { UserCheck, MessageSquare, Star, Shield, Clock, Users, Zap, TrendingUp } from "lucide-react";

const features = [
  { icon: UserCheck, title: "Smart Matching", desc: "AI-powered matching to find perfect partners." },
  { icon: MessageSquare, title: "Built-in Chat", desc: "Message your partners seamlessly." },
  { icon: Star, title: "Ratings", desc: "Build trust with transparent reviews." },
  { icon: Shield, title: "Verified", desc: "Verified profiles for safer exchanges." },
  { icon: Clock, title: "Flexible", desc: "Schedule sessions that fit your time." },
  { icon: Users, title: "Community", desc: "Join a global skill community." },
  { icon: Zap, title: "Instant", desc: "Connect and start immediately." },
  { icon: TrendingUp, title: "Progress", desc: "Track your learning journey." },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Why Choose SkillMate?</h2>
          <p className="text-muted-foreground">Powerful features for peer-to-peer learning</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
