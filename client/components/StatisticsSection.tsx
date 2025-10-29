import { Users, BookOpen, Clock, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "50,000+",
    label: "Active Learners",
    description: "Join thousands of skill enthusiasts"
  },
  {
    icon: BookOpen,
    number: "1,200+",
    label: "Skills Available",
    description: "From coding to cooking"
  },
  {
    icon: Clock,
    number: "100,000+",
    label: "Hours Exchanged",
    description: "Time spent learning together"
  },
  {
    icon: Globe,
    number: "180+",
    label: "Countries",
    description: "Global community reach"
  }
];

export default function StatisticsSection() {
  return (
    <section className="py-20 skillmate-gradient-light relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-white">
            Growing Community Impact
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See how SkillMate is transforming lives through skill sharing and collaborative learning worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-200">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-300">
                    {stat.description}
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
