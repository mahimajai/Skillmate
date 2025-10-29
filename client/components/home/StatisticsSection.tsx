import { Users, BookOpen, Clock, Globe } from "lucide-react";

const stats = [
  { icon: Users, number: "50,000+", label: "Active Learners" },
  { icon: BookOpen, number: "1,200+", label: "Skills Available" },
  { icon: Clock, number: "100,000+", label: "Hours Exchanged" },
  { icon: Globe, number: "180+", label: "Countries" },
];

export default function StatisticsSection() {
  return (
    <section className="py-16 skillmate-gradient-light relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Growing Community</h2>
          <p className="text-gray-200">SkillMate is transforming learning worldwide</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center space-y-3 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm text-white">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto">
                <s.icon className="w-7 h-7" />
              </div>
              <div className="text-2xl font-bold">{s.number}</div>
              <div className="text-sm text-gray-200">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
