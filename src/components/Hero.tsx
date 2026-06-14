import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowDown, FileText, Github, Linkedin, Mail, Sparkles, Terminal as TerminalIcon } from 'lucide-react';
import { RESUME_DATA } from '@/src/constants';
import MatrixRain from '@/src/components/MatrixRain';
import Terminal from '@/src/components/Terminal';
import GlitchText from '@/src/components/GlitchText';
import { audioSystem } from '@/src/lib/audio';

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = [
    'Back-end Software Engineer',
    'Computer Vision Engineer',
    'AI/ML Developer',
    'Vibecoder',
    'Tech Content Creator'
  ];

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 80);
      } else {
        // Pause at full text before deleting
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
      } else {
        // Move to next role
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-36 sm:pb-40 lg:py-16 px-4 overflow-hidden border-b-[4px] border-primary">
      {/* Dynamic Matrix digital rain background */}
      <MatrixRain />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12 md:mt-16 select-none">
        
        {/* Hero Copy (Left Column) */}
        <div className="lg:col-span-6 text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Status Batch */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-background text-primary border-neo shadow-neo-sm text-xs font-bold font-mono tracking-wider uppercase select-none">
              <Sparkles className="size-3.5 text-primary animate-pulse" />
              SYSTEM_STATUS: OPEN_FOR_RECRUITMENT
            </div>

            {/* Giant Bold Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[45px] xl:text-[58px] font-extrabold leading-none uppercase font-heading text-primary flex flex-col gap-3">
              <span className="bg-primary text-primary-foreground px-5 py-2 sm:px-8 sm:py-3.5 tracking-widest border-neo block w-fit mb-1">
                <GlitchText text="Manjunathan" bgMode={true} className="tracking-widest" />
              </span>
              <span className="block border-neo bg-background px-5 py-2 sm:px-8 sm:py-3.5 tracking-widest shadow-neo w-fit">
                <GlitchText text="Chettiar" bgMode={true} className="tracking-widest" />
              </span>
            </h1>

            {/* Technical monospaced title tag - Dynamic Cycler */}
            <div className="bg-secondary text-primary border-neo px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest w-fit min-w-[240px] shadow-neo-sm h-8 flex items-center relative overflow-hidden select-text">
              <span className="mr-2 text-primary/80 select-none">&gt;</span>
              <span className="font-mono text-xs font-bold whitespace-nowrap">
                {displayText}
              </span>
              <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 animate-[blink_0.8s_step-end_infinite]" />
            </div>

            {/* Brief introductory text */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md font-mono pt-2">
              Architecting fully scalable microservices, low-latency API architectures, and automated data processing pipeline orchestration.
            </p>
          </motion.div>

          {/* Social connections in brutalist shapes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <a 
              href="#about"
              onClick={() => audioSystem.playClick()}
              className="bg-primary text-primary-foreground border-neo shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all font-mono font-bold text-xs sm:text-sm px-4 py-2.5 uppercase flex items-center gap-2 cursor-pointer"
            >
              <TerminalIcon className="size-4" />
              System Core
            </a>
            <a 
              href={RESUME_DATA.linkedin}
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => audioSystem.playClick()}
              className="bg-background text-primary border-neo shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all font-mono font-bold p-3 cursor-pointer"
              title="LinkedIn Profile"
            >
              <Linkedin className="size-4 sm:size-5" />
            </a>
            <a 
              href="https://github.com/manjunathan1999"
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => audioSystem.playClick()}
              className="bg-background text-primary border-neo shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all font-mono font-bold p-3 cursor-pointer"
              title="GitHub Profile"
            >
              <Github className="size-4 sm:size-5" />
            </a>
            <a 
              href={`mailto:${RESUME_DATA.email}`}
              onClick={() => audioSystem.playClick()}
              className="bg-background text-primary border-neo shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all font-mono font-bold p-3 cursor-pointer"
              title="Send Direct Email"
            >
              <Mail className="size-4 sm:size-5" />
            </a>
            <a 
              href={RESUME_DATA.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioSystem.playClick()}
              className="bg-background text-primary border-neo shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm transition-all font-mono font-bold p-3 cursor-pointer"
              title="Download Resume"
            >
              <FileText className="size-4 sm:size-5" />
            </a>
          </motion.div>
        </div>

        {/* Dynamic Embedded Terminal Console (Right Column) */}
        <div className="lg:col-span-6 w-full z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full"
          >
            <Terminal />
          </motion.div>
        </div>

      </div>

      {/* Parallax Scroll indicator - Only render on spacious displays to protect responsive grid overlap */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden xl:flex flex-col items-center gap-1 opacity-70 z-10 select-none">
        <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-primary bg-background border border-primary px-1.5 py-0.5 uppercase mb-1">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-primary cursor-pointer"
          onClick={() => {
            audioSystem.playClick();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ArrowDown className="size-5" />
        </motion.div>
      </div>
    </section>
  );
}
