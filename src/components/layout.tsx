import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background text-foreground transition-colors duration-500 selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-[0.2em] font-medium hover:text-primary transition-colors" data-testid="link-home">
            CONDUCT ALCHEMY
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-sans tracking-wide">
            <Link href="/music" className={`hover:text-primary transition-colors ${location.startsWith('/music') ? 'text-primary' : 'text-muted-foreground'}`}>MUSIC</Link>
            <Link href="/licensing" className={`hover:text-primary transition-colors ${location === '/licensing' ? 'text-primary' : 'text-muted-foreground'}`}>LICENSING</Link>
            <Link href="/visual-worlds" className={`hover:text-primary transition-colors ${location === '/visual-worlds' ? 'text-primary' : 'text-muted-foreground'}`}>VISUAL WORLDS</Link>
            <Link href="/about" className={`hover:text-primary transition-colors ${location === '/about' ? 'text-primary' : 'text-muted-foreground'}`}>ABOUT</Link>
            <Link href="/contact" className={`hover:text-primary transition-colors ${location === '/contact' ? 'text-primary' : 'text-muted-foreground'}`}>CONTACT</Link>
            <div className="w-px h-4 bg-border mx-2"></div>
            <Link href="/admin" className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors uppercase tracking-widest">Admin</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-background border-t border-border/40 flex flex-col p-8 gap-6 animate-in slide-in-from-top-4 duration-300">
          <Link href="/music" className="text-xl font-serif tracking-widest hover:text-primary">MUSIC</Link>
          <Link href="/licensing" className="text-xl font-serif tracking-widest hover:text-primary">LICENSING</Link>
          <Link href="/visual-worlds" className="text-xl font-serif tracking-widest hover:text-primary">VISUAL WORLDS</Link>
          <Link href="/about" className="text-xl font-serif tracking-widest hover:text-primary">ABOUT</Link>
          <Link href="/contact" className="text-xl font-serif tracking-widest hover:text-primary">CONTACT</Link>
          <div className="w-full h-px bg-border my-4"></div>
          <Link href="/admin" className="text-sm tracking-widest text-muted-foreground hover:text-primary">ADMIN</Link>
        </div>
      )}

      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border/40 py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-lg tracking-[0.2em] text-muted-foreground">CONDUCT ALCHEMY</div>
          <div className="flex gap-6 text-xs tracking-widest text-muted-foreground font-sans">
            <Link href="/legal" className="hover:text-primary transition-colors">LEGAL</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">CONTACT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}