import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { Button, buttonVariants } from '@/src/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/src/components/ui/sheet';
import { cn } from '@/src/lib/utils';
import { audioSystem } from '@/src/lib/audio';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(audioSystem.getIsMuted());
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleMuteChange = () => {
      setIsMuted(audioSystem.getIsMuted());
    };
    window.addEventListener('audio-mute-toggle', handleMuteChange);
    return () => {
      window.removeEventListener('audio-mute-toggle', handleMuteChange);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = audioSystem.toggleMute();
    if (!nextMuted) {
      audioSystem.playClick();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progressPercent = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progressPercent)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    
    // Check system preference or local storage
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    audioSystem.playToggle(nextDark);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-[3px] border-primary",
        isScrolled 
          ? "bg-background py-3 shadow-neo-sm" 
          : "bg-background/90 py-4"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Banner */}
        <a href="#" className="flex items-center gap-2 group cursor-pointer select-none">
          <span className="font-heading font-extrabold text-lg sm:text-xl border-2 border-primary bg-primary text-primary-foreground px-2 py-0.5 shadow-neo-sm group-hover:bg-background group-hover:text-primary transition-colors">
            MJ
          </span>
          <span className="hidden sm:inline-block font-mono text-xs font-bold bg-secondary border border-primary px-1.5 py-0.5">
            {(() => {
              const d = new Date();
              const day = String(d.getDate()).padStart(2, '0');
              const mon = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
              const yr = String(d.getFullYear()).slice(2);
              return `SYS_D${day}_${mon}${yr}`;
            })()}
          </span>
        </a>

        {/* Desktop Links (Custom Monospace Brutalist Items) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => audioSystem.playClick()}
              className="text-xs uppercase font-mono font-extrabold border-2 border-transparent hover:border-primary hover:bg-secondary px-3 py-1.5 transition-all text-primary"
            >
              {link.name}
            </a>
          ))}
          
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-4 p-2 border-2 border-primary bg-background text-primary shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:translate-x-0 active:translate-y-0 cursor-pointer"
            aria-label="Toggle visual theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="ml-2 p-2 border-2 border-primary bg-background text-primary shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:translate-x-0 active:translate-y-0 cursor-pointer"
            aria-label="Toggle system volume"
            title={isMuted ? "Unmute system sounds" : "Mute system sounds"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-destructive animate-pulse" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Navigation controls */}
        <div className="md:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 border-2 border-primary bg-background text-primary shadow-neo-sm cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 border-2 border-primary bg-background text-primary shadow-neo-sm cursor-pointer"
            aria-label="Toggle volume"
            title={isMuted ? "Unmute system sounds" : "Mute system sounds"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-destructive animate-pulse" /> : <Volume2 className="h-4 w-4" />}
          </button>
          
          <Sheet>
            <SheetTrigger
              onClick={() => audioSystem.playClick()}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }), 
                "border-2 border-primary shadow-neo-sm hover:shadow-none cursor-pointer p-0 shrink-0"
              )}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background border-l-[3px] border-primary p-0">
              <div className="flex flex-col h-full bg-background">
                {/* Header for Mobile Sheet */}
                <div className="p-6 border-b-2 border-primary flex justify-between items-center bg-secondary">
                  <span className="font-heading font-extrabold text-sm uppercase text-primary">System Index</span>
                </div>
                
                {/* Mobile Link Checklist */}
                <div className="flex flex-col p-6 gap-3">
                  {navLinks.map((link) => (
                    <SheetClose
                      key={link.name}
                      render={
                        <a
                          href={link.href}
                          onClick={() => audioSystem.playClick()}
                          className="font-mono text-xs uppercase font-extrabold border-2 border-primary p-3 bg-background hover:bg-secondary text-primary shadow-neo-sm transition-all focus:outline-none"
                        />
                      }
                    >
                      {link.name}
                    </SheetClose>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>

      {/* Scroll progress bar — transform:scaleX avoids layout shifts from width animation */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary/20 pointer-events-none">
        <div
          className="h-full w-full bg-primary origin-left"
          style={{
            transform: `scaleX(${scrollProgress / 100})`,
            transition: 'transform 80ms linear',
          }}
        />
      </div>
    </motion.nav>
  );
}
