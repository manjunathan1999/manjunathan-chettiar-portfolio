import { useEffect, useRef, useState } from 'react';

export default function GlitchDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const wasVisible = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible.current) {
          wasVisible.current = true;
          setIsPlaying(true);
        } else if (!entry.isIntersecting) {
          wasVisible.current = false;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    let frame = 0;
    const totalFrames = 12;
    let animId: number;

    const drawStatic = () => {
      if (frame >= totalFrames) {
        ctx.clearRect(0, 0, width, height);
        setIsPlaying(false);
        return;
      }

      const isDark = document.documentElement.classList.contains('dark');
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        if (isDark) {
          data[i] = noise * 0.3;
          data[i + 1] = noise * 0.8;
          data[i + 2] = noise * 0.3;
        } else {
          data[i] = noise * 0.7;
          data[i + 1] = noise * 0.7;
          data[i + 2] = noise * 0.7;
        }
        data[i + 3] = 180 - (frame * 15);
      }

      ctx.putImageData(imageData, 0, 0);

      // Horizontal glitch bars
      const barCount = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < barCount; i++) {
        const y = Math.random() * height;
        const barHeight = 1 + Math.random() * 3;
        const offset = (Math.random() - 0.5) * 20;
        const regionY = Math.max(0, Math.floor(y));
        const regionH = Math.min(Math.floor(barHeight), height - regionY);
        if (regionH > 0) {
          const region = ctx.getImageData(0, regionY, width, regionH);
          ctx.putImageData(region, Math.floor(offset), regionY);
        }
      }

      frame++;
      animId = requestAnimationFrame(drawStatic);
    };

    animId = requestAnimationFrame(drawStatic);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div ref={ref} className="relative w-full" style={{ height: '1px' }}>
      <canvas
        ref={canvasRef}
        className={`absolute left-0 right-0 w-full pointer-events-none transition-opacity duration-100 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ height: '32px', top: '-16px' }}
      />
    </div>
  );
}
