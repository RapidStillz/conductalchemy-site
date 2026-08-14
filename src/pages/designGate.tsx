import { useState } from "react";

type DirectionKey = "cinematic" | "editorial" | "archive";

const directions: Array<{
  key: DirectionKey;
  index: string;
  name: string;
  thesis: string;
  ask: string;
  note: string;
}> = [
  {
    key: "cinematic",
    index: "01",
    name: "Cinematic Alchemy",
    thesis: "The work arrives like a film opening: image, atmosphere, sound and story before explanation.",
    ask: "Choose this if Conduct Alchemy should feel emotionally immersive first, with commerce and capability revealed only after the work has landed.",
    note: "High emotion · minimal chrome · motion-led transitions · gallery-scale work"
  },
  {
    key: "editorial",
    index: "02",
    name: "Editorial Atelier",
    thesis: "A cultured studio journal: rigorous curation, authored taste, credits, context and confidence.",
    ask: "Choose this if Conduct Alchemy should feel like a discerning creative publication and studio — intelligent, tactile and highly authored.",
    note: "Editorial rhythm · strong typography · credits/context · considered whitespace"
  },
  {
    key: "archive",
    index: "03",
    name: "Living Archive",
    thesis: "A growing creative world where songs, films, artists, stories and experiments connect over time.",
    ask: "Choose this if Conduct Alchemy should reveal the depth of the catalogue and creative universe through exploration and relationships between works.",
    note: "Connected catalogue · discovery paths · metadata as texture · evolving collection"
  }
];

const logo = "/brand/conduct-alchemy/logo/svg/ca-logo-nav-white.svg";
const motif = "/brand/conduct-alchemy/marks/svg/ca-motif-vector-white.svg";

export default function DesignGate() {
  const [active, setActive] = useState<DirectionKey>("cinematic");

  return (
    <main className="gate-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #080908; }
        .gate-shell {
          min-height: 100vh;
          color: #f1ede6;
          background:
            radial-gradient(circle at 86% 10%, rgba(212,162,74,.12), transparent 32rem),
            linear-gradient(180deg,#080908,#111210 55%,#080908);
          font-family: 'IBM Plex Sans', Inter, system-ui, sans-serif;
        }
        .gate-inner { width: min(1320px, calc(100% - 40px)); margin: 0 auto; }
        .gate-head { display:flex; justify-content:space-between; gap:30px; align-items:center; padding:28px 0 22px; border-bottom:1px solid rgba(247,245,240,.14); }
        .gate-logo { width:220px; max-width:46vw; height:auto; }
        .gate-meta { text-align:right; color:#a8a198; font-size:11px; letter-spacing:.14em; text-transform:uppercase; line-height:1.7; }
        .gate-intro { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr); gap:52px; padding:68px 0 54px; }
        .eyebrow { color:#d4a24a; text-transform:uppercase; letter-spacing:.2em; font-size:11px; font-weight:700; margin:0 0 20px; }
        h1,h2,h3,p { margin-top:0; }
        h1 { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(3.4rem,7vw,7.7rem); line-height:.88; letter-spacing:-.04em; font-weight:500; margin-bottom:24px; max-width:980px; }
        .gate-intro-copy { max-width:760px; color:#bcb4a8; font-size:17px; line-height:1.72; }
        .canon-card { align-self:end; border:1px solid rgba(247,245,240,.14); padding:22px; background:rgba(255,255,255,.025); }
        .canon-card strong { display:block; color:#d4a24a; text-transform:uppercase; letter-spacing:.16em; font-size:10px; margin-bottom:12px; }
        .canon-card p { color:#bcb4a8; font-size:13px; line-height:1.65; margin:0; }
        .direction-nav { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(247,245,240,.14); border:1px solid rgba(247,245,240,.14); }
        .direction-tab { appearance:none; border:0; background:#0d0f0e; color:#f1ede6; padding:18px 20px; text-align:left; cursor:pointer; }
        .direction-tab:hover,.direction-tab.active { background:#171914; }
        .direction-tab.active { box-shadow: inset 0 -2px #d4a24a; }
        .direction-tab span { display:block; color:#d4a24a; font-size:10px; letter-spacing:.18em; margin-bottom:8px; }
        .direction-tab strong { font-family:'Cormorant Garamond',Georgia,serif; font-size:25px; font-weight:500; }
        .direction-board { margin-top:28px; border:1px solid rgba(247,245,240,.14); overflow:hidden; background:#0d0f0e; }
        .direction-board.cinematic { --accent:#d4a24a; --panel:#10120f; --soft:#151812; }
        .direction-board.editorial { --accent:#c9b79a; --panel:#121211; --soft:#e9e2d8; }
        .direction-board.archive { --accent:#a8aa92; --panel:#0d100f; --soft:#151b18; }
        .mock-header { height:76px; display:flex; align-items:center; justify-content:space-between; gap:24px; padding:0 28px; border-bottom:1px solid rgba(247,245,240,.14); background:var(--panel); }
        .mock-header img { width:170px; height:auto; }
        .mock-links { display:flex; gap:22px; color:#aaa49b; font-size:9px; text-transform:uppercase; letter-spacing:.17em; }
        .mock-main { min-height:690px; background:var(--panel); }
        .cinematic .mock-main { display:grid; grid-template-columns:1.25fr .75fr; }
        .cinematic .hero-copy { padding:62px 42px; display:flex; flex-direction:column; justify-content:flex-end; min-height:610px; }
        .cinematic .hero-copy .mock-kicker,.archive .mock-kicker { color:var(--accent); font-size:10px; text-transform:uppercase; letter-spacing:.2em; }
        .cinematic .hero-copy h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(4rem,7vw,7rem); line-height:.84; font-weight:500; letter-spacing:-.04em; max-width:760px; margin:16px 0 24px; }
        .cinematic .hero-copy p { max-width:580px; color:#b8b0a5; font-size:15px; line-height:1.7; }
        .cinematic .hero-visual { position:relative; min-height:610px; background:
          radial-gradient(circle at 50% 36%,rgba(212,162,74,.26),transparent 22%),
          linear-gradient(145deg,#171813,#090a09 72%); overflow:hidden; }
        .cinematic .hero-visual:before { content:""; position:absolute; inset:13% 16%; border:1px solid rgba(247,245,240,.2); box-shadow:0 28px 90px rgba(0,0,0,.55); transform:rotate(-3deg); }
        .cinematic .hero-visual img { position:absolute; width:110px; left:50%; top:50%; transform:translate(-50%,-50%); opacity:.9; }
        .cinematic .hero-visual:after { content:"WE WERE SOMETHING ONCE · FILM / SONG / MEMORY"; position:absolute; left:24px; right:24px; bottom:22px; color:#b5aea3; letter-spacing:.14em; font-size:9px; }
        .editorial .mock-main { background:#eee8de; color:#151515; padding:38px; }
        .editorial .ed-grid { display:grid; grid-template-columns:.8fr 1.4fr .8fr; gap:28px; }
        .editorial .ed-rule { border-top:1px solid #262626; padding-top:10px; font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:#655f58; }
        .editorial .ed-lead { grid-column:1 / -1; display:grid; grid-template-columns:1.1fr .9fr; gap:30px; align-items:end; padding-top:26px; }
        .editorial .ed-lead h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(4rem,8vw,8rem); line-height:.78; font-weight:500; letter-spacing:-.055em; margin:0; }
        .editorial .ed-lead p { font-size:15px; line-height:1.7; color:#4b4741; max-width:470px; }
        .editorial .ed-image { grid-column:1 / 3; min-height:330px; background:linear-gradient(135deg,#222,#554a3b 50%,#191919); position:relative; }
        .editorial .ed-image:after { content:"01 — Quiet Moment / Shared Headphones"; position:absolute; left:16px; bottom:14px; color:#eee8de; font-size:10px; letter-spacing:.14em; text-transform:uppercase; }
        .editorial .ed-notes { border-left:1px solid #262626; padding-left:22px; }
        .editorial .ed-notes strong { display:block; font-family:'Cormorant Garamond',Georgia,serif; font-size:34px; font-weight:500; margin:22px 0 8px; }
        .editorial .ed-notes p { color:#565049; font-size:13px; line-height:1.65; }
        .archive .mock-main { padding:34px; background:linear-gradient(180deg,#0d100f,#131814); }
        .archive .archive-top { display:flex; justify-content:space-between; gap:30px; align-items:end; padding:26px 0 34px; }
        .archive .archive-top h2 { font-family:'Cormorant Garamond',Georgia,serif; font-weight:500; font-size:clamp(3.8rem,6vw,6.6rem); line-height:.88; margin:12px 0 0; }
        .archive .archive-top p { color:#a8afa8; max-width:430px; line-height:1.65; }
        .archive .archive-grid { display:grid; grid-template-columns:1.25fr .75fr .75fr; grid-auto-rows:190px; gap:12px; }
        .archive .tile { position:relative; overflow:hidden; border:1px solid rgba(247,245,240,.12); background:#171b18; padding:18px; display:flex; flex-direction:column; justify-content:space-between; }
        .archive .tile.hero { grid-row:span 2; background:radial-gradient(circle at 58% 38%,rgba(168,170,146,.22),transparent 32%),#151815; }
        .archive .tile.story { grid-column:span 2; }
        .archive .tile small { color:#a8aa92; letter-spacing:.16em; text-transform:uppercase; font-size:9px; }
        .archive .tile strong { font-family:'Cormorant Garamond',Georgia,serif; font-size:30px; font-weight:500; max-width:300px; }
        .archive .tile p { color:#a8afa8; font-size:12px; line-height:1.55; margin:0; }
        .direction-copy { display:grid; grid-template-columns:1fr 1fr; gap:0; border-top:1px solid rgba(247,245,240,.14); }
        .direction-copy > div { padding:24px 28px; }
        .direction-copy > div + div { border-left:1px solid rgba(247,245,240,.14); }
        .direction-copy strong { display:block; color:var(--accent); text-transform:uppercase; letter-spacing:.15em; font-size:10px; margin-bottom:10px; }
        .direction-copy p { color:#bcb4a8; font-size:13px; line-height:1.65; margin:0; }
        .same-content { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin:32px 0 54px; }
        .moment { border:1px solid rgba(247,245,240,.14); min-height:180px; padding:20px; background:rgba(255,255,255,.025); }
        .moment span { color:#d4a24a; font-size:9px; text-transform:uppercase; letter-spacing:.18em; }
        .moment h3 { font-family:'Cormorant Garamond',Georgia,serif; font-size:30px; font-weight:500; margin:38px 0 10px; }
        .moment p { color:#aaa39a; font-size:12px; line-height:1.55; }
        .gate-foot { padding:34px 0 50px; border-top:1px solid rgba(247,245,240,.14); display:flex; justify-content:space-between; gap:30px; color:#88827a; font-size:11px; line-height:1.6; }
        @media (max-width:900px) {
          .gate-intro,.cinematic .mock-main,.editorial .ed-lead { grid-template-columns:1fr; }
          .direction-nav,.same-content { grid-template-columns:1fr; }
          .editorial .ed-grid { grid-template-columns:1fr; }
          .editorial .ed-lead,.editorial .ed-image,.editorial .ed-notes,.editorial .ed-rule { grid-column:auto; }
          .editorial .ed-notes { border-left:0; padding-left:0; }
          .archive .archive-grid { grid-template-columns:1fr 1fr; }
          .archive .tile.story { grid-column:span 1; }
          .gate-meta { display:none; }
        }
        @media (max-width:620px) {
          .gate-inner { width:min(100% - 24px,1320px); }
          .mock-links { display:none; }
          .direction-copy { grid-template-columns:1fr; }
          .direction-copy > div + div { border-left:0; border-top:1px solid rgba(247,245,240,.14); }
          .archive .archive-grid { grid-template-columns:1fr; }
          .archive .tile.hero,.archive .tile.story { grid-row:auto; grid-column:auto; }
          .archive .archive-top { display:block; }
        }
      `}</style>

      <div className="gate-inner">
        <header className="gate-head">
          <img className="gate-logo" src={logo} alt="Conduct Alchemy" />
          <div className="gate-meta">Product & Experience Design Gate<br/>Founder comparison · v1</div>
        </header>

        <section className="gate-intro">
          <div>
            <p className="eyebrow">Same content. Three different creative systems.</p>
            <h1>Which world should Conduct Alchemy become?</h1>
            <p className="gate-intro-copy">
              This is a decision surface, not a homepage proposal. Each direction uses the same core experience moments so the difference is the creative system — hierarchy, rhythm, discovery and emotional posture — rather than different content disguising the decision.
            </p>
          </div>
          <aside className="canon-card">
            <strong>Canon held constant</strong>
            <p>Conduct Alchemy remains a broader creative ecosystem/studio. Work before claims. Emotion before mechanics. Licensing remains a capability, not the brand’s organising idea. Logo and motif use the recovered project assets; typography here is exploratory until the Brand Registry typography selector is formally reconciled.</p>
          </aside>
        </section>

        <nav className="direction-nav" aria-label="Creative direction comparison">
          {directions.map((direction) => (
            <button
              key={direction.key}
              className={`direction-tab ${active === direction.key ? "active" : ""}`}
              type="button"
              onClick={() => setActive(direction.key)}
            >
              <span>{direction.index}</span>
              <strong>{direction.name}</strong>
            </button>
          ))}
        </nav>

        {directions.map((direction) => {
          if (direction.key !== active) return null;
          return (
            <section key={direction.key} className={`direction-board ${direction.key}`}>
              <div className="mock-header">
                <img src={logo} alt="Conduct Alchemy" />
                <div className="mock-links"><span>Work</span><span>Music</span><span>Stories</span><span>Studio</span><span>Collaborate</span></div>
              </div>

              {direction.key === "cinematic" && (
                <div className="mock-main">
                  <div className="hero-copy">
                    <span className="mock-kicker">A living work · 01</span>
                    <h2>We Were Something Once.</h2>
                    <p>A song becomes a memory. A memory becomes a film. Conduct Alchemy begins with the work itself — then opens the door into the people, process and possibilities behind it.</p>
                  </div>
                  <div className="hero-visual"><img src={motif} alt="" /></div>
                </div>
              )}

              {direction.key === "editorial" && (
                <div className="mock-main">
                  <div className="ed-grid">
                    <div className="ed-rule">Issue 01 / Work in progress</div>
                    <div className="ed-rule">Conduct Alchemy Journal</div>
                    <div className="ed-rule">Music · Film · Story</div>
                    <div className="ed-lead">
                      <h2>We Were<br/>Something Once.</h2>
                      <p>A song born from a family jam becomes a cinematic experiment in memory, intimacy and the strange truth that some endings are not failures.</p>
                    </div>
                    <div className="ed-image" />
                    <aside className="ed-notes">
                      <div className="ed-rule">Field notes</div>
                      <strong>The quiet moment.</strong>
                      <p>Shared headphones on the bus. No grand gesture. The work is strongest when the frame feels discovered rather than staged.</p>
                    </aside>
                  </div>
                </div>
              )}

              {direction.key === "archive" && (
                <div className="mock-main">
                  <div className="archive-top">
                    <div><span className="mock-kicker">The archive is alive</span><h2>Enter through the work.</h2></div>
                    <p>Songs, scenes, people and experiments remain connected — so every project can reveal where it came from, what it became and what it may become next.</p>
                  </div>
                  <div className="archive-grid">
                    <article className="tile hero"><small>Project · 001</small><strong>We Were Something Once</strong><p>Song → visual world → film experiment → release.</p></article>
                    <article className="tile"><small>Scene · 02</small><strong>Quiet Moment</strong><p>Shared headphones / bus memory.</p></article>
                    <article className="tile"><small>Origin</small><strong>Family jam</strong><p>Cello, guitar, voice, accident.</p></article>
                    <article className="tile story"><small>Story thread</small><strong>We didn’t fail. We just ended.</strong><p>Follow the emotional idea through song, image and written reflection.</p></article>
                  </div>
                </div>
              )}

              <div className="direction-copy">
                <div><strong>Creative thesis</strong><p>{direction.thesis}</p></div>
                <div><strong>Founder decision</strong><p>{direction.ask}</p></div>
              </div>
            </section>
          );
        })}

        <section className="same-content" aria-label="Content held constant across directions">
          <article className="moment"><span>Moment A</span><h3>Work</h3><p>Lead with a real creative project and let the brand earn attention through what it makes.</p></article>
          <article className="moment"><span>Moment B</span><h3>Story</h3><p>Reveal origin, process and emotional intent without turning the experience into corporate case-study language.</p></article>
          <article className="moment"><span>Moment C</span><h3>Collaborate</h3><p>Make licensing, commissions and partnership discoverable after creative conviction has been established.</p></article>
        </section>

        <footer className="gate-foot">
          <span>Exploration only — not final brand approval.</span>
          <span>{directions.find((d) => d.key === active)?.note}</span>
        </footer>
      </div>
    </main>
  );
}
