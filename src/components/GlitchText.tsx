import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface GlitchTextProps {
  text: string;
  className?: string;
  bgMode?: boolean; // Styled frame matching brutalist container boxes
}

export default function GlitchText({ text, className = "", bgMode = false }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#%@*+/<>[]';
  const originalText = useRef(text);

  useEffect(() => {
    originalText.current = text;
    setDisplayText(text);
  }, [text]);

  const runScramble = () => {
    if (isGlitching) return;
    setIsGlitching(true);

    let progress = 0;
    const speed = 35; // milliseconds per cycle
    const totalSteps = text.length * 1.5;

    const interval = setInterval(() => {
      progress += 1;
      
      // Fast jitter screen offset effects
      if (Math.random() > 0.3) {
        setGlitchOffset({
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 3,
        });
      } else {
        setGlitchOffset({ x: 0, y: 0 });
      }

      setDisplayText(() => {
        return originalText.current
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            const charProgress = (index / originalText.current.length) * totalSteps;
            if (progress >= charProgress) {
              return originalText.current[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      if (progress >= totalSteps) {
        clearInterval(interval);
        setDisplayText(originalText.current);
        setGlitchOffset({ x: 0, y: 0 });
        setIsGlitching(false);
      }
    }, speed);
  };

  useEffect(() => {
    // Auto-run once on load
    const startDelay = setTimeout(() => {
      runScramble();
    }, 600);

    // Periodic automatic small system malfunctions
    const periodic = setInterval(() => {
      if (Math.random() > 0.45) {
        runScramble();
      }
    }, 6000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(periodic);
    };
  }, [text]);

  // Combine outer glitch boxes if styling demands
  const basicText = (
    <span
      style={{
        textShadow: isGlitching 
          ? `
              ${Math.random() > 0.5 ? '2.5px' : '-2.5px'} 0px 0px rgba(0, 255, 0, 0.4), 
              ${Math.random() > 0.5 ? '-2.5px' : '2.5px'} 0px 0px rgba(255, 0, 0, 0.3)
            `
          : 'none',
        display: 'inline-block'
      }}
    >
      {displayText}
    </span>
  );

  return (
    <motion.span
      className={`inline-block ${className} cursor-pointer font-mono font-extrabold select-none`}
      onMouseEnter={runScramble}
      style={{
        x: glitchOffset.x,
        y: glitchOffset.y,
        display: 'inline-block'
      }}
    >
      {bgMode ? (
        <span className="block px-2 py-1 transition-all duration-150">
          {basicText}
        </span>
      ) : (
        basicText
      )}
    </motion.span>
  );
}
