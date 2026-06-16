import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";

const API = "https://dark-voice-ab4b.rapidstillz.workers.dev";

const projectTypes = [
  "Film / Drama",
  "TV / Documentary",
  "Trailer / Promo",
  "Advertising / Brand Campaign",
  "Creator / Online Content",
  "Pitch / Internal Development",
  "Custom / Commissioned Work",
];

const territories = ["UK", "Europe", "Worldwide", "To be confirmed"];
const durations = ["Campaign period", "1 Year", "3 Years", "Perpetual / archive", "To be confirmed"];
const paidMediaOptions = ["No / organic only", "Yes / paid media planned", "Unsure / to be confirmed"];

const routes = [
  ["Creator / online", "For YouTube, editorial video, reels and social content where the use is public but simple.", "Best for clear non-exclusive digital use."],
  ["Brand / advertising", "For brand films, launches, paid social, digital advertising and agency campaign work.", "Scoped by platform, territory, campaign term and paid media."],
  ["Film / TV / trailer", "For scenes, titles, promos, documentaries, scripted projects, trailers, broadcast, VOD and festival use.", "Scoped by media, territory, duration, release plan and versions needed."],
  ["Custom / exclusive", "For bespoke edits, alternate lyrics, picture-specific versions, category restrictions or exclusivity.", "Handled as a direct creative and commercial conversation."],
];

const steps = [
  ["01", "Tell us the use", "Share the project type, scene or campaign, platform, territory, duration and deadline.", "We identify the likely licence route."],
  ["02", "We scope the route", "We review usage, rights, paid media, deliverables and whether exclusivity is relevant.", "You get the right path instead of vague pricing."],
  ["03", "Agree terms first", "Licence scope is confirmed in writing before final masters, edits or stems are released.", "Clear permission and safe delivery."],
];

const deliverables = [
  "Full vocal master",
  "Instrumental version",
  "15s / 30s / 60s edits",
  "Trailer cutdowns",
  "Loopable sections",
  "Lyric-light versions",
  "Alternative mixes",
  "Bespoke rework for picture",
  "Usage letter / licence confirmation",
];

const faqs = [
  ["Can I use a track before terms are agreed?", "No. An enquiry or preview does not grant usage rights. Permission starts only when licence terms are confirmed in writing."],
  ["Why is there no fixed price list?", "Music value changes by project type, media, territory, term, campaign size, paid media, exclusivity and deliverables."],
  ["Can I request an instrumental or custom edit?", "Yes. Instrumentals, cutdowns, lyric-light versions and bespoke edits may be available after the intended use has been reviewed."],
  ["Can this support pitches or early development?", "Yes. Tell us whether the use is internal, pitch-stage, public, paid, broadcast or client-facing so the right access route can be advised."],
];

const page: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 12% 0%, rgba(190,145,70,.22), transparent 34rem), radial-gradient(circle at 86% 30%, rgba(116,70,31,.18), transparent 30rem), linear-gradient(145deg,#050403 0%,#0b0706 44%,#120d0b 100%)",
  color: "#f6ead8",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const shell: CSSProperties = { width: "min(1160px, calc(100% - 32px))", margin: "0 auto" };
const card: CSSProperties = {
  background: "linear-gradient(150deg, rgba(255,244,224,.09), rgba(255,255,255,.032))",
  border: "1px solid rgba(231,184,105,.2)",
  borderRadius: 24,
  boxShadow: "0 28px 90px rgba(0,0,0,.34)",
};
const panel: CSSProperties = { background: "rgba(255,244,224,.055)", border: "1px solid rgba(231,184,105,.14)", borderRadius: 20 };
const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(231,184,105,.22)",
  borderRadius: 14,
  padding: "13px 14px",
  background: "rgba(3,3,4,.72)",
  color: "#fff7ec",
  fontSize: 14,
  outline: "none",
};
const labelStyle: CSSProperties = { display: "grid", gap: 7, color: "#e8d9c2", fontSize: 13, fontWeight: 750 };
const pill: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  border: "1px solid rgba(231,184,105,.22)",
  background: "rgba(232,189,114,.08)",
  color: "#f2d69f",
  padding: "8px 11px",
  fontSize: 12,
  fontWeight: 850,
};

function Eyebrow({ children }: { children: string }) {
  return <p style={{ color: "#d9aa58", letterSpacing: 2.35, textTransform: "uppercase", fontSize: 11, fontWeight: 900, margin: 0 }}>{children}</p>;
}

function usageFrom(projectType: string) {
  if (projectType.includes("Advertising")) return "Ads";
  if (projectType.includes("Creator")) return "Social";
  if (projectType.includes("TV")) return "TV";
  if (projectType.includes("Trailer")) return "Trailer";
  if (projectType.includes("Pitch")) return "Pitch";
  return "Film";
}

export default function Licensing() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [trackInterest, setTrackInterest] = useState("");
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [intendedUsage, setIntendedUsage] = useState("");
  const [duration, setDuration] = useState(durations[0]);
  const [territory, setTerritory] = useState(territories[0]);
  const [paidMedia, setPaidMedia] = useState(paidMediaOptions[2]);
  const [deadline, setDeadline] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [exclusive, setExclusive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
          usage: usageFrom(projectType),
          projectType,
          intendedUsage,
          duration,
          territory,
          paidMedia,
          deadline,
          budgetRange,
          value: budgetRange,
          message: intendedUsage,
          exclusive,
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
        <div style={{ ...shell, padding: "88px 0" }}>
          <div style={{ ...card, padding: "clamp(28px,6vw,56px)" }}>
            <Eyebrow>Conduct Alchemy Licensing</Eyebrow>
            <h1 style={{ margin: "14px 0", fontSize: "clamp(2.4rem,7vw,5rem)", lineHeight: .96, letterSpacing: "-.06em" }}>Clearance request received.</h1>
            <p style={{ maxWidth: 720, color: "#decfb8", fontSize: 18, lineHeight: 1.7 }}>Thank you. We’ll review the project context, intended use and clearance route before responding with the most suitable next step.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <section style={{ padding: "28px 0 34px" }}>
        <div style={shell}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div aria-hidden="true" style={{ width: 42, height: 42, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid rgba(231,184,105,.46)", color: "#e8bd72", fontWeight: 950, background: "rgba(232,189,114,.08)" }}>CA</div>
              <div><div style={{ color: "#f4e4ca", fontWeight: 900 }}>Conduct Alchemy</div><div style={{ color: "#a8987f", fontSize: 12 }}>Music licensing & clearance</div></div>
            </div>
            <a href="#clearance-request" style={{ color: "#0b0705", background: "#e8bd72", padding: "11px 16px", borderRadius: 999, fontWeight: 950, textDecoration: "none", fontSize: 13 }}>Request clearance</a>
          </div>

          <div style={{ ...card, padding: "clamp(30px,7vw,76px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "auto -10% -42% auto", width: 380, height: 380, borderRadius: "50%", background: "rgba(232,189,114,.12)", filter: "blur(10px)" }} />
            <div style={{ position: "relative", maxWidth: 930 }}>
              <Eyebrow>Conduct Alchemy Licensing</Eyebrow>
              <h1 style={{ margin: "16px 0", fontSize: "clamp(3rem,8vw,6.45rem)", lineHeight: .92, letterSpacing: "-.075em" }}>Music clearance for cinematic stories and brand worlds.</h1>
              <p style={{ maxWidth: 750, color: "#e2d2ba", fontSize: "clamp(1.04rem,2vw,1.28rem)", lineHeight: 1.68 }}>Original Conduct Alchemy compositions can be reviewed for film, television, trailers, advertising, creator content and pitch work — with the licence scoped to the way the music will actually be used.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>{["Sync", "Advertising", "Trailers", "Creators", "Custom edits"].map((item) => <span key={item} style={pill}>{item}</span>)}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
                <a href="#clearance-request" style={{ color: "#0b0705", background: "#e8bd72", padding: "14px 18px", borderRadius: 999, fontWeight: 950, textDecoration: "none" }}>Start a clearance request</a>
                <a href="#process" style={{ color: "#f7ead5", border: "1px solid rgba(231,184,105,.28)", padding: "14px 18px", borderRadius: 999, fontWeight: 850, textDecoration: "none" }}>See how clearance works</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" style={{ padding: "30px 0" }}>
        <div style={shell}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: 22, alignItems: "start" }}>
            <div>
              <Eyebrow>How clearance works</Eyebrow>
              <h2 style={{ margin: "12px 0", fontSize: "clamp(2rem,4vw,3.5rem)", lineHeight: .98, letterSpacing: "-.055em" }}>Three clear steps. No mystery pricing.</h2>
              <p style={{ color: "#cfc0aa", lineHeight: 1.7, fontSize: 16, margin: 0 }}>Pick the closest use case, share the project details, and we’ll scope the licence around the things that actually change the fee: media, territory, duration, paid exposure, exclusivity and deliverables.</p>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {steps.map(([num, title, action, outcome]) => (
                <article key={num} style={{ ...card, padding: 20, display: "grid", gridTemplateColumns: "54px minmax(0,1fr)", gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", display: "grid", placeItems: "center", color: "#0b0705", background: "#e8bd72", fontWeight: 950 }}>{num}</div>
                  <div><h3 style={{ margin: "0 0 6px", fontSize: 22 }}>{title}</h3><p style={{ margin: 0, color: "#dfcfb6", lineHeight: 1.58 }}>{action}</p><p style={{ margin: "10px 0 0", color: "#a8987f", lineHeight: 1.55, fontSize: 13 }}>Outcome: {outcome}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "34px 0" }}>
        <div style={shell}>
          <Eyebrow>Choose the closest route</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 14, marginTop: 16 }}>
            {routes.map(([title, copy, meta]) => <article key={title} style={{ ...card, padding: 22 }}><h3 style={{ margin: "0 0 8px", fontSize: 24 }}>{title}</h3><p style={{ color: "#cfc0aa", lineHeight: 1.62, margin: 0 }}>{copy}</p><p style={{ color: "#a8987f", lineHeight: 1.55, margin: "12px 0 0", fontSize: 13 }}>{meta}</p></article>)}
          </div>
        </div>
      </section>

      <section id="clearance-request" style={{ padding: "44px 0 76px" }}>
        <div style={{ ...shell, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,360px),1fr))", gap: 28, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 24 }}>
            <Eyebrow>Project intake</Eyebrow>
            <h2 style={{ fontSize: "clamp(2.1rem,5vw,4.3rem)", lineHeight: .98, letterSpacing: "-.055em", margin: "12px 0" }}>Request the right clearance path.</h2>
            <p style={{ color: "#d8c8ae", fontSize: 17, lineHeight: 1.7, maxWidth: 540 }}>Tell us where the music will live. We’ll review the intended use and respond with the most suitable route, whether that is creator use, commercial campaign, sync, pitch access or bespoke work.</p>
            <div style={{ ...card, padding: 18, marginTop: 22 }}><h3 style={{ margin: "0 0 12px", fontSize: 20 }}>Available on request</h3><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{deliverables.map((item) => <span key={item} style={pill}>{item}</span>)}</div></div>
            <div style={{ ...panel, padding: 18, marginTop: 12 }}><h3 style={{ margin: "0 0 8px", fontSize: 18 }}>Rights note</h3><p style={{ color: "#cfc0aa", lineHeight: 1.65, margin: 0 }}>Submitting an enquiry does not grant usage rights. No rights are granted until licence terms are confirmed in writing.</p></div>
          </div>

          <form onSubmit={handleSubmit} style={{ ...card, padding: "clamp(22px,4vw,34px)", display: "grid", gap: 15 }}>
            <div><Eyebrow>Clearance brief</Eyebrow><h2 style={{ margin: "8px 0 4px", fontSize: 28 }}>Send the project details</h2><p style={{ margin: 0, color: "#a8987f", lineHeight: 1.55, fontSize: 13 }}>Required fields are kept light. More detail helps us avoid the wrong licence route.</p></div>
            <label style={labelStyle}>Name *<input style={inputStyle} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label style={labelStyle}>Email *<input style={inputStyle} placeholder="you@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label style={labelStyle}>Company / production<input style={inputStyle} placeholder="Company, agency, studio or production" value={company} onChange={(e) => setCompany(e.target.value)} /></label>
            <label style={labelStyle}>Track, scene or mood<input style={inputStyle} placeholder="Track name, reference, mood or scene" value={trackInterest} onChange={(e) => setTrackInterest(e.target.value)} /></label>
            <label style={labelStyle}>Project type<select style={inputStyle} value={projectType} onChange={(e) => setProjectType(e.target.value)}>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12 }}><label style={labelStyle}>Territory<select style={inputStyle} value={territory} onChange={(e) => setTerritory(e.target.value)}>{territories.map((item) => <option key={item}>{item}</option>)}</select></label><label style={labelStyle}>Duration<select style={inputStyle} value={duration} onChange={(e) => setDuration(e.target.value)}>{durations.map((item) => <option key={item}>{item}</option>)}</select></label></div>
            <label style={labelStyle}>Paid media / campaign spend<select style={inputStyle} value={paidMedia} onChange={(e) => setPaidMedia(e.target.value)}>{paidMediaOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12 }}><label style={labelStyle}>Clearance deadline<input style={inputStyle} placeholder="e.g. 2 weeks / date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label><label style={labelStyle}>Budget range, if known<input style={inputStyle} placeholder="Optional / to be discussed" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} /></label></div>
            <label style={labelStyle}>Intended use<textarea style={{ ...inputStyle, minHeight: 118, resize: "vertical" }} placeholder="Tell us about the scene, campaign, platform, audience, edit length, paid media or pitch context." value={intendedUsage} onChange={(e) => setIntendedUsage(e.target.value)} /></label>
            <label style={{ display: "flex", gap: 10, alignItems: "center", color: "#e6d4b8", fontSize: 13, lineHeight: 1.5 }}><input type="checkbox" checked={exclusive} onChange={(e) => setExclusive(e.target.checked)} />Exclusivity, category restriction or protected project access may be required</label>
            {error && <p style={{ color: "#ffb4a8", margin: 0 }}>{error}</p>}
            <button type="submit" disabled={submitting} style={{ border: 0, borderRadius: 999, padding: "15px 22px", background: "#e8bd72", color: "#0b0705", fontWeight: 950, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer" }}>{submitting ? "Sending..." : "Send clearance request"}</button>
            <p style={{ color: "#a8987f", lineHeight: 1.55, margin: 0, fontSize: 12 }}>No licence or usage permission is granted until confirmed in writing.</p>
          </form>
        </div>
      </section>

      <section style={{ padding: "0 0 84px" }}>
        <div style={shell}>
          <Eyebrow>Common questions</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 14, marginTop: 16 }}>{faqs.map(([title, copy]) => <article key={title} style={{ ...panel, padding: 20 }}><h3 style={{ margin: "0 0 8px", fontSize: 18 }}>{title}</h3><p style={{ margin: 0, color: "#cfc0aa", lineHeight: 1.62 }}>{copy}</p></article>)}</div>
        </div>
      </section>
    </main>
  );
}
