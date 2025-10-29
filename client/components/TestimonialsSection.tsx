import { Video, Phone, UserCheck, Calendar, MessageSquare, Clock } from "lucide-react";

const videoCallFeatures = [
  { icon: UserCheck, title: "Connect First", description: "Send a connect request to any skill teacher or learner you're interested in.", step: "Step 1", gradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500" },
  { icon: MessageSquare, title: "Chat & Plan", description: "Use chat to discuss goals and schedule a session.", step: "Step 2", gradient: "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500" },
  { icon: Video, title: "Start Video Call", description: "Click the video call button in your conversation.", step: "Step 3", gradient: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600" },
  { icon: Calendar, title: "Schedule Sessions", description: "Book regular sessions with the integrated calendar.", step: "Step 4", gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" },
  { icon: Phone, title: "Quality Calls", description: "HD video, screen sharing and recording options.", step: "Step 5", gradient: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500" },
  { icon: Clock, title: "Track Progress", description: "Monitor your history and milestones.", step: "Step 6", gradient: "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            Start Video Calls with Your Skill Partners
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect face-to-face with teachers and learners worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoCallFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className={`group p-6 rounded-2xl ${feature.gradient} hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden`}>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-white/70 uppercase tracking-wide">{feature.step}</div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-white/90 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Video className="w-5 h-5 text-primary" />
              <span className="font-semibold">HD Video Quality</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Phone className="w-5 h-5 text-primary" />
              <span className="font-semibold">Crystal Clear Audio</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span className="text-primary font-bold">🔒</span>
              <span className="font-semibold">Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
