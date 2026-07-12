import type { FormEvent } from "react";
import { useState } from "react";

const API = "https://dark-voice-ab4b.rapidstillz.workers.dev";

const ASSETS = {
  navWhite: "/brand/conduct-alchemy/logo/svg/ca-logo-nav-white.svg",
  navBlack: "/brand/conduct-alchemy/logo/svg/ca-logo-nav-black.svg",
  motifWhite: "/brand/conduct-alchemy/marks/svg/ca-motif-vector-white.svg",
  motifBlack: "/brand/conduct-alchemy/marks/svg/ca-motif-vector.svg",
};

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

const pillars = [
  ["Curated Excellence", "Handpicked music selected for artistic strength, production quality and creative fit."],
  ["Story-first by Design", "Music shaped to support narrative, emotion and cinematic intention."],
  ["Rights-aware Process", "A considered licensing route built around the intended use, available rights, scope and agreed terms."],
  ["Alchemy of Sound", "We transform search into discovery. Signal into story."],
];

const useCases = [
  ["Film / TV / trailer", "Cinematic music for scenes, trailers, documentaries, promos and screen-led storytelling."],
  ["Brand / advertising", "Distinctive sound for campaigns, launches, paid media and branded films."],
  ["Creator / online", "Music licensing routes for social films, channels, digital content and editorial storytelling."],
  ["Custom / exclusive", "Bespoke edits, stems, exclusivity, category restrictions or commissioned routes where available."],
];

const steps = [
  ["01", "Tell us the use", "Share the project type, scene or campaign, platform, territory, duration, deadline and any paid media plans."],
  ["02", "We review availability", "We review the requested use, deliverables, exclusivity and rights position so the proposed route reflects what is actually available."],
  ["03", "Agree the licence", "Licence scope, approved materials and permitted use are confirmed in writing before any authorised use or publication."],
];

const scopeFactors = ["Project type", "Media", "Territory", "Duration", "Paid media", "Exclusivity", "Deliverables"];

function usageFrom(projectType: string) {
  if (projectType.includes("Advertising")) return "Ads";
  if (projectType.includes("Creator")) return "Social";
  if (projectType.includes("TV")) return "TV";
  if (projectType.includes("Trailer")) return "Trailer";
  if (projectType.includes("Pitch")) return "Pitch";
  return "Film";
}

function ConductAlchemyLogo({ artifactMode, compact = false }: { artifactMode: boolean; compact?: boolean }) {
  return (
    <img
      className={compact ? "ca-logo compact" : "ca-logo"}
      src={artifactMode ? ASSETS.navBlack : ASSETS.navWhite}
      alt="Conduct Alchemy"
    />
  );
}

function Motif({ artifactMode }: { artifactMode: boolean }) {
  return <img className="ca-motif" src={artifactMode ? ASSETS.motifBlack : ASSETS.motifWhite} alt="" aria-hidden="true" />;
}

export default function Licensing() {
  const [artifactMode, setArtifactMode] = useState(false);
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

  return (
    <main className={artifactMode ? "ca-page artifact" : "ca-page dark"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        .ca-page {
          --black:#050505; --charcoal:#1F2120; --slate:#70736F; --warm:#A2A39E;
          --paper:#EDE9E3; --white:#F7F5F0; --amber:#D4A24A;
          min-height:100vh;
          font-family:'IBM Plex Sans', Inter, system-ui, sans-serif;
          transition:background .35s ease,color .35s ease;
        }
        .ca-page.dark {
          --surface:#0b0d0c; --surface-soft:rgba(255,255,255,.04); --line:rgba(247,245,240,.16);
          --copy:#e7e1d6; --muted-copy:#b9b0a2;
          background:radial-gradient(circle at 75% 12%,rgba(212,162,74,.16),transparent 31rem),linear-gradient(135deg,#050505,#111312 58%,#050505);
          color:var(--paper);
        }
        .ca-page.artifact {
          --surface:#f2eee7; --surface-soft:rgba(5,5,5,.035); --line:rgba(5,5,5,.14);
          --copy:#1d1d1b; --muted-copy:#67645f;
          background:linear-gradient(180deg,#F7F5F0,#EDE9E3);
          color:var(--copy);
        }
        .ca-shell{width:min(1160px,calc(100% - 40px));margin:0 auto}
        .ca-header{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:28px 0;border-bottom:1px solid var(--line)}
        .ca-brand{display:flex;align-items:center;color:inherit;text-decoration:none}
        .ca-logo{display:block;width:222px;max-width:42vw;height:auto}
        .ca-logo.compact{width:218px;opacity:.82}
        .ca-nav{display:flex;gap:28px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
        .ca-nav a,.mode-button{color:inherit;text-decoration:none;text-transform:uppercase;letter-spacing:.18em;font-size:11px;font-weight:700;background:none;border:0;cursor:pointer}
        .mode-button{border:1px solid var(--line);padding:12px 16px}
        .mode-button:hover,.btn.secondary:hover{border-color:var(--amber);color:var(--amber)}
        .ca-hero{display:grid;grid-template-columns:minmax(0,1.03fr) minmax(320px,.72fr);gap:52px;align-items:center;padding:68px 0 56px}
        .eyebrow{text-transform:uppercase;letter-spacing:.22em;font-size:12px;color:var(--amber);font-weight:700;margin:0 0 24px}
        h1,h2,h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.025em;color:var(--copy)}
        .dark h1,.dark h2,.dark h3{color:var(--paper)}
        h1{font-size:clamp(4rem,8vw,7.6rem);line-height:.9;margin:0 0 24px;max-width:840px}
        h2{font-size:clamp(2.5rem,4.8vw,4.8rem);line-height:.95;margin:0}
        h3{font-size:28px;line-height:1;margin:0 0 10px}
        .lead{max-width:650px;font-size:18px;line-height:1.75;color:var(--muted-copy)}
        .actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:32px}
        .btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;text-transform:uppercase;letter-spacing:.14em;font-size:12px;font-weight:800;padding:16px 22px;border:1px solid currentColor;color:inherit}
        .btn.primary{background:var(--amber);color:#050505;border-color:var(--amber)}
        .btn.secondary{color:var(--copy);border-color:var(--line);background:transparent}
        .dark .btn.secondary{color:var(--paper)}
        .hero-object{min-height:390px;border:1px solid var(--line);position:relative;overflow:hidden;display:grid;place-items:center;background:var(--surface-soft)}
        .hero-object:before{content:"";position:absolute;inset:15%;border-radius:999px;background:radial-gradient(circle,rgba(212,162,74,.16),transparent 62%);filter:blur(4px)}
        .monolith{width:min(250px,58%);aspect-ratio:1/.86;border:1px solid var(--line);background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(0,0,0,.10));display:grid;place-items:center;box-shadow:0 34px 80px rgba(0,0,0,.25);position:relative}
        .ca-motif{width:92px;height:92px;object-fit:contain;opacity:.9}
        .section{padding:56px 0;border-top:1px solid var(--line)}
        .grid-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--line)}
        .pillar{padding:28px;border-right:1px solid var(--line)}
        .pillar:last-child{border-right:0}
        .pillar p,.case p,.step p,.note,.chip-row{color:var(--muted-copy);line-height:1.62;margin:0}
        .cases{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-top:28px}
        .case{min-height:165px;padding:24px;border:1px solid var(--line);background:var(--surface-soft)}
        .chip-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
        .chip{border:1px solid var(--line);padding:8px 10px;text-transform:uppercase;letter-spacing:.12em;font-size:10px;font-weight:800;color:var(--muted-copy);background:var(--surface-soft)}
        .process-form{display:grid;grid-template-columns:minmax(0,.9fr) minmax(340px,1fr);gap:42px;align-items:start}
        .steps{display:grid;gap:16px;margin-top:28px}
        .step{display:grid;grid-template-columns:54px 1fr;gap:18px;padding:22px 0;border-bottom:1px solid var(--line)}
        .step-num{width:44px;height:44px;border:1px solid currentColor;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:12px;letter-spacing:.08em}
        form{border:1px solid var(--line);padding:30px;background:var(--surface-soft);display:grid;gap:15px}
        label{display:grid;gap:7px;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:700;color:var(--copy)}
        .dark label{color:var(--paper)}
        input,select,textarea{width:100%;box-sizing:border-box;border:1px solid var(--line);background:var(--surface);color:var(--copy);padding:13px 14px;font:inherit;outline:none}
        .dark input,.dark select,.dark textarea{color:var(--paper);background:#171917}
        textarea{min-height:108px;resize:vertical}
        .field-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .checkbox{display:flex;gap:10px;align-items:center;text-transform:none;letter-spacing:0;font-size:13px;color:var(--muted-copy)}
        .checkbox input{width:auto}
        .submit{background:#050505;color:#F7F5F0;border:0;padding:15px 18px;text-transform:uppercase;letter-spacing:.14em;font-weight:800;cursor:pointer}
        .dark .submit{background:var(--amber);color:#050505}
        .rights{border:1px solid var(--line);padding:22px;margin-top:26px}
        .footer{padding:44px 0;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;color:var(--muted-copy)}
        .error{color:#ffb4a8;margin:0}
        @media (max-width:900px){.ca-hero,.process-form{grid-template-columns:1fr}.grid-4,.cases{grid-template-columns:1fr 1fr}.hero-object{min-height:300px}.ca-nav{gap:14px}.field-grid{grid-template-columns:1fr}}
        @media (max-width:600px){.grid-4,.cases{grid-template-columns:1fr}.ca-header{align-items:flex-start;flex-direction:column}.ca-nav{justify-content:flex-start;gap:10px 14px;width:100%}.ca-nav a{display:inline-flex}.mode-button{padding:10px 12px}h1{font-size:3.5rem}.ca-shell{width:min(100% - 28px,1160px)}.ca-logo{width:185px;max-width:58vw}.step{grid-template-columns:1fr}.step-num{margin-bottom:4px}}
      `}</style>

      <div className="ca-shell">
        <header className="ca-header">
          <a className="ca-brand" href="/"><ConductAlchemyLogo artifactMode={artifactMode} /></a>
          <nav className="ca-nav" aria-label="Primary navigation">
            <a href="#use-cases">Routes</a>
            <a href="#clearance">Process</a>
            <a href="#request">Brief</a>
            <a href="/licensing">Licensing</a>
            <button className="mode-button" type="button" onClick={() => setArtifactMode((value) => !value)}>
              {artifactMode ? "Exit Artifact" : "View as Artifact"}
            </button>
          </nav>
        </header>

        {submitted ? (
          <section className="ca-hero">
            <div>
              <p className="eyebrow">Conduct Alchemy Licensing</p>
              <h1>Clearance request received.</h1>
              <p className="lead">Thank you. We’ll review the project context, intended use, rights position and available licensing route before responding with the most suitable next step.</p>
            </div>
            <div className="hero-object"><div className="monolith"><Motif artifactMode={artifactMode} /></div></div>
          </section>
        ) : (
          <>
            <section className="ca-hero">
              <div>
                <p className="eyebrow">Curated music for story & brand</p>
                <h1>Exceptional music. Thoughtful licensing. Confident creativity.</h1>
                <p className="lead">Conduct Alchemy creates and curates distinctive music for storytellers, filmmakers, brands and creators — with commercial licensing routes shaped around each project’s intended use and the rights available.</p>
                <div className="actions">
                  <a className="btn primary" href="#request">Start a clearance request</a>
                  <a className="btn secondary" href="#clearance">See how clearance works</a>
                </div>
              </div>
              <div className="hero-object" aria-label="Conduct Alchemy brand artifact">
                <div className="monolith"><Motif artifactMode={artifactMode} /></div>
              </div>
            </section>

            <section className="section">
              <div className="grid-4">
                {pillars.map(([title, copy]) => (
                  <article className="pillar" key={title}><h3>{title}</h3><p>{copy}</p></article>
                ))}
              </div>
            </section>

            <section id="use-cases" className="section">
              <p className="eyebrow">Choose your licensing route</p>
              <h2>Licensing routes for screen, campaigns and creative work.</h2>
              <p className="lead">Start with the way the music will live. We then review the details that shape availability, the proposed licence, pricing and delivery.</p>
              <div className="cases">
                {useCases.map(([title, copy]) => (
                  <article className="case" key={title}><h3>{title}</h3><p>{copy}</p></article>
                ))}
              </div>
              <div className="chip-row" aria-label="Licence scope factors">
                {scopeFactors.map((factor) => <span className="chip" key={factor}>{factor}</span>)}
              </div>
            </section>

            <section id="clearance" className="section process-form">
              <div>
                <p className="eyebrow">Licensing & project scope</p>
                <h2>A clear route from project brief to agreed terms.</h2>
                <p className="lead">Tell us where the music will live. We’ll review the request, confirm what is available and respond with the most suitable route for the project.</p>
                <div className="steps">
                  {steps.map(([num, title, copy]) => (
                    <article className="step" key={num}>
                      <div className="step-num">{num}</div>
                      <div><h3>{title}</h3><p>{copy}</p></div>
                    </article>
                  ))}
                </div>
                <div className="rights">
                  <p className="eyebrow">Rights note</p>
                  <p className="note">Submitting an enquiry does not grant permission to use any music. Availability and the rights Conduct Alchemy can license are confirmed case by case; some uses may require additional third-party approval. Any permitted use begins only after the applicable licence terms have been agreed and confirmed in writing.</p>
                </div>
              </div>

              <form id="request" onSubmit={handleSubmit}>
                <label>Name *<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
                <label>Email *<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@company.com" /></label>
                <label>Company / production<input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company, agency, studio or production" /></label>
                <label>Track / mood of interest<input value={trackInterest} onChange={(event) => setTrackInterest(event.target.value)} placeholder="Track name, reference, mood or scene" /></label>
                <label>Project type<select value={projectType} onChange={(event) => setProjectType(event.target.value)}>{projectTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
                <div className="field-grid">
                  <label>Territory<select value={territory} onChange={(event) => setTerritory(event.target.value)}>{territories.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label>Duration<select value={duration} onChange={(event) => setDuration(event.target.value)}>{durations.map((item) => <option key={item}>{item}</option>)}</select></label>
                </div>
                <div className="field-grid">
                  <label>Paid media<select value={paidMedia} onChange={(event) => setPaidMedia(event.target.value)}>{paidMediaOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label>Deadline<input value={deadline} onChange={(event) => setDeadline(event.target.value)} placeholder="e.g. 2 weeks / date" /></label>
                </div>
                <label>Budget range, if known<input value={budgetRange} onChange={(event) => setBudgetRange(event.target.value)} placeholder="Optional / to be discussed" /></label>
                <label>Intended use<textarea value={intendedUsage} onChange={(event) => setIntendedUsage(event.target.value)} placeholder="Tell us about the scene, campaign, platform, paid media, audience, edit length or pitch context." /></label>
                <label className="checkbox"><input type="checkbox" checked={exclusive} onChange={(event) => setExclusive(event.target.checked)} />Exclusivity or category restriction may be required</label>
                {error && <p className="error">{error}</p>}
                <button className="submit" disabled={submitting} type="submit">{submitting ? "Sending..." : "Submit project brief"}</button>
                <p className="note">Pricing, availability and licensable rights are confirmed after review. No licence or usage permission is granted until the applicable terms are agreed in writing.</p>
              </form>
            </section>
          </>
        )}

        <footer className="footer">
          <a className="ca-brand" href="/"><ConductAlchemyLogo artifactMode={artifactMode} compact /></a>
          <div>Curated. Considered. Project-ready.</div>
          <div>Made for storytellers.</div>
        </footer>
      </div>
    </main>
  );
}
