import { useState, useEffect, useCallback } from 'react';

interface CRTPowerOnProps {
  onComplete: () => void;
}

export default function CRTPowerOn({ onComplete }: CRTPowerOnProps) {
  const [phase, setPhase] = useState<'black' | 'dot' | 'line' | 'expand' | 'flash' | 'done'>('black');

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Phase 1: Black screen with tiny glowing dot (CRT warming up)
    const t1 = setTimeout(() => setPhase('dot'), 300);

    // Phase 2: Dot becomes a horizontal line
    const t2 = setTimeout(() => setPhase('line'), 700);

    // Phase 3: Line expands vertically to fill screen
    const t3 = setTimeout(() => setPhase('expand'), 1200);

    // Phase 4: Brief bright flash
    const t4 = setTimeout(() => setPhase('flash'), 1600);

    // Phase 5: Fade out
    const t5 = setTimeout(() => setPhase('done'), 1900);

    // Remove overlay
    const t6 = setTimeout(() => handleComplete(), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [handleComplete]);

  if (phase === 'done') {
    return (
      <div
        className="fixed inset-0 z-[99999] pointer-events-none bg-black"
        style={{ animation: 'crt-final-fade 0.5s ease-in forwards' }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden">
      {/* CRT scanline texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]" />

      {/* Phase: dot */}
      {phase === 'dot' && (
        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8),0_0_40px_rgba(255,255,255,0.4)] animate-pulse" />
      )}

      {/* Phase: horizontal line */}
      {phase === 'line' && (
        <div
          className="h-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.9),0_0_60px_rgba(255,255,255,0.5)]"
          style={{ animation: 'crt-line-grow 0.4s ease-out forwards' }}
        />
      )}

      {/* Phase: expand to full */}
      {phase === 'expand' && (
        <div
          className="w-full bg-white"
          style={{ animation: 'crt-expand-height 0.4s ease-out forwards' }}
        />
      )}

      {/* Phase: flash */}
      {phase === 'flash' && (
        <div
          className="w-full h-full bg-white"
          style={{ animation: 'crt-flash 0.3s ease-in forwards' }}
        />
      )}
    </div>
  );
}
