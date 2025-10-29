export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-12 prose prose-invert max-w-3xl">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p>Welcome to the SkillMate Help Center. Find answers, guides, and tips to get the most out of SkillMate.</p>
        <h2>Getting started</h2>
        <ol>
          <li>Create an account and verify your email.</li>
          <li>Complete your profile: skills, bio, links, and location.</li>
          <li>Browse skills and connect via messages or video calls.</li>
        </ol>
        <h2>Account & security</h2>
        <ul>
          <li>Use a strong, unique password. Never share credentials.</li>
          <li>Report suspicious activity from the Report Issue page.</li>
          <li>Update profile details anytime from the Dashboard.</li>
        </ul>
        <h2>Calls and sessions</h2>
        <p>Use the built‑in video call to collaborate. Make sure you have a reliable internet connection, working mic, and camera.</p>
        <h2>FAQs</h2>
        <details>
          <summary>Is SkillMate free?</summary>
          <p>SkillMate is free to use. Some advanced features may be introduced later.</p>
        </details>
        <details>
          <summary>How do I reset my password?</summary>
          <p>From the Login page, select “Forgot password” (coming soon) or contact support.</p>
        </details>
      </div>
    </div>
  );
}
