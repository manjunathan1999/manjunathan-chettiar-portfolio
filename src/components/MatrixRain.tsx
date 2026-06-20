import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isPaused = false;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const charString = '01ABCDEFGHIJKLMNOPQRSTUVWXYZｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const charArray = charString.split('');

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array(columns).fill(1).map(() => Math.floor(Math.random() * -height / fontSize));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -height / fontSize));
      
      const isDarkNow = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDarkNow ? '#000000' : '#ffffff';
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', handleResize);

    // Initial solid clear on mount
    const isInitialDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isInitialDark ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Clear canvas cleanly on theme switch
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          ctx.fillStyle = isDarkNow ? '#000000' : '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    // Visibility-based pausing: stop rendering when not in viewport
    const container = containerRef.current;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isPaused = !entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (container) {
      visibilityObserver.observe(container);
    }

    // Also pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) isPaused = true;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = 0;
    const interval = 40; // ~25 FPS

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);

      // Skip rendering when paused (off-screen or tab hidden)
      if (isPaused) return;

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      const isDark = document.documentElement.classList.contains('dark');

      if (isDark) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      }
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const rand = Math.random();
        
        if (isDark) {
          if (rand > 0.95) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${fontSize}px monospace`;
          } else if (rand > 0.6) {
            ctx.fillStyle = '#a6a6a6';
            ctx.font = `${fontSize}px monospace`;
          } else {
            ctx.fillStyle = '#4d4d4d';
            ctx.font = `${fontSize}px monospace`;
          }
        } else {
          if (rand > 0.95) {
            ctx.fillStyle = '#000000';
            ctx.font = `bold ${fontSize}px monospace`;
          } else if (rand > 0.6) {
            ctx.fillStyle = '#262626';
            ctx.font = `${fontSize}px monospace`;
          } else {
            ctx.fillStyle = '#737373';
            ctx.font = `${fontSize}px monospace`;
          }
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

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      themeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50 dark:opacity-35 z-0 transition-opacity duration-300"
      />
    </div>
  );
}
