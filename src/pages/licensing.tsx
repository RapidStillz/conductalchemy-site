import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

const API = "https://dark-voice-ab4b.rapidstillz.workers.dev";

const useCases = [
  ["Film & Drama", "For scenes, emotional sequences, title sequences, end credits and narrative moments."],
  ["Advertising & Brand Campaigns", "For digital campaigns, brand films, launch content, social ads and broadcast-led creative."],
  ["Trailers & Promos", "For cinematic trailers, teasers, sizzles, campaign films and launch promos."],
  ["Creators & Online Content", "For YouTube, social, reels, documentaries, branded creator work and editorial content."],
  ["Custom / Commissioned Work", "For bespoke lyrics, alternate versions, campaign-specific edits and music shaped around picture."],
];

const pathways = [
  ["Creator / Online Licence", "YouTube, organic social, creator-led edits and editorial content.", "A practical route for lower-risk online usage where the project scope is clear and non-exclusive."],
  ["Commercial Campaign Licence", "Brand films, paid social, digital campaigns, launch content and advertising.", "Scoped around campaign usage, platform, paid media, duration, territory and audience reach."],
  ["Film / TV / Sync Licence", "Short films, features, documentaries, TV, promos and title sequences.", "Project-specific sync clearance for narrative, broadcast, VOD, festival or theatrical contexts."],
  ["Bespoke / Exclusive Licence", "Premium pitches, exclusive campaigns, custom edits and commissioned work.", "A negotiated route for exclusivity, bespoke versions, reworks around picture or deal-stage deliverables."],
];

const deliverables = [
  "Full vocal master",
  "Instrumental version",
  "15s / 30s / 60s edits",
  "Trailer cutdowns",
  "Loopable sections",
  "Lyric-free versions",
  "Alternative mixes",
  "Bespoke rework for picture",
  "Usage letter / licence confirmation",
];

const licenceFields = [
  "Project type",
  "Track/version required",
  "Media usage",
  "Territory",
  "Duration",
  "Paid advertising",
  "Broadcast / VOD / theatrical use",
  "Exclusivity",
  "Deadline",
  "Budget range",
];

const faqs = [
  ["Can I license a track for a film or short film?", "Yes. Conduct Alchemy compositions may be licensed for film, documentary, trailers, promos and scripted visual projects, subject to project scope."],
  ["Can I use a track in paid advertising?", "Yes. Paid media requires a commercial licence scoped to the campaign, platform, territory, duration and usage."],
  ["Can I request an instrumental or custom edit?", "Yes. Instrumentals, shorter edits, lyric-free versions and bespoke reworks may be available depending on the track and project."],
  ["Do you offer exclusive licences?", "Potentially. Exclusivity is handled on a project-by-project basis and usually requires a bespoke agreement."],
  ["Can I use the music before the licence is agreed?", "No. Usage is only permitted after written licence confirmation."],
  ["Is Conduct Alchemy suitable for pitches and early creative development?", "Yes. For pitches, treatments and internal development, request access and explain the intended use so the correct licence route can be advised."],
];

const page: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(189, 147, 84, 0.18), transparent 32rem), linear-gradient(135deg, #09090b 0%, #141014 50%, #050506 100%)",
  color: "#f7efe2",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const shell: CSSProperties = {
  width: "min(1120px, calc(100% - 32px))",
  margin: "0 auto",
};

const section: CSSProperties = {
  padding: "72px 0",
};

const panel: CSSProperties = {
  background: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: 28,
  boxShadow: "0 24px 90px rgba(0, 0, 0, 0.3)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: 14,
  padding: "14px 16px",
  background: "rgba(10, 10, 12, 0.72)",
  color: "#fff7ec",
  fontSize: 15,
  outline: "none",
};

function Eyebrow({ children }: { children: string }) {
  return (
    <p style={{ color: "#d7b978", letterSpacing: 2, textTransform: "uppercase", marginTop: 0 }}>
      {children}
    </p>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article style={{ ...panel, padding: 24 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ color: "#d8cdbd", lineHeight: 1.65 }}>{children}</div>
    </article>
  );
}

export default function Licensing() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [trackInterest, setTrackInterest] = useState("");
  const [projectType, setProjectType] = useState("Film / Drama");
  const [intendedUsage, setIntendedUsage] = useState("");
  const [duration, setDuration] = useState("1 Year");
  const [territory, setTerritory] = useState("UK");
  const [paidMedia, setPaidMedia] = useState("Unsure");
  const [deadline, setDeadline] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [message, setMessage] = useState("");
  const [exclusive, setExclusive] = useState(false);
  const [price, setPrice] = useState(1500);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const usage = useMemo(() => {
    if (projectType.includes("Advertising")) return "Ads";
    if (projectType.includes("Creator")) return "Social";
    if (projectType.includes("TV")) return "TV";
    return "Film";
  }, [projectType]);

  useEffect(() => {
    let base = 1500;
    if (usage === "TV") base = 1000;
    if (usage === "Ads") base = 2000;
    if (usage === "Social") base = 500;

    const durationMult = duration === "3 Years" ? 1.8 : duration === "Perpetual" ? 3 : 1;
    const territoryMult = territory === "EU" ? 1.5 : territory === "Worldwide" ? 2.2 : 1;
    const paidMediaMult = paidMedia === "Yes" ? 1.35 : 1;
    const exclusivityMult = exclusive ? 2 : 1;

    setPrice(Math.round(base * durationMult * territoryMult * paidMediaMult * exclusivityMult));
  }, [usage, duration, territory, paidMedia, exclusive]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please add your name and email so we can respond to the enquiry.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          track: trackInterest,
          trackInterest,
          usage,
          projectType,
          intendedUsage,
          duration,
          territory,
          paidMedia,
          deadline,
          budgetRange,
          message,
          exclusive,
          value: price,
        }),
      });

      if (!response.ok) throw new Error("Lead submission failed");
      setSubmitted(true);
    } catch {
      setError("The enquiry could not be sent. Please try again or email licensing@conductalchemy.com.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main style={page}>
        <div style={{ ...shell, padding: "96px 0" }}>
          <div style={{ ...panel, padding: "42px" }}>
            <Eyebrow>Enquiry received</Eyebrow>
            <h1 style={{ margin: "12px 0", fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}>Thank you.</h1>
            <p style={{ maxWidth: 680, color: "#d8cdbd", fontSize: 18, lineHeight: 1.7 }}>
              Thank you — your licensing enquiry has been received. We’ll review the intended use and respond with the most suitable route.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <section style={{ padding: "92px 0 56px" }}>
        <div style={shell}>
          <div style={{ ...panel, padding: "clamp(28px, 6vw, 72px)" }}>
            <Eyebrow>Conduct Alchemy Licensing</Eyebrow>
            <h1 style={{ maxWidth: 920, margin: "18px 0", fontSize: "clamp(2.8rem, 8vw, 6.5rem)", lineHeight: 0.95, letterSpacing: "-0.07em" }}>
              Music forged for cinema, campaigns and emotionally charged visual storytelling.
            </h1>
            <p style={{ maxWidth: 760, color: "#e0d5c4", fontSize: "clamp(1.05rem, 2vw, 1.35rem)", lineHeight: 1.7 }}>
              License original Conduct Alchemy compositions for film, television, advertising, trailers, branded content and digital campaigns.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
              <a href="#licensing-form" style={{ color: "#09090b", background: "#f3c56b", padding: "14px 20px", borderRadius: 999, fontWeight: 800, textDecoration: "none" }}>
                Request a Licensing Quote
              </a>
              <a href="#usage-types" style={{ color: "#f7efe2", border: "1px solid rgba(255,255,255,0.24)", padding: "14px 20px", borderRadius: 999, fontWeight: 700, textDecoration: "none" }}>
                Explore Usage Types
              </a>
            </div>
            <p style={{ marginTop: 24, color: "#b9ad9a" }}>
              Project-based licensing. Instrumental, vocal, edit and custom-version options available.
            </p>
          </div>
        </div>
      </section>

      <section id="usage-types" style={section}>
        <div style={shell}>
          <Eyebrow>Usage types</Eyebrow>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", marginTop: 0 }}>Built for the moments where music carries the story.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {useCases.map(([title, copy]) => <Card key={title} title={title}>{copy}</Card>)}
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={shell}>
          <Eyebrow>Licensing pathways</Eyebrow>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", marginTop: 0 }}>Start with the intended use, then scope the rights properly.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {pathways.map(([title, bestFor, covers]) => (
              <Card key={title} title={title}>
                <p style={{ color: "#f3c56b", fontWeight: 700 }}>{bestFor}</p>
                <p>{covers}</p>
                <a href="#licensing-form" style={{ color: "#f3c56b", fontWeight: 800 }}>Request quote →</a>
              </Card>
            ))}
          </div>
          <p style={{ marginTop: 22, color: "#b9ad9a", lineHeight: 1.7 }}>
            Pricing depends on media, territory, duration, audience size, paid spend, exclusivity and whether custom deliverables are required.
          </p>
        </div>
      </section>

      <section style={section}>
        <div style={{ ...shell, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 }}>
          <div style={{ ...panel, padding: 30 }}>
            <Eyebrow>Deliverables</Eyebrow>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", marginTop: 0 }}>What you can request</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {deliverables.map((item) => <div key={item} style={{ color: "#e6dac8" }}>✦ {item}</div>)}
            </div>
          </div>
          <div style={{ ...panel, padding: 30 }}>
            <Eyebrow>Rights clarity</Eyebrow>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", marginTop: 0 }}>Scoped before release.</h2>
            <p style={{ color: "#d8cdbd", lineHeight: 1.7 }}>
              Every licence is scoped to the project. We define the permitted media, territory, duration, campaign use, exclusivity and deliverables before release of final cleared files.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
              {licenceFields.map((item) => <div key={item} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, color: "#e6dac8" }}>{item}</div>)}
            </div>
            <p style={{ marginTop: 20, color: "#f3c56b", fontWeight: 800, lineHeight: 1.6 }}>
              Submitting an enquiry does not grant usage rights. No rights are granted until a licence is agreed in writing.
            </p>
          </div>
        </div>
      </section>

      <section id="licensing-form" style={section}>
        <div style={{ ...shell, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 26 }}>
          <div>
            <Eyebrow>Project intake</Eyebrow>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", marginTop: 0 }}>Request a licensing quote.</h2>
            <p style={{ color: "#d8cdbd", fontSize: 18, lineHeight: 1.7 }}>
              Share the intended use and we’ll respond with the most suitable licensing route.
            </p>
            <div style={{ ...panel, padding: 24, marginTop: 26 }}>
              <p style={{ margin: 0, color: "#b9ad9a" }}>Current estimate</p>
              <strong style={{ display: "block", fontSize: "clamp(2rem, 5vw, 4rem)", marginTop: 6 }}>£{price}</strong>
              <p style={{ color: "#b9ad9a", lineHeight: 1.6 }}>This is an indicative starting point only. Final pricing depends on the agreed licence scope.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ ...panel, padding: "clamp(22px, 4vw, 34px)", display: "grid", gap: 16 }}>
            <label><span>Name *</span><input style={inputStyle} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label><span>Email *</span><input style={inputStyle} placeholder="you@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label><span>Company / Production</span><input style={inputStyle} placeholder="Company, agency or production" value={company} onChange={(e) => setCompany(e.target.value)} /></label>
            <label><span>Track of interest</span><input style={inputStyle} placeholder="Track name, mood or reference" value={trackInterest} onChange={(e) => setTrackInterest(e.target.value)} /></label>
            <label>
              <span>Project type</span>
              <select style={inputStyle} value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                <option>Film / Drama</option>
                <option>TV / Documentary</option>
                <option>Advertising / Brand Campaign</option>
                <option>Trailer / Promo</option>
                <option>Creator / Online Content</option>
                <option>Custom / Commissioned Work</option>
              </select>
            </label>
            <label><span>Intended usage</span><textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} placeholder="Where will the music be used? Include platform, scene, campaign or pitch context." value={intendedUsage} onChange={(e) => setIntendedUsage(e.target.value)} /></label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
              <label><span>Duration</span><select style={inputStyle} value={duration} onChange={(e) => setDuration(e.target.value)}><option>1 Year</option><option>3 Years</option><option>Perpetual</option></select></label>
              <label><span>Territory</span><select style={inputStyle} value={territory} onChange={(e) => setTerritory(e.target.value)}><option>UK</option><option>EU</option><option>Worldwide</option></select></label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
              <label><span>Paid media?</span><select style={inputStyle} value={paidMedia} onChange={(e) => setPaidMedia(e.target.value)}><option>Unsure</option><option>No</option><option>Yes</option></select></label>
              <label><span>Clearance deadline</span><input style={inputStyle} placeholder="e.g. 2 weeks" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label>
            </div>
            <label><span>Budget range</span><input style={inputStyle} placeholder="e.g. £500–£2,000 / unsure" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} /></label>
            <label style={{ display: "flex", gap: 10, alignItems: "center", color: "#e6dac8" }}><input type="checkbox" checked={exclusive} onChange={(e) => setExclusive(e.target.checked)} />Exclusive licence or limited exclusivity may be required</label>
            <label><span>Message / project notes</span><textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} placeholder="Add anything useful about the creative, project status, music requirement or next step." value={message} onChange={(e) => setMessage(e.target.value)} /></label>
            {error && <p style={{ color: "#ffb4a8", margin: 0 }}>{error}</p>}
            <button type="submit" disabled={submitting} style={{ border: 0, borderRadius: 999, padding: "15px 22px", background: "#f3c56b", color: "#09090b", fontWeight: 900, fontSize: 16, cursor: submitting ? "not-allowed" : "pointer" }}>{submitting ? "Sending..." : "Send Licensing Enquiry"}</button>
            <p style={{ color: "#b9ad9a", lineHeight: 1.6, margin: 0 }}>Submitting an enquiry does not grant usage rights. No rights are granted until a licence is agreed in writing.</p>
          </form>
        </div>
      </section>

      <section style={{ ...section, paddingBottom: 96 }}>
        <div style={shell}>
          <Eyebrow>FAQ</Eyebrow>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", marginTop: 0 }}>Licensing questions, answered before the quote.</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {faqs.map(([question, answer]) => <Card key={question} title={question}>{answer}</Card>)}
          </div>
        </div>
      </section>
    </main>
  );
}
