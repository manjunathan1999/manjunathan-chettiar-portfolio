import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Characters: Katakana, letters, digits, and binary
    const charString = '01ABCDEFGHIJKLMNOPQRSTUVWXYZｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const charArray = charString.split('');

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);

    // Array to track the y position of each column
    let drops: number[] = Array(columns).fill(1).map(() => Math.floor(Math.random() * -height / fontSize));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -height / fontSize));
      
      // Paint initial solid backdrop to prevent transparency accumulation issues
      const isDarkNow = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDarkNow ? '#000000' : '#ffffff';
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', handleResize);

    // Initial solid clear on mount
    const isInitialDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isInitialDark ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Clear canvas cleanly on theme switch to prevent mixed-color trails
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          ctx.fillStyle = isDarkNow ? '#000000' : '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Run matrix rendering loop at a throttled frame-rate for aesthetic rhythm
    let lastTime = 0;
    const interval = 40; // ~25 FPS for a retro technical rhythm

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      const isDark = document.documentElement.classList.contains('dark');

      // Draw semi-transparent background to create a trail effect matching background theme
      if (isDark) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      }
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        // Pick a random falling character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Randomize brightness for monochromatic depth
        const rand = Math.random();
        
        if (isDark) {
          if (rand > 0.95) {
            ctx.fillStyle = '#ffffff'; // Brilliant bright highlight
            ctx.font = `bold ${fontSize}px monospace`;
          } else if (rand > 0.6) {
            ctx.fillStyle = '#a6a6a6'; // Clear, luminous silver
            ctx.font = `${fontSize}px monospace`;
          } else {
            ctx.fillStyle = '#4d4d4d'; // Visible slate/medium gray for depth trail
            ctx.font = `${fontSize}px monospace`;
          }
        } else {
          // Light Mode: high-contrast dark characters/black flow
          if (rand > 0.95) {
            ctx.fillStyle = '#000000'; // Pure stark black leading highlight
            ctx.font = `bold ${fontSize}px monospace`;
          } else if (rand > 0.6) {
            ctx.fillStyle = '#262626'; // Luminous charcoal gray
            ctx.font = `${fontSize}px monospace`;
          } else {
            ctx.fillStyle = '#737373'; // Clear medium gray for readable fading trail
            ctx.font = `${fontSize}px monospace`;
          }
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        // If drop has reached screen bottom or randomly triggered, reset to top
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 dark:opacity-35 z-0 transition-opacity duration-300"
    />
  );
}
