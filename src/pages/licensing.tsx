import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";

const API = "https://dark-voice-ab4b.rapidstillz.workers.dev";

type Capability = {
  title: string;
  copy: string;
};

const capabilities: Capability[] = [
  {
    title: "Sync & screen use",
    copy: "Film, documentary, trailers, title sequences, promos and emotional scene work.",
  },
  {
    title: "Brand & campaign use",
    copy: "Music clearance for brand films, social campaigns, launches and digital advertising.",
  },
  {
    title: "Versions on request",
    copy: "Instrumentals, clean edits, cutdowns, lyric-light versions and bespoke edits may be available after review.",
  },
];

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

const page: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 12% 0%, rgba(190, 145, 70, 0.24), transparent 34rem), radial-gradient(circle at 82% 28%, rgba(116, 70, 31, 0.18), transparent 30rem), linear-gradient(145deg, #050403 0%, #0c0707 42%, #120d0b 100%)",
  color: "#f6ead8",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const shell: CSSProperties = {
  width: "min(1120px, calc(100% - 32px))",
  margin: "0 auto",
};

const card: CSSProperties = {
  background: "linear-gradient(150deg, rgba(255, 244, 224, 0.09), rgba(255, 255, 255, 0.035))",
  border: "1px solid rgba(231, 184, 105, 0.18)",
  borderRadius: 24,
  boxShadow: "0 28px 90px rgba(0, 0, 0, 0.32)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(231, 184, 105, 0.2)",
  borderRadius: 14,
  padding: "13px 14px",
  background: "rgba(3, 3, 4, 0.72)",
  color: "#fff7ec",
  fontSize: 14,
  outline: "none",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  color: "#e8d9c2",
  fontSize: 13,
};

function Eyebrow({ children }: { children: string }) {
  return (
    <p
      style={{
        color: "#d9aa58",
        letterSpacing: 2.2,
        textTransform: "uppercase",
        fontSize: 11,
        fontWeight: 800,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

function getUsage(projectType: string) {
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
          usage: getUsage(projectType),
          projectType,
          intendedUsage,
          duration,
          territory,
          paidMedia: "To be confirmed",
          deadline,
          budgetRange,
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
          <div style={{ ...card, padding: "clamp(28px, 6vw, 56px)" }}>
            <Eyebrow>Conduct Alchemy Licensing</Eyebrow>
            <h1 style={{ margin: "14px 0", fontSize: "clamp(2.4rem, 7vw, 5rem)", lineHeight: 0.96, letterSpacing: "-0.06em" }}>
              Clearance request received.
            </h1>
            <p style={{ maxWidth: 680, color: "#decfb8", fontSize: 18, lineHeight: 1.7 }}>
              Thank you. We’ll review the project context, intended use and clearance route before responding with the most suitable next step.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <section style={{ padding: "28px 0 42px" }}>
        <div style={shell}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 34 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                aria-hidden="true"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(231,184,105,0.42)",
                  color: "#e8bd72",
                  fontWeight: 900,
                  letterSpacing: -1,
                }}
              >
                CA
              </div>
              <div>
                <div style={{ color: "#f4e4ca", fontWeight: 800, letterSpacing: 0.5 }}>Conduct Alchemy</div>
                <div style={{ color: "#a8987f", fontSize: 12 }}>Music licensing & clearance</div>
              </div>
            </div>
            <a href="#clearance-request" style={{ color: "#0b0705", background: "#e8bd72", padding: "11px 16px", borderRadius: 999, fontWeight: 900, textDecoration: "none", fontSize: 13 }}>
              Request clearance
            </a>
          </div>

          <div style={{ ...card, padding: "clamp(30px, 7vw, 76px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "auto -12% -44% auto", width: 360, height: 360, borderRadius: "50%", background: "rgba(232,189,114,0.1)", filter: "blur(8px)" }} />
            <div style={{ position: "relative", maxWidth: 880 }}>
              <Eyebrow>Conduct Alchemy Licensing</Eyebrow>
              <h1 style={{ margin: "16px 0", fontSize: "clamp(3rem, 8vw, 6.8rem)", lineHeight: 0.92, letterSpacing: "-0.075em" }}>
                Music clearance for cinematic stories, brands and screen-led campaigns.
              </h1>
              <p style={{ maxWidth: 700, color: "#e2d2ba", fontSize: "clamp(1.04rem, 2vw, 1.32rem)", lineHeight: 1.7 }}>
                Original Conduct Alchemy compositions for film, television, trailers, brand campaigns and digital content — reviewed, scoped and cleared by project.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
                <a href="#clearance-request" style={{ color: "#0b0705", background: "#e8bd72", padding: "14px 18px", borderRadius: 999, fontWeight: 900, textDecoration: "none" }}>
                  Start a clearance request
                </a>
                <a href="#process" style={{ color: "#f7ead5", border: "1px solid rgba(231,184,105,0.28)", padding: "14px 18px", borderRadius: 999, fontWeight: 800, textDecoration: "none" }}>
                  How it works
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" style={{ padding: "34px 0" }}>
        <div style={shell}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              ["01", "Send the project context", "Tell us where the music will live: scene, campaign, platform, territory, timing and deadline."],
              ["02", "We scope the clearance", "We identify the right licensing route, usage terms, deliverables and whether exclusivity is relevant."],
              ["03", "Terms before delivery", "No usage rights are granted until the licence is agreed in writing and final files are released."],
            ].map(([step, title, copy]) => (
              <article key={step} style={{ ...card, padding: 22 }}>
                <Eyebrow>{step}</Eyebrow>
                <h3 style={{ margin: "10px 0 8px", fontSize: 22 }}>{title}</h3>
                <p style={{ margin: 0, color: "#cfc0aa", lineHeight: 1.62 }}>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "34px 0" }}>
        <div style={shell}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {capabilities.map((item) => (
              <article key={item.title} style={{ ...card, padding: 22 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>{item.title}</h3>
                <p style={{ color: "#cfc0aa", lineHeight: 1.62, margin: 0 }}>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="clearance-request" style={{ padding: "40px 0 76px" }}>
        <div style={{ ...shell, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 24, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 24 }}>
            <Eyebrow>Project intake</Eyebrow>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 4.3rem)", lineHeight: 0.98, letterSpacing: "-0.055em", margin: "12px 0" }}>
              Request music clearance.
            </h2>
            <p style={{ color: "#d8c8ae", fontSize: 17, lineHeight: 1.7, maxWidth: 520 }}>
              Share enough detail for a professional rights review. Pricing is not fixed publicly; it is scoped to usage, territory, duration, media, exclusivity and deliverables.
            </p>
            <details style={{ ...card, padding: 18, marginTop: 22 }}>
              <summary style={{ cursor: "pointer", color: "#e8bd72", fontWeight: 900 }}>Available on request</summary>
              <p style={{ color: "#cfc0aa", lineHeight: 1.65 }}>
                Instrumentals, cutdowns, lyric-light versions, alternate mixes, trailer edits and bespoke reworks may be available after the project and rights route have been reviewed.
              </p>
            </details>
            <details style={{ ...card, padding: 18, marginTop: 12 }}>
              <summary style={{ cursor: "pointer", color: "#e8bd72", fontWeight: 900 }}>Rights note</summary>
              <p style={{ color: "#cfc0aa", lineHeight: 1.65 }}>
                Submitting an enquiry does not grant usage rights. No rights are granted until licence terms are confirmed in writing.
              </p>
            </details>
          </div>

          <form onSubmit={handleSubmit} style={{ ...card, padding: "clamp(22px, 4vw, 34px)", display: "grid", gap: 15 }}>
            <label style={labelStyle}>
              Name *
              <input style={inputStyle} placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label style={labelStyle}>
              Email *
              <input style={inputStyle} placeholder="you@company.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label style={labelStyle}>
              Company / production
              <input style={inputStyle} placeholder="Company, agency, studio or production" value={company} onChange={(event) => setCompany(event.target.value)} />
            </label>
            <label style={labelStyle}>
              Track / mood of interest
              <input style={inputStyle} placeholder="Track name, reference, mood or scene" value={trackInterest} onChange={(event) => setTrackInterest(event.target.value)} />
            </label>
            <label style={labelStyle}>
              Project type
              <select style={inputStyle} value={projectType} onChange={(event) => setProjectType(event.target.value)}>
                {projectTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              <label style={labelStyle}>
                Territory
                <select style={inputStyle} value={territory} onChange={(event) => setTerritory(event.target.value)}>
                  {territories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label style={labelStyle}>
                Duration
                <select style={inputStyle} value={duration} onChange={(event) => setDuration(event.target.value)}>
                  {durations.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              <label style={labelStyle}>
                Clearance deadline
                <input style={inputStyle} placeholder="e.g. 2 weeks / date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
              </label>
              <label style={labelStyle}>
                Budget range, if known
                <input style={inputStyle} placeholder="Optional / to be discussed" value={budgetRange} onChange={(event) => setBudgetRange(event.target.value)} />
              </label>
            </div>
            <label style={labelStyle}>
              Intended use
              <textarea
                style={{ ...inputStyle, minHeight: 116, resize: "vertical" }}
                placeholder="Tell us about the scene, campaign, platform, paid media, audience, edit length or pitch context."
                value={intendedUsage}
                onChange={(event) => setIntendedUsage(event.target.value)}
              />
            </label>
            <label style={{ display: "flex", gap: 10, alignItems: "center", color: "#e6d4b8", fontSize: 13 }}>
              <input type="checkbox" checked={exclusive} onChange={(event) => setExclusive(event.target.checked)} />
              Exclusivity or category restriction may be required
            </label>
            {error && <p style={{ color: "#ffb4a8", margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              style={{
                border: 0,
                borderRadius: 999,
                padding: "15px 22px",
                background: "#e8bd72",
                color: "#0b0705",
                fontWeight: 950,
                fontSize: 15,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Sending..." : "Send clearance request"}
            </button>
            <p style={{ color: "#a8987f", lineHeight: 1.55, margin: 0, fontSize: 12 }}>
              No licence or usage permission is granted until confirmed in writing.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
