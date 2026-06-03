import { useState, useEffect, useRef } from 'react';
import { audioSystem } from '@/src/lib/audio';

interface BootLoaderProps {
  onLineAdded?: () => void;
  onComplete?: () => void;
}

interface BootStep {
  text: string;
  prefix?: string;
  isBold?: boolean;
  color?: string;
  delay?: number; // custom delay after this line
}

const BOOT_STEPS: BootStep[] = [
  { text: "Welcome to Manjunathan's Portfolio Terminal v1.0.0", isBold: true, color: "text-primary text-xs sm:text-sm md:text-base font-bold mb-1", delay: 200 },
  { text: "I am a conversational OS assistant. Type help for commands, or just chat with me!", color: "text-primary/90 text-xs sm:text-sm", delay: 150 }
];

export default function BootLoader({ onLineAdded, onComplete }: BootLoaderProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [bootFinished, setBootFinished] = useState<boolean>(false);
  const callbacksRef = useRef({ onLineAdded, onComplete });

  // Keep refs updated to prevent re-running effect hooks
  useEffect(() => {
    callbacksRef.current = { onLineAdded, onComplete };
  }, [onLineAdded, onComplete]);

  useEffect(() => {
    let currentStep = 0;
    let timerId: NodeJS.Timeout | null = null;

    const runNextStep = () => {
      if (currentStep < BOOT_STEPS.length) {
        setVisibleLines(currentStep + 1);
        
        // Play organic tactile click for terminal printing
        try {
          audioSystem.playKeystroke();
        } catch (e) {}

        // Scroll parent container
        if (callbacksRef.current.onLineAdded) {
          callbacksRef.current.onLineAdded();
        }

        const step = BOOT_STEPS[currentStep];
        currentStep++;

        timerId = setTimeout(runNextStep, step.delay || 150);
      } else {
        setBootFinished(true);
        try {
          audioSystem.playSuccess();
        } catch (e) {}
        
        if (callbacksRef.current.onLineAdded) {
          callbacksRef.current.onLineAdded();
        }
        if (callbacksRef.current.onComplete) {
          callbacksRef.current.onComplete();
        }
      }
    };

    // Begin sequence shortly after layout settles
    const startDelay = setTimeout(runNextStep, 350);

    return () => {
      clearTimeout(startDelay);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <div className="space-y-1 text-primary font-mono text-[10px] sm:text-xs">
      
      <div className="space-y-0.5 font-mono">
        {BOOT_STEPS.slice(0, visibleLines).map((step, idx) => {
          let badge = null;
          if (step.prefix === "OK") {
            badge = <span className="text-emerald-500 font-bold">OK</span>;
          } else if (step.prefix) {
            badge = <span className="text-primary/80 font-semibold">{step.prefix}</span>;
          }

          const isLatest = idx === visibleLines - 1;

          return (
            <div key={idx} className={`leading-snug transition-transform duration-100 ${step.color || ''}`}>
              {step.prefix && (
                <span className="inline-block mr-1">
                  [  {badge}  ]
                </span>
              )}
              <span className={step.isBold ? "font-bold text-primary" : ""}>
                {step.text}
              </span>
              {isLatest && !bootFinished && (
                <span className="inline-block w-2 h-3.5 bg-primary ml-1 align-middle animate-pulse animate-[pulse_0.6s_infinite]" />
              )}
            </div>
          );
        })}
      </div>

      {bootFinished && (
        <div className="my-2" />
      )}
    </div>
  );
}
