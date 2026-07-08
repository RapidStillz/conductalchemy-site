import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import Licensing from "./pages/licensing";

const ASSETS = {
  navWhite: "/brand/conduct-alchemy/logo/svg/ca-logo-nav-white.svg",
  motifWhite: "/brand/conduct-alchemy/marks/svg/ca-motif-vector-white.svg",
};

function Home() {
  return (
    <main className="home-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        .home-page {
          --black:#050505;
          --paper:#EDE9E3;
          --white:#F7F5F0;
          --amber:#D4A24A;
          --line:rgba(247,245,240,.16);
          --muted:#b9b0a2;
          min-height:100vh;
          color:var(--paper);
          background:radial-gradient(circle at 78% 8%,rgba(212,162,74,.17),transparent 30rem),linear-gradient(135deg,#050505,#111312 58%,#050505);
          font-family:'IBM Plex Sans', Inter, system-ui, sans-serif;
        }
        .home-shell { width:min(1160px,calc(100% - 40px)); margin:0 auto; }
        .home-header { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:28px 0; border-bottom:1px solid var(--line); }
        .home-logo { display:block; width:222px; max-width:42vw; height:auto; }
        .home-nav { display:flex; gap:28px; align-items:center; flex-wrap:wrap; justify-content:flex-end; }
        .home-nav a { color:inherit; text-decoration:none; text-transform:uppercase; letter-spacing:.18em; font-size:11px; font-weight:700; }
        .home-nav a:hover { color:var(--amber); }
        .home-hero { display:grid; grid-template-columns:minmax(0,1.02fr) minmax(320px,.72fr); gap:52px; align-items:center; padding:72px 0 58px; }
        .eyebrow { text-transform:uppercase; letter-spacing:.22em; font-size:12px; color:var(--amber); font-weight:700; margin:0 0 24px; }
        h1,h2,h3 { font-family:'Cormorant Garamond', Georgia, serif; font-weight:500; letter-spacing:-.025em; color:var(--paper); }
        h1 { font-size:clamp(4.3rem,8.4vw,8rem); line-height:.88; margin:0 0 24px; max-width:900px; }
        h2 { font-size:clamp(2.4rem,4.8vw,4.8rem); line-height:.95; margin:0; }
        h3 { font-size:28px; line-height:1; margin:0 0 10px; }
        .lead { max-width:680px; font-size:18px; line-height:1.75; color:var(--muted); }
        .actions { display:flex; gap:14px; flex-wrap:wrap; margin-top:32px; }
        .btn { display:inline-flex; align-items:center; justify-content:center; text-decoration:none; text-transform:uppercase; letter-spacing:.14em; font-size:12px; font-weight:800; padding:16px 22px; border:1px solid currentColor; color:inherit; }
        .btn.primary { background:var(--amber); color:#050505; border-color:var(--amber); }
        .btn.secondary { border-color:var(--line); }
        .hero-object { min-height:410px; border:1px solid var(--line); position:relative; overflow:hidden; display:grid; place-items:center; background:rgba(255,255,255,.04); }
        .hero-object:before { content:""; position:absolute; inset:15%; border-radius:999px; background:radial-gradient(circle,rgba(212,162,74,.16),transparent 62%); filter:blur(4px); }
        .monolith { width:min(250px,58%); aspect-ratio:1/.86; border:1px solid var(--line); background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(0,0,0,.10)); display:grid; place-items:center; box-shadow:0 34px 80px rgba(0,0,0,.25); position:relative; }
        .home-motif { width:92px; height:92px; object-fit:contain; opacity:.9; }
        .section { padding:58px 0; border-top:1px solid var(--line); }
        .grid-3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-top:28px; }
        .card { min-height:190px; padding:26px; border:1px solid var(--line); background:rgba(255,255,255,.04); }
        .card p, .note { color:var(--muted); line-height:1.62; margin:0; }
        .split { display:grid; grid-template-columns:minmax(0,.9fr) minmax(320px,1fr); gap:42px; align-items:start; }
        .signal-list { display:grid; gap:14px; }
        .signal { display:flex; justify-content:space-between; gap:18px; padding:18px 0; border-bottom:1px solid var(--line); color:var(--muted); }
        .signal strong { color:var(--paper); font-weight:700; }
        .footer { display:flex; justify-content:space-between; gap:18px; flex-wrap:wrap; padding:34px 0; border-top:1px solid var(--line); color:var(--muted); text-transform:uppercase; letter-spacing:.14em; font-size:11px; font-weight:700; }
        @media (max-width:900px){ .home-hero,.split{grid-template-columns:1fr}.grid-3{grid-template-columns:1fr 1fr}.hero-object{min-height:300px}.home-nav{gap:14px} }
        @media (max-width:600px){ .grid-3{grid-template-columns:1fr}.home-header{align-items:flex-start}.home-nav a:not(:last-child){display:none}h1{font-size:3.55rem}.home-shell{width:min(100% - 28px,1160px)}.home-logo{width:185px;max-width:58vw}.signal{display:grid} }
      `}</style>

      <div className="home-shell">
        <header className="home-header">
          <a href="/" aria-label="Conduct Alchemy home">
            <img className="home-logo" src={ASSETS.navWhite} alt="Conduct Alchemy" />
          </a>
          <nav className="home-nav" aria-label="Primary navigation">
            <a href="/licensing">Licensing</a>
            <a href="#worlds">Visual Worlds</a>
            <a href="#catalogue">Catalogue</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="home-hero">
          <div>
            <p className="eyebrow">Conduct Alchemy</p>
            <h1>Music with presence. Worlds with intent.</h1>
            <p className="lead">A premium creative house for cinematic music, carefully scoped licensing and atmospheric visual worlds. Built for storytellers, brands and creators who need sound with emotional weight and commercial clarity.</p>
            <div className="actions">
              <a className="btn primary" href="/licensing">Start a licensing enquiry</a>
              <a className="btn secondary" href="#worlds">Explore the world</a>
            </div>
          </div>
          <div className="hero-object" aria-label="Conduct Alchemy brand artifact">
            <div className="monolith"><img className="home-motif" src={ASSETS.motifWhite} alt="" aria-hidden="true" /></div>
          </div>
        </section>

        <section id="worlds" className="section">
          <p className="eyebrow">The creative proposition</p>
          <h2>Curated sound for story, screen and brand.</h2>
          <div className="grid-3">
            <article className="card">
              <h3>Cinematic music</h3>
              <p>Emotion-led tracks and sonic identities selected for drama, memory, motion and atmosphere.</p>
            </article>
            <article className="card">
              <h3>Licensing clarity</h3>
              <p>Rights-aware enquiry flow, scoped usage, written terms and no casual permission claims.</p>
            </article>
            <article className="card">
              <h3>Visual worlds</h3>
              <p>Brand-led imagery and motion language designed to make each release feel collectible, cinematic and alive.</p>
            </article>
          </div>
        </section>

        <section id="catalogue" className="section split">
          <div>
            <p className="eyebrow">Launch focus</p>
            <h2>A premium front door before the catalogue opens.</h2>
            <p className="lead">The homepage now sets the brand tone and directs serious commercial interest to the licensing route while the wider catalogue, fan journey and visual content layers are prepared.</p>
          </div>
          <div className="signal-list" aria-label="Conduct Alchemy launch signals">
            <div className="signal"><strong>01</strong><span>Brand-first homepage foundation</span></div>
            <div className="signal"><strong>02</strong><span>Licensing route as the primary commercial action</span></div>
            <div className="signal"><strong>03</strong><span>Catalogue and visual worlds signposted without overbuilding</span></div>
            <div className="signal"><strong>04</strong><span>Existing admin and Worker infrastructure left untouched</span></div>
          </div>
        </section>

        <section id="contact" className="section">
          <p className="eyebrow">Commercial route</p>
          <h2>For licensing, start with the project context.</h2>
          <p className="lead">Tell us where the music will live, how it will be used and what needs to be cleared. We will respond with the most suitable next step.</p>
          <div className="actions">
            <a className="btn primary" href="/licensing">Open licensing</a>
          </div>
        </section>

        <footer className="footer">
          <span>Curated. Licensed. Elevated.</span>
          <span>Made for storytellers.</span>
        </footer>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/licensing" element={<Licensing />} />
      </Routes>
    </BrowserRouter>
  );
}
