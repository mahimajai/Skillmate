import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <section className="relative min-h-[600px] skillmate-gradient-light overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-60 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-32 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Unleash your inner{" "}
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                  wizard
                </span>
                , one skill at a time!
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Swap skills, share knowledge, and find your perfect SkillMate.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search skills you want to learn today?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 transition-colors"
                />
              </div>
              
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-full" onClick={handleSearch}>
                Start Skill Swap
              </Button>
            </div>
          </div>

          <div className="relative lg:block hidden">
            <div className="flicker-border rounded-3xl">
            <img
              src="./second1.png"
              alt="SkillMate team illustration"
              className="w-full h-auto rounded-3xl drop-shadow-2xl"
            />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}