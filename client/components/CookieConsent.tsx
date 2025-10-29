import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent";

type Consent = "accepted" | "rejected";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Consent | null;
    if (!saved) setVisible(true);
  }, []);

  const setConsent = (value: Consent) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="container mx-auto px-4 pb-4">
        <div className="bg-card border border-border/50 rounded-lg shadow-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience and analyze site usage. Read our {" "}
            <Link className="underline" to="/privacy-policy">Privacy Policy</Link> and {" "}
            <Link className="underline" to="/cookie-policy">Cookie Policy</Link> for details.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setConsent("rejected")}>Decline</Button>
            <Button size="sm" onClick={() => setConsent("accepted")}>Accept</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
