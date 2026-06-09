import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  char: string;
  alpha: number;
  velocity: number;
  size: number;
}

const CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursorDot = cursorRef.current;
    const cursorRing = cursorRingRef.current;
    if (!canvas || !cursorDot || !cursorRing) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Ring follows with a slight lag for smooth feel
    let ringX = -100;
    let ringY = -100;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Move the dot cursor instantly
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;

      // Spawn particles on movement
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          alpha: 0.8 + Math.random() * 0.2,
          velocity: 0.5 + Math.random() * 1.5,
          size: 10 + Math.floor(Math.random() * 6),
        });
      }

      // Cap particles for performance
      if (particlesRef.current.length > 150) {
        particlesRef.current = particlesRef.current.slice(-150);
      }
    };

    const handleMouseLeave = () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    };

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);

      // Smooth ring follow
      ringX += (mouseRef.current.x - ringX) * 0.15;
      ringY += (mouseRef.current.y - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Fade and fall
        p.alpha -= 0.015;
        p.y += p.velocity;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw character
        if (isDark) {
          ctx.fillStyle = `rgba(0, 255, 65, ${p.alpha})`;
        } else {
          ctx.fillStyle = `rgba(0, 80, 30, ${p.alpha})`;
        }
        ctx.font = `${p.size}px monospace`;
        ctx.fillText(p.char, p.x, p.y);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Particle trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
        aria-hidden="true"
      />
      {/* Custom cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41,0_0_20px_#00ff41] transition-opacity duration-200"
        aria-hidden="true"
      />
      {/* Cursor ring — follows with lag */}
      <div
        ref={cursorRingRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#00ff41]/50 transition-opacity duration-200"
        aria-hidden="true"
      />
    </>
  );
}
