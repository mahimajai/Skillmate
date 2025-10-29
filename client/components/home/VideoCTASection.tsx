import { Video, Phone } from "lucide-react";

export default function VideoCTASection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 text-center space-y-4">
        <Video className="w-10 h-10 text-primary mx-auto" />
        <h3 className="text-2xl font-bold">Face-to-face learning with video calls</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Start HD video sessions with your partners for better, more personal learning.
        </p>
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Video className="w-4 h-4 text-primary" />HD Video</span>
          <span>•</span>
          <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4 text-primary" />Clear Audio</span>
        </div>
      </div>
    </section>
  );
}
