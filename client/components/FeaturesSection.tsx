import { 
  UserCheck, 
  MessageSquare, 
  Star, 
  Shield, 
  Clock, 
  Users,
  Zap,
  TrendingUp 
} from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Smart Matching",
    description: "Our AI-powered algorithm matches you with the perfect skill partners based on your interests and expertise.",
    gradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"
  },
  {
    icon: MessageSquare,
    title: "Built-in Chat",
    description: "Seamlessly communicate with your skill partners through our integrated messaging system.",
    gradient: "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500"
  },
  {
    icon: Star,
    title: "Rating System",
    description: "Build trust through our transparent rating and review system for all skill exchanges.",
    gradient: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "All users are verified to ensure safe and authentic skill-sharing experiences.",
    gradient: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600"
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Schedule sessions that work for both parties with our intuitive calendar integration.",
    gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join a vibrant community of learners and teachers from around the world.",
    gradient: "bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500"
  },
  {
    icon: Zap,
    title: "Instant Connections",
    description: "Connect with skill partners instantly and start learning or teaching right away.",
    gradient: "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600"
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your learning journey and skill development with detailed progress tracking.",
    gradient: "bg-gradient-to-br from-emerald-400 via-green-500 to-blue-600"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            Why Choose SkillMate?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the powerful features that make SkillMate the ultimate platform 
            for peer-to-peer skill exchange and collaborative learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group p-6 rounded-2xl ${feature.gradient} hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
