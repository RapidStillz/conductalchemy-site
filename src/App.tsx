import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Admin from "./pages/admin";
import Licensing from "./pages/licensing";

const tracks = [
  { title: "We Were Something", mood: "Soulful / cinematic", note: "A reflective song about endings without failure." },
  { title: "Sovereign of My Soul", mood: "Epic / empowering", note: "Built for bold visual storytelling and brand films." },
  { title: "Naya Rishta", mood: "Emotional / contemporary", note: "A cinematic bridge between intimacy and scale." },
];

const projects = [
  { eyebrow: "Music + Film", title: "We Were Something", body: "An original song and visual story becoming the first autonomous production proof for the wider studio." },
  { eyebrow: "Story World", title: "Hobey the Fearless Hare", body: "A children’s property spanning publishing, music, animation and emotionally rich seasonal storytelling." },
  { eyebrow: "Narrative IP", title: "Temporal Passengers", body: "A speculative story universe built around time, memory, consequence and immersive extensions." },
];

function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="wordmark" to="/">Conduct Alchemy</Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#music">Music</a>
          <a href="#stories">Stories</a>
          <a href="#about">About</a>
          <Link to="/licensing">Licensing</Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow">Original music. Story-led worlds. Creative experimentation.</p>
            <h1>We turn feeling into sound, image and story.</h1>
            <p className="hero-intro">
              Conduct Alchemy is an independent creative music brand developing songs, visual narratives and original intellectual property with human direction and AI-assisted production.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#music">Explore the music</a>
              <a className="button button-secondary" href="#stories">Discover the stories</a>
            </div>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit-core">CA</span>
          </div>
        </section>

        <section className="statement-strip" aria-label="Brand statement">
          <p>Not a stock-music library.</p>
          <p>Not a content factory.</p>
          <p>A living catalogue of songs, stories and ideas.</p>
        </section>

        <section className="content-section" id="music">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selected catalogue</p>
              <h2>Music with a world around it.</h2>
            </div>
            <p>Every track is treated as the beginning of a wider creative opportunity: film, performance, campaign, story or collaboration.</p>
          </div>

          <div className="track-grid">
            {tracks.map((track, index) => (
              <article className="track-card" key={track.title}>
                <span className="track-number">0{index + 1}</span>
                <div>
                  <p className="card-kicker">{track.mood}</p>
                  <h3>{track.title}</h3>
                  <p>{track.note}</p>
                </div>
                <button className="text-button" type="button" aria-label={`Preview ${track.title}`}>
                  Preview soon <span aria-hidden="true">↗</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section projects-section" id="stories">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Creative worlds</p>
              <h2>Stories designed to travel.</h2>
            </div>
            <p>Conduct Alchemy connects music to characters, campaigns and original properties rather than treating each release as an isolated asset.</p>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <p className="card-kicker">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p>{project.body}</p>
                <span className="project-status">In development</span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div>
            <p className="eyebrow">Why Conduct Alchemy exists</p>
            <h2>Creative instinct first. Technology in service of the idea.</h2>
          </div>
          <div className="about-copy">
            <p>
              We use emerging creative tools to increase ambition, speed and possibility—but the taste, emotional direction and final judgement remain human.
            </p>
            <p>
              The aim is not simply to generate more content. It is to build a distinctive catalogue, develop original stories and create work capable of connecting with audiences and commercial partners.
            </p>
          </div>
        </section>

        <section className="licensing-callout">
          <div>
            <p className="eyebrow">For filmmakers, brands and creative partners</p>
            <h2>Looking for music with a point of view?</h2>
            <p>Selected tracks are available for film, television, advertising, digital and social use.</p>
          </div>
          <Link className="button button-light" to="/licensing">Explore licensing</Link>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <Link className="wordmark" to="/">Conduct Alchemy</Link>
          <p>Music, stories and creative worlds in development.</p>
        </div>
        <div className="footer-links">
          <a href="#music">Music</a>
          <a href="#stories">Stories</a>
          <Link to="/licensing">Licensing</Link>
        </div>
      </footer>
    </div>
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
