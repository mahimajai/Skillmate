import { 
  Zap, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  MapPin,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  community: [
    { name: "Help Center", href: "/help-center" },
    { name: "Safety Guidelines", href: "/safety-guidelines" },
    { name: "Community Rules", href: "/community-rules" },
    { name: "Report Issue", href: "/report-issue" }
  ],
  company: [
    { name: "About Us", href: "/about-us" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Refund Policy", href: "/refund-policy" }
  ]
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "GitHub", icon: Github, href: "#" }
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/10">
      <div className="container mx-auto px-4">
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">SkillMate</span>
              </Link>

              <p className="text-muted-foreground max-w-md leading-relaxed">
                The world's largest peer-to-peer skill exchange platform. Learn new skills by teaching what you know.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">9004422562</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">skillmate@gmail.com</span>
                </div>
              </div>

              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a key={social.name} href={social.href} className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-foreground mb-4 mt-8">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-border/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">© 2024 SkillMate. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>All systems operational</span>
              </div>
              <span>•</span>
              <span>50,000+ active users</span>
              <span>•</span>
              <span>1,200+ skills available</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
