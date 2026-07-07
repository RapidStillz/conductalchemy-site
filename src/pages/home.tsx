import { useState } from "react";
import { Link } from "react-router-dom";

const ASSETS = {
  navWhite: "/brand/conduct-alchemy/logo/svg/ca-logo-nav-white.svg",
  navBlack: "/brand/conduct-alchemy/logo/svg/ca-logo-nav-black.svg",
  motifWhite: "/brand/conduct-alchemy/marks/svg/ca-motif-vector-white.svg",
  motifBlack: "/brand/conduct-alchemy/marks/svg/ca-motif-vector.svg",
};

const pillars = [
  ["Curated Excellence", "Handpicked music chosen for artistic and production quality."],
  ["Story-first by Design", "Sound selected to deepen emotion, narrative and cinematic intention."],
  ["Clearance Confidence", "Rights-aware licensing with clear scope, terms and delivery."],
  ["Alchemy of Sound", "A more considered path from search to discovery, signal to story."],
];

const worlds = [
  ["Narrative", "Film, drama, documentary and story-led visual work."],
  ["Brand", "Campaigns, launch films and distinctive commercial storytelling."],
  ["Motion", "Trailers, promos, digital films and creator-led visual culture."],
];

const routes = [
  ["Film / TV / Trailer", "Story-led clearance for productions, documentary, promo and picture."],
  ["Brand / Campaign", "Usage scoped around media, territory, term, paid support and deliverables."],
  ["Creator / Online", "Practical licensing routes for digital-first and social storytelling."],
  ["Custom / Exclusive", "Bespoke edits, exclusive use and commissioned creative conversations."],
];

export default function Home() {
  const [artifactMode, setArtifactMode] = useState(false);

  return (
    <main className={artifactMode ? "ca-home artifact" : "ca-home dark"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

        .ca-home {
          --black:#050505;
          --charcoal:#1F2120;
          --slate:#70736F;
          --warm:#A2A39E;
          --paper:#EDE9E3;
          --white:#F7F5F0;
          --amber:#D4A24A;
          min-height:100vh;
          font-family:'IBM Plex Sans', Inter, system-ui, sans-serif;
          transition:background .35s ease,color .35s ease;
        }

        .ca-home.dark {
          --surface:#0B0D0C;
          --surface-soft:rgba(255,255,255,.045);
          --line:rgba(247,245,240,.16);
          --copy:#F0EAE0;
          --muted:#B9B0A2;
          background:
            radial-gradient(circle at 78% 11%,rgba(212,162,74,.14),transparent 29rem),
            linear-gradient(135deg,#050505,#111312 58%,#050505);
          color:var(--copy);
        }

        .ca-home.artifact {
          --surface:#F2EEE7;
          --surface-soft:rgba(5,5,5,.035);
          --line:rgba(5,5,5,.14);
          --copy:#1D1D1B;
          --muted:#67645F;
          background:linear-gradient(180deg,#F7F5F0,#EDE9E3);
          color:var(--copy);
        }

        .home-shell { width:min(1180px,calc(100% - 40px)); margin:0 auto; }
        .home-header { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:28px 0; border-bottom:1px solid var(--line); }
        .home-brand { display:flex; align-items:center; text-decoration:none; }
        .home-logo { display:block; width:224px; max-width:44vw; height:auto; }
        .home-nav { display:flex; gap:24px; align-items:center; justify-content:flex-end; flex-wrap:wrap; }
        .home-nav a,.artifact-toggle { color:inherit; text-decoration:none; text-transform:uppercase; letter-spacing:.17em; font-size:10px; font-weight:700; }
        .artifact-toggle { border:1px solid var(--line); padding:11px 14px; background:transparent; cursor:pointer; }
        .home-nav a:hover,.artifact-toggle:hover { color:var(--amber); border-color:var(--amber); }

        .home-hero { display:grid; grid-template-columns:minmax(0,1.08fr) minmax(300px,.72fr); gap:58px; align-items:center; padding:82px 0 72px; }
        .eyebrow { margin:0 0 22px; text-transform:uppercase; letter-spacing:.22em; font-size:11px; font-weight:700; color:var(--amber); }
        .home-hero h1,.home-section h2,.world-card h3,.route-card h3,.principle h3 { font-family:'Cormorant Garamond',Georgia,serif; font-weight:500; letter-spacing:-.028em; margin:0; color:var(--copy); }
        .dark .home-hero h1,.dark .home-section h2,.dark .world-card h3,.dark .route-card h3,.dark .principle h3 { color:var(--paper); }
        .home-hero h1 { font-size:clamp(4.2rem,8.6vw,8.4rem); line-height:.86; max-width:900px; }
        .hero-lead { max-width:680px; margin:28px 0 0; font-size:18px; line-height:1.72; color:var(--muted); }
        .hero-actions { display:flex; gap:14px; flex-wrap:wrap; margin-top:34px; }
        .home-btn { display:inline-flex; align-items:center; justify-content:center; padding:15px 20px; border:1px solid var(--line); text-transform:uppercase; letter-spacing:.14em; font-size:11px; font-weight:800; text-decoration:none; color:inherit; }
        .home-btn.primary { background:var(--amber); border-color:var(--amber); color:#050505; }
        .home-btn.secondary:hover { border-color:var(--amber); color:var(--amber); }

        .hero-artifact { min-height:430px; border:1px solid var(--line); position:relative; overflow:hidden; display:grid; place-items:center; background:var(--surface-soft); }
        .hero-artifact:before { content:""; position:absolute; inset:13%; border-radius:999px; background:radial-gradient(circle,rgba(212,162,74,.18),transparent 63%); filter:blur(5px); }
        .artifact-object { width:min(285px,65%); aspect-ratio:.82/1; border:1px solid var(--line); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:26px; background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(0,0,0,.09)); box-shadow:0 36px 90px rgba(0,0,0,.28); position:relative; }
        .artifact-object img { width:94px; height:94px; object-fit:contain; }
        .artifact-label { text-transform:uppercase; letter-spacing:.21em; font-size:10px; font-weight:700; color:var(--muted); }

        .signal-strip { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border:1px solid var(--line); margin-bottom:72px; }
        .signal { padding:26px; border-right:1px solid var(--line); }
        .signal:last-child { border-right:0; }
        .signal strong { display:block; text-transform:uppercase; letter-spacing:.14em; font-size:10px; margin-bottom:10px; }
        .signal p { margin:0; color:var(--muted); line-height:1.55; font-size:14px; }

        .home-section { padding:72px 0; border-top:1px solid var(--line); }
        .section-kicker { text-transform:uppercase; letter-spacing:.2em; font-size:10px; font-weight:700; color:var(--amber); }
        .home-section h2 { font-size:clamp(3rem,6vw,6.4rem); line-height:.92; max-width:900px; margin-top:18px; }
        .section-copy { max-width:700px; color:var(--muted); line-height:1.75; font-size:17px; margin:24px 0 0; }

        .approach-grid { display:grid; grid-template-columns:minmax(0,.9fr) minmax(340px,1fr); gap:60px; align-items:start; }
        .principles { border-top:1px solid var(--line); }
        .principle { display:grid; grid-template-columns:52px 1fr; gap:18px; padding:24px 0; border-bottom:1px solid var(--line); }
        .principle-num { color:var(--amber); font-size:11px; letter-spacing:.18em; font-weight:700; }
        .principle h3 { font-size:29px; line-height:1; }
        .principle p { color:var(--muted); line-height:1.62; margin:8px 0 0; }

        .worlds { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-top:34px; }
        .world-card { min-height:310px; border:1px solid var(--line); padding:28px; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; background:var(--surface-soft); }
        .world-card:before { content:""; position:absolute; width:210px; height:210px; border-radius:50%; top:-55px; right:-55px; background:radial-gradient(circle,rgba(212,162,74,.18),transparent 65%); }
        .world-card:nth-child(2):before { width:270px; height:270px; top:38px; right:-110px; opacity:.7; }
        .world-card:nth-child(3):before { top:-85px; right:35px; opacity:.55; }
        .world-index { position:absolute; top:24px; left:26px; color:var(--amber); letter-spacing:.18em; font-size:10px; font-weight:700; }
        .world-card h3 { font-size:40px; }
        .world-card p { color:var(--muted); line-height:1.62; margin:12px 0 0; position:relative; }

        .licensing-panel { display:grid; grid-template-columns:minmax(0,.78fr) minmax(0,1.22fr); gap:48px; align-items:start; }
        .route-grid { display:grid; grid-template-columns:1fr 1fr; border-top:1px solid var(--line); border-left:1px solid var(--line); }
        .route-card { padding:24px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); min-height:170px; }
        .route-card h3 { font-size:26px; }
        .route-card p { margin:10px 0 0; color:var(--muted); line-height:1.56; font-size:14px; }
        .licensing-note { margin-top:24px; color:var(--muted); font-size:13px; line-height:1.6; }

        .home-footer { padding:46px 0; border-top:1px solid var(--line); display:flex; justify-content:space-between; gap:24px; align-items:center; flex-wrap:wrap; color:var(--muted); }
        .footer-mark { display:flex; align-items:center; gap:16px; }
        .footer-mark img { width:42px; height:42px; object-fit:contain; }
        .footer-copy { margin:0; font-size:13px; }
        .footer-links { display:flex; gap:20px; flex-wrap:wrap; }
        .footer-links a { color:inherit; text-decoration:none; text-transform:uppercase; letter-spacing:.14em; font-size:10px; font-weight:700; }
        .footer-links a:hover { color:var(--amber); }

        @media (max-width:940px) {
          .home-hero,.approach-grid,.licensing-panel { grid-template-columns:1fr; }
          .signal-strip { grid-template-columns:1fr 1fr; }
          .signal:nth-child(2) { border-right:0; }
          .signal:nth-child(-n+2) { border-bottom:1px solid var(--line); }
          .worlds { grid-template-columns:1fr; }
          .world-card { min-height:240px; }
          .hero-artifact { min-height:330px; }
        }

        @media (max-width:660px) {
          .home-shell { width:min(100% - 28px,1180px); }
          .home-header { align-items:flex-start; }
          .home-nav { gap:12px; }
          .home-nav a { display:none; }
          .home-logo { width:190px; max-width:60vw; }
          .home-hero { padding:58px 0 52px; gap:38px; }
          .home-hero h1 { font-size:clamp(3.6rem,18vw,5.3rem); }
          .signal-strip,.route-grid { grid-template-columns:1fr; }
          .signal { border-right:0; border-bottom:1px solid var(--line); }
          .signal:last-child { border-bottom:0; }
          .signal:nth-child(2) { border-right:0; }
          .route-card { min-height:0; }
          .home-section { padding:56px 0; }
          .principle { grid-template-columns:38px 1fr; }
          .hero-actions { display:grid; }
          .home-btn { width:100%; box-sizing:border-box; }
        }
      `}</style>

      <div className="home-shell">
        <header className="home-header">
          <Link className="home-brand" to="/" aria-label="Conduct Alchemy home">
            <img
              className="home-logo"
              src={artifactMode ? ASSETS.navBlack : ASSETS.navWhite}
              alt="Conduct Alchemy"
            />
          </Link>

          <nav className="home-nav" aria-label="Primary navigation">
            <a href="#approach">Approach</a>
            <a href="#worlds">Visual Worlds</a>
            <Link to="/licensing">Licensing</Link>
            <button
              className="artifact-toggle"
              type="button"
              onClick={() => setArtifactMode((current) => !current)}
              aria-pressed={artifactMode}
            >
              {artifactMode ? "Exit Artifact" : "View as Artifact"}
            </button>
          </nav>
        </header>

        <section className="home-hero" aria-labelledby="home-title">
          <div>
            <p className="eyebrow">Premium music licensing for storytellers</p>
            <h1 id="home-title">This is not stock. This is selection. This is alchemy.</h1>
            <p className="hero-lead">
              Curated cinematic music of exceptional quality, chosen for story and approached with
              the rights clarity creative teams need to move with confidence.
            </p>
            <div className="hero-actions">
              <a className="home-btn primary" href="#approach">Explore the approach</a>
              <Link className="home-btn secondary" to="/licensing">Request clearance</Link>
            </div>
          </div>

          <div className="hero-artifact" aria-hidden="true">
            <div className="artifact-object">
              <img src={artifactMode ? ASSETS.motifBlack : ASSETS.motifWhite} alt="" />
              <span className="artifact-label">Made for storytellers</span>
            </div>
          </div>
        </section>

        <section className="signal-strip" aria-label="Conduct Alchemy principles">
          {pillars.map(([title, copy]) => (
            <article className="signal" key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <section className="home-section" id="approach">
          <div className="approach-grid">
            <div>
              <span className="section-kicker">A considered path to sound</span>
              <h2>Music that deepens story and elevates production.</h2>
              <p className="section-copy">
                Conduct Alchemy is built for filmmakers, editors, supervisors, agencies and creators
                who care deeply about story and sound. We favour selection over volume, context over
                clutter and clear creative conversation over anonymous marketplace noise.
              </p>
            </div>

            <div className="principles">
              {[
                ["01", "Listen for story", "Start with intention, scene, audience and emotional purpose."],
                ["02", "Curate with restraint", "Surface fewer, stronger choices with a clear reason for each."],
                ["03", "Clear with confidence", "Scope use, media, territory, term and deliverables before rights are granted."],
              ].map(([number, title, copy]) => (
                <article className="principle" key={number}>
                  <span className="principle-num">{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section" id="worlds">
          <span className="section-kicker">Visual Worlds</span>
          <h2>Sound considered in the context of picture, pace and purpose.</h2>
          <p className="section-copy">
            The catalogue experience is being shaped around how music actually lives in creative work:
            in narrative, in brand worlds and in motion.
          </p>

          <div className="worlds">
            {worlds.map(([title, copy], index) => (
              <article className="world-card" key={title}>
                <span className="world-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section" id="licensing-confidence">
          <div className="licensing-panel">
            <div>
              <span className="section-kicker">Clearance confidence</span>
              <h2>Clear rights. Confident creativity.</h2>
              <p className="section-copy">
                Tell us where the music will live. We scope the most suitable route around the project,
                media, territory, duration, paid support, exclusivity and deliverables.
              </p>
              <div className="hero-actions">
                <Link className="home-btn primary" to="/licensing">Start a clearance request</Link>
              </div>
              <p className="licensing-note">
                No usage rights are granted until scope and terms are agreed in writing.
              </p>
            </div>

            <div className="route-grid">
              {routes.map(([title, copy]) => (
                <article className="route-card" key={title}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="home-footer">
          <div className="footer-mark">
            <img src={artifactMode ? ASSETS.motifBlack : ASSETS.motifWhite} alt="" aria-hidden="true" />
            <p className="footer-copy">Curated. Licensed. Elevated.</p>
          </div>
          <div className="footer-links">
            <a href="#approach">Approach</a>
            <a href="#worlds">Visual Worlds</a>
            <Link to="/licensing">Licensing</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
