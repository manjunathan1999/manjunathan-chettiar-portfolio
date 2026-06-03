import { useEffect, useRef } from 'react';
import { audioSystem } from '@/src/lib/audio';

interface TerminalMatrixOverlayProps {
  theme: 'default' | 'cyber-green' | 'amber-decay' | 'monochrome';
  onExit: () => void;
  customWord?: string;
}

export default function TerminalMatrixOverlay({ theme, onExit, customWord }: TerminalMatrixOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    // Characters: standard binary + matrix alphanumeric, or user's custom uppercase string
    const customWordUpper = customWord ? customWord.toUpperCase() : '';
    const charString = customWordUpper 
      ? (customWordUpper.length < 5 ? customWordUpper.repeat(4) + '01' : customWordUpper)
      : '010110100110010101BINARYCODESTREAMSYSTEMX0187842347289';
    const charArray = charString.split('');

    const fontSize = 12;
    let columns = Math.floor(width / fontSize);

    // Track state of each column
    let drops: number[] = Array(columns).fill(1).map(() => Math.floor(Math.random() * -height / fontSize));

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 400;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -height / fontSize));
    };

    window.addEventListener('resize', handleResize);

    // Determine colors based on active terminal theme
    const getThemeColors = () => {
      switch (theme) {
        case 'cyber-green':
          return {
            bg: 'rgba(5, 15, 5, 0.08)',
            clearBg: '#050f05',
            lead: '#FFFFFF',
            mid: '#00FF00',
            trail: '#005500',
          };
        case 'amber-decay':
          return {
            bg: 'rgba(25, 15, 0, 0.08)',
            clearBg: '#120700',
            lead: '#FFFFFF',
            mid: '#FFB000',
            trail: '#884400',
          };
        case 'monochrome':
          return {
            bg: 'rgba(10, 10, 10, 0.08)',
            clearBg: '#000000',
            lead: '#FFFFFF',
            mid: '#E4E4E7',
            trail: '#52525B',
          };
        default:
          // Matches the default light/dark mode
          const isDark = document.documentElement.classList.contains('dark');
          return {
            bg: isDark ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
            clearBg: isDark ? '#000000' : '#FFFFFF',
            lead: isDark ? '#FFFFFF' : '#000000',
            mid: isDark ? '#aaaaaa' : '#333333',
            trail: isDark ? '#444444' : '#aaaaaa',
          };
      }
    };

    const colors = getThemeColors();

    // Paint initial clear layout
    ctx.fillStyle = colors.clearBg;
    ctx.fillRect(0, 0, width, height);

    // Rain frame rate throttled rhythm
    let lastTime = 0;
    const interval = 45; // ~22 FPS for aesthetic rhythm

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        // If they provided a custom word, sequentialize characters to spell the word down the column
        let char = '';
        if (customWordUpper) {
          const charIdx = Math.abs(drops[i]) % customWordUpper.length;
          char = customWordUpper[charIdx];
        } else {
          char = charArray[Math.floor(Math.random() * charArray.length)];
        }

        const rand = Math.random();

        if (rand > 0.95) {
          ctx.fillStyle = colors.lead;
          ctx.font = `bold ${fontSize}px monospace`;
        } else if (rand > 0.40) {
          ctx.fillStyle = colors.mid;
          ctx.font = `${fontSize}px monospace`;
        } else {
          ctx.fillStyle = colors.trail;
          ctx.font = `${fontSize}px monospace`;
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    // Keyboard handler to exit
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        try { audioSystem.playClick(); } catch (err) {}
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [theme, onExit]);

  return (
    <div 
      className="absolute inset-0 w-full h-full z-30 cursor-pointer overflow-hidden rounded-none"
      onClick={() => {
        try { audioSystem.playClick(); } catch (err) {}
        onExit();
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* HUD overlay */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none select-none z-40 animate-pulse">
        <div className="bg-black/80 border border-primary text-[10px] px-3 py-1 font-mono uppercase tracking-widest text-[#00FF00]">
          MATRIX RUNNING // PRESS ESC OR TAP SCREEN TO EXIT
        </div>
      </div>
    </div>
  );
}
