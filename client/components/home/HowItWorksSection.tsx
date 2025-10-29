import { UserPlus, Search, MessageCircle, Star } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Profile", desc: "Share what you can teach and want to learn." },
  { icon: Search, title: "Find Match", desc: "We match you with ideal partners." },
  { icon: MessageCircle, title: "Connect", desc: "Chat, plan, and schedule sessions." },
  { icon: Star, title: "Learn & Teach", desc: "Exchange skills and rate your experience." },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">Four simple steps to start your journey</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl bg-card border p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <s.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
