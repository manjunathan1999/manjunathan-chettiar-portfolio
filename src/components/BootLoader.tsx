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
  { text: "BOOTING RETRO_OS COMPATIBLE ARCHITECTURE x86_64...", prefix: "[ INFO ]", isBold: true, color: "text-primary/70", delay: 280 },
  { text: "Loading Linux kernel version 5.10.142-manjunathan-os...", prefix: "[ SYSTEM ]", delay: 180 },
  { text: "Mounted virtual filesystem partition /sys/kernel/debug", prefix: "OK", delay: 120 },
  { text: "Initialized direct DMA channel ports for terminal stream matrices", prefix: "OK", delay: 140 },
  { text: "Started retro CRT TTY screen scanline simulation controller daemon", prefix: "OK", delay: 200 },
  { text: "Synthetic soundboard: Web Audio API oscillator synthesis module loaded", prefix: "OK", delay: 160 },
  { text: "Allocated binary cache pipelines for snakes & custom command matrix-rain", prefix: "OK", delay: 100 },
  { text: "Detected viewport bounds; calibrated responsive canvas grid geometry", prefix: "OK", delay: 130 },
  { text: "Synchronized local high scores and remote navigation coordinates", prefix: "OK", delay: 170 },
  { text: "Secure handshake negotiated successfully with visitor client node", prefix: "OK", delay: 150 },
  { text: "Initialized bash command autocomplete mapping on port 3000", prefix: "INFO", color: "text-primary/80", delay: 220 },
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
      <div className="text-primary/70 mb-2 font-bold select-none">[ CHETTIAR-OS RETRO SYSTEM INITIALIZATION ]</div>
      
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
        <div className="pt-3 animate-fade-in">
          <div className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 w-fit rounded-sm border border-primary/20 animate-pulse">
            &gt;&gt; CONSOLE SESSION SECURELY ROOTED &lt;&lt;
          </div>
          
          <div className="pt-3 text-xs">
            Type <span className="font-bold text-primary underline">help</span> to view all commands. Tap on the command chips below if you are on a mobile device.
          </div>
          <div className="h-px bg-primary/20 my-2" />
        </div>
      )}
    </div>
  );
}
