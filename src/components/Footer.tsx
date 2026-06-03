import { RESUME_DATA } from '@/src/constants';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { audioSystem } from '@/src/lib/audio';

export default function Footer() {
  const scrollToTop = () => {
    audioSystem.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate a stable BUILD_ID on load
  const buildId = "CH-R25-3000G";

  return (
    <footer className="py-12 border-t-[3px] border-primary bg-background text-primary select-none font-mono">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="text-center md:text-left space-y-2">
            <p className="text-xl font-extrabold tracking-tighter uppercase font-heading border-2 border-primary bg-primary text-primary-foreground px-2 py-0.5 w-fit mx-auto md:mx-0 shadow-neo-sm">
              MJ.OS
            </p>
            <p className="text-[10px] text-muted-foreground/80 lowercase">
              BUILD_REF: {buildId} // CHANNEL: SECURE_STABLE_v2.5
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              © {new Date().getFullYear()} {RESUME_DATA.name}. All rights reserved.
            </p>
          </div>

          {/* Social and navigation links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href={RESUME_DATA.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => audioSystem.playClick()}
              className="p-2.5 border-2 border-primary bg-background text-primary shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
              title="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a 
              href={`mailto:${RESUME_DATA.email}`}
              onClick={() => audioSystem.playClick()}
              className="p-2.5 border-2 border-primary bg-background text-primary shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
              title="Email Inbox"
            >
              <Mail className="h-4 w-4" />
            </a>
            <button 
              type="button"
              className="p-2.5 border-2 border-primary bg-primary text-primary-foreground shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all ml-4 cursor-pointer"
              onClick={scrollToTop}
              title="Return to System Header"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
