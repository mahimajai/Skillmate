export default function Blog() {
  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-12 prose prose-invert max-w-3xl">
        <h1 className="text-3xl font-bold">SkillMate Blog</h1>
        <article>
          <h2>Launching SkillMate</h2>
          <p>We’re excited to share the first public release of SkillMate, focused on seamless peer‑to‑peer learning.</p>
        </article>
        <article>
          <h2>Tips for better live sessions</h2>
          <ul>
            <li>Define a clear objective</li>
            <li>Share resources in advance</li>
            <li>Record action items</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
