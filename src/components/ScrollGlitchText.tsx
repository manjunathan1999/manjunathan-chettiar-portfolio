import { useState, useEffect, useRef } from 'react';

interface ScrollGlitchTextProps {
  text: string;
  className?: string;
}

const GLITCH_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#%@*+/<>[]ｦｱｳｴｵｶ';

export default function ScrollGlitchText({ text, className = '' }: ScrollGlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const wasVisible = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible.current) {
          // Just entered viewport
          wasVisible.current = true;
          startScramble();
        } else if (!entry.isIntersecting) {
          // Left viewport — reset so it can trigger again next time
          wasVisible.current = false;
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  function startScramble() {
    if (isGlitching) return;
    setIsGlitching(true);

    // Start scrambled
    setDisplayText(
      text
        .split('')
        .map((c) => (c === ' ' ? ' ' : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]))
        .join('')
    );

    let progress = 0;
    const totalSteps = text.length * 2;
    const speed = 30;

    const interval = setInterval(() => {
      progress++;

      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            const charThreshold = (i / text.length) * totalSteps;
            if (progress >= charThreshold) return text[i];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      if (progress >= totalSteps) {
        clearInterval(interval);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, speed);
  }

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        textShadow: isGlitching
          ? '2px 0 rgba(0,255,65,0.4), -2px 0 rgba(255,0,0,0.3)'
          : 'none',
      }}
    >
      {displayText}
    </span>
  );
}
