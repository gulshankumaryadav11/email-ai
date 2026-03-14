const features = [
  {
    icon: "⚡",
    name: "Instant Generation",
    desc: "Paste your email and get reply in seconds."
  },
  {
    icon: "🎭",
    name: "Tone Control",
    desc: "Professional, Friendly, Casual."
  },
  {
    icon: "🧠",
    name: "Smart Instructions",
    desc: "Add custom AI instructions."
  },
  {
    icon: "📋",
    name: "Copy & Download",
    desc: "One click copy or download."
  }
];

export default function Features() {
  return (
    <section className="lp-features">

      <div className="lp-section-label">
        Why EMIPI
      </div>

      <h2 className="lp-section-title">
        Everything you need to reply smarter
      </h2>

      <div className="lp-feature-grid">

        {features.map(f => (
          <div key={f.name} className="lp-feature-card">

            <div className="lp-feature-icon">{f.icon}</div>

            <div className="lp-feature-name">{f.name}</div>

            <div className="lp-feature-desc">{f.desc}</div>

          </div>
        ))}

      </div>

    </section>
  );
}