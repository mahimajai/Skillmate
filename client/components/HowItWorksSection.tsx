import { UserPlus, Search, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/lib/auth-storage";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and tell us about the skills you can teach and what you'd like to learn. Add your experience and availability."
  },
  {
    step: "02", 
    icon: Search,
    title: "Find Your Match",
    description: "Our smart algorithm will match you with perfect skill partners based on your interests, location, and schedule."
  },
  {
    step: "03",
    icon: MessageCircle,
    title: "Connect & Plan",
    description: "Chat with your matches, plan your skill exchange sessions, and set up meeting times that work for both of you."
  },
  {
    step: "04",
    icon: Star,
    title: "Learn & Teach",
    description: "Start your skill exchange! Attend sessions, track your progress, and rate your experience to help the community."
  }
];

export default function HowItWorksSection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            How SkillMate Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these four easy steps to begin your skill exchange journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-primary/30 transform translate-x-1/2"></div>
                )}
                
                <div className="text-center space-y-6 relative z-10">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white font-bold text-lg relative">
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center text-xs text-primary font-bold">
                        {step.step}
                      </span>
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to Start Your Skill Journey?
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join thousands of learners and teachers who are already transforming their skills.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8"
              onClick={() => {
                if (isLoggedIn()) navigate('/browse');
                else navigate('/signup');
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8"
              onClick={() => window.open('/Media2.mp4', '_blank')}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
