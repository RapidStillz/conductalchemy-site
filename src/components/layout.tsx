import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { CookieBanner } from "@/components/cookie-banner";
import { NewsletterForm } from "@/components/newsletter-form";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-black text-white relative overflow-hidden">

      {/* Background texture */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/ca-bg-dark-texture.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/ca-logo-nav-white.svg"
              alt="Conduct Alchemy"
              className="h-6 md:h-7"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase">
            <Link href="/music" className={navClass(location, "/music")}>Music</Link>
            <Link href="/licensing" className={navClass(location, "/licensing")}>Licensing</Link>
            <Link href="/visual-worlds" className={navClass(location, "/visual-worlds")}>Visual Worlds</Link>
            <Link href="/about" className={navClass(location, "/about")}>About</Link>
            <Link href="/contact" className={navClass(location, "/contact")}>Contact</Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-black flex flex-col p-8 gap-6 text-lg tracking-widest uppercase">
          <Link href="/music">Music</Link>
          <Link href="/licensing">Licensing</Link>
          <Link href="/visual-worlds">Visual Worlds</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-16 pb-10 mt-auto relative z-10">
        <div className="container mx-auto px-4 md:px-8">

          {/* Top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">

            {/* Brand */}
            <div className="space-y-4">
              <img
                src="/assets/ca-logo-nav-white.svg"
                alt="Conduct Alchemy"
                className="h-6"
              />

              <p className="text-xs text-white/60 max-w-xs leading-relaxed">
                Premium cinematic music for film, television, advertising, and brands.
                Los Angeles · London.
              </p>

              <div className="flex gap-5 text-xs tracking-widest text-white/50 uppercase pt-2">
                <Link href="/music">Music</Link>
                <Link href="/licensing">Licensing</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">
                Stay in Tune
              </div>
              <NewsletterForm source="footer" compact />
            </div>

          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-4">
            <p className="text-[10px] text-white/40">
              © {new Date().getFullYear()} Conduct Alchemy. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5 text-[10px] tracking-widest text-white/40 uppercase">
              <Link href="/legal#privacy">Privacy Policy</Link>
              <Link href="/legal#terms">Terms</Link>
              <Link href="/legal#cookies">Cookies</Link>
            </div>
          </div>

        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}

function navClass(location: string, path: string) {
  return `transition-colors ${
    location.startsWith(path)
      ? "text-white"
      : "text-white/40 hover:text-white"
  }`;
}
