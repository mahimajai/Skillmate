import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ReportIssue() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error((data as any)?.error || "Failed to submit");
      setStatus("success");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
        <p className="text-muted-foreground mb-6">Tell us what went wrong or what you’re concerned about. We review every report.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <Input name="name" required placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select name="category" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="bug">Bug</option>
              <option value="abuse">Abuse</option>
              <option value="payment">Payment</option>
              <option value="privacy">Privacy</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Subject</label>
            <Input name="subject" required placeholder="Short summary" />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <Textarea name="description" required rows={6} placeholder="Provide clear details, steps to reproduce, and any relevant info." />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Submitting..." : "Submit"}</Button>
            {status === "success" && <span className="text-green-500 text-sm">Thanks! We received your report.</span>}
            {status === "error" && <span className="text-red-500 text-sm">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
