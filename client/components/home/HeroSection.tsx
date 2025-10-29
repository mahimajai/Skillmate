import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const goBrowse = () => {
    navigate(`/video-call`);
  };

  return (
    <section className="relative min-h-[520px] skillmate-gradient-light overflow-hidden flex items-center">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            SkillMate — Learn. Teach. Exchange.
          </h1>
          <p className="text-lg text-gray-200">
            Find partners to learn new skills and share what you know.
          </p>
          <div className="flex gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            <Button onClick={goBrowse} className="px-6">Get Started</Button>
          </div>
          <p className="text-sm text-gray-300">Tip: The Video Call demo is available at /video-call</p>
        </div>
      </div>
    </section>
  );
}
