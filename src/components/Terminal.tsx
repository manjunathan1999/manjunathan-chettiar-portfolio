import React, { useState, useEffect, useRef } from 'react';
import { RESUME_DATA } from '@/src/constants';
import { Terminal as TerminalIcon, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { audioSystem } from '@/src/lib/audio';
import TerminalMatrixOverlay from '@/src/components/TerminalMatrixOverlay';
import TerminalSnake from '@/src/components/TerminalSnake';
import BootLoader from '@/src/components/BootLoader';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

const terminalThemes = {
  default: {
    container: 'bg-background text-primary border-neo shadow-neo',
    titleBar: 'bg-primary text-primary-foreground border-b-2 border-primary',
    titleText: 'text-primary-foreground',
    inputLine: 'text-primary',
    ghostSuggestion: 'text-primary/30',
    terminalText: 'text-primary',
    mutedText: 'text-muted-foreground',
    quickChip: 'border-primary bg-background text-primary active:bg-primary active:text-primary-foreground',
    activeChip: 'bg-primary text-primary-foreground',
    clearChip: 'border-destructive text-destructive active:bg-destructive active:text-destructive-foreground hover:bg-destructive/10',
    indicatorBorder: 'border-primary-foreground',
  },
  'cyber-green': {
    container: 'bg-[rgba(5,15,5,1)] text-[#00FF00] border-2 border-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.35)]',
    titleBar: 'bg-[#00FF00] text-black border-b border-[#00FF00]',
    titleText: 'text-black font-extrabold',
    inputLine: 'text-[#00FF00]',
    ghostSuggestion: 'text-[#00FF00]/30',
    terminalText: 'text-[#00FF00]',
    mutedText: 'text-[#00FF00]/60',
    quickChip: 'border-[#00FF00] bg-black text-[#00FF00] active:bg-[#00FF00] active:text-black',
    activeChip: 'bg-[#00FF00] text-black',
    clearChip: 'border-red-500 text-red-500 active:bg-red-500 active:text-black hover:bg-red-500/10',
    indicatorBorder: 'border-black',
  },
  'amber-decay': {
    container: 'bg-[rgba(15,10,0,1)] text-[#FFB000] border-2 border-[#FFB000] shadow-[0_0_15px_rgba(255,176,0,0.35)]',
    titleBar: 'bg-[#FFB000] text-black border-b border-[#FFB000]',
    titleText: 'text-black font-extrabold',
    inputLine: 'text-[#FFB000]',
    ghostSuggestion: 'text-[#FFB000]/30',
    terminalText: 'text-[#FFB000]',
    mutedText: 'text-[#FFB000]/60',
    quickChip: 'border-[#FFB000] bg-[rgba(15,10,0,1)] text-[#FFB000] active:bg-[#FFB000] active:text-black',
    activeChip: 'bg-[#FFB000] text-black',
    clearChip: 'border-amber-600 text-amber-600 active:bg-[#FFB000]/20 hover:bg-amber-600/10',
    indicatorBorder: 'border-black',
  },
  'monochrome': {
    container: 'bg-zinc-950 text-white border-2 border-white shadow-[4px_4px_0px_white]',
    titleBar: 'bg-white text-black border-b border-white',
    titleText: 'text-black font-extrabold',
    inputLine: 'text-white',
    ghostSuggestion: 'text-white/30',
    terminalText: 'text-white',
    mutedText: 'text-zinc-400',
    quickChip: 'border-white bg-zinc-950 text-white active:bg-white active:text-black',
    activeChip: 'bg-white text-black',
    clearChip: 'border-zinc-500 text-zinc-400 active:bg-zinc-800 hover:bg-zinc-800/10',
    indicatorBorder: 'border-black',
  }
};

export default function Terminal() {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isMuted, setIsMuted] = useState(audioSystem.getIsMuted());

  // Advanced terminal history and shell states
  const [executedCmds, setExecutedCmds] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'default' | 'cyber-green' | 'amber-decay' | 'monochrome'>('default');
  const [terminalMode, setTerminalMode] = useState<'normal' | 'matrix' | 'snake'>('normal');
  const [matrixCustomWord, setMatrixCustomWord] = useState<string | undefined>(undefined);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 30);
    };

    // Add default welcome item containing the dynamic boot loader
    setHistory([
      { 
        command: '', 
        output: (
          <BootLoader 
            onLineAdded={handleScroll}
            onComplete={() => {
              setIsBooting(false);
              handleScroll();
            }}
          />
        )
      }
    ]);

    const handleMuteChange = () => {
      setIsMuted(audioSystem.getIsMuted());
    };
    window.addEventListener('audio-mute-toggle', handleMuteChange);
    return () => {
      window.removeEventListener('audio-mute-toggle', handleMuteChange);
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of terminal content on update
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmedVal = cmd.trim();
    if (trimmedVal) {
      setExecutedCmds((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === trimmedVal) {
          return prev;
        }
        return [...prev, trimmedVal];
      });
    }
    setHistoryPointer(-1);

    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) {
      setHistory((prev) => [
        ...prev,
        { command: '', output: null }
      ]);
      setInputVal('');
      audioSystem.playClick();
      return;
    }
    const args = trimmed.split(' ');
    const primaryCmd = args[0];

    let output: React.ReactNode = null;
    let isError = false;

    switch (primaryCmd) {
      case 'clear':
        setHistory([]);
        setInputVal('');
        audioSystem.playClick();
        return;

      case 'help':
        output = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-mono my-1">
            <div><span className="font-bold text-primary">whoami</span> - Details about my role & background</div>
            <div><span className="font-bold text-primary">skills</span> - Technical skills categorized</div>
            <div><span className="font-bold text-primary">projects</span> - Showcase of building experiences</div>
            <div><span className="font-bold text-primary">experience</span> - Work history breakdown</div>
            <div><span className="font-bold text-primary">theme [style]</span> - Cycle/set terminal retro color themes</div>
            <div><span className="font-bold text-primary">matrix</span> - Cascading binary rain console sequence</div>
            <div><span className="font-bold text-primary">game</span> - Playable local terminal snake simulation</div>
            <div><span className="font-bold text-primary">contact</span> - Direct channels to get in touch</div>
            <div><span className="font-bold text-primary">clear</span> - Push clean lines to stack</div>
            <div><span className="font-bold text-primary">github [user]</span> - Simulated repo contribution inspection</div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-2 text-xs sm:text-sm font-mono leading-relaxed">
            <p className="text-primary font-bold text-base">{RESUME_DATA.name}</p>
            <p className="text-muted-foreground font-semibold">{RESUME_DATA.role}</p>
            <p className="h-px bg-primary/20 my-1" />
            <p>{RESUME_DATA.summary}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-3 text-xs sm:text-sm font-mono my-2 text-muted-foreground">
            <div>
              <p className="text-primary font-bold">[ PROGRAMMING LANGUAGES ]</p>
              <p className="pl-4">{RESUME_DATA.skills.languages.join(' • ')}</p>
            </div>
            <div>
              <p className="text-primary font-bold">[ FRAMEWORKS & TOOLS ]</p>
              <p className="pl-4">{RESUME_DATA.skills.frameworks.join(' • ')}</p>
            </div>
            <div>
              <p className="text-primary font-bold">[ DATABASES ]</p>
              <p className="pl-4">{RESUME_DATA.skills.databases.join(' • ')}</p>
            </div>
            <div>
              <p className="text-primary font-bold">[ OTHER TECH & DEVOPS ]</p>
              <p className="pl-4">{[...RESUME_DATA.skills.libraries, ...RESUME_DATA.skills.tools, ...RESUME_DATA.skills.devops].join(' • ')}</p>
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-4 text-xs sm:text-sm font-mono my-2">
            {RESUME_DATA.projects.map((proj, idx) => (
              <div key={idx} className="border-l-2 border-primary pl-4 py-1">
                <p className="text-primary font-bold uppercase">{idx + 1}. {proj.title}</p>
                <p className="text-muted-foreground my-1">{proj.description}</p>
                <ul className="list-disc list-inside text-xs select-none pl-2 opacity-80">
                  {proj.details.map((detail, dIdx) => (
                    <li key={dIdx}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-4 text-xs sm:text-sm font-mono my-2">
            {RESUME_DATA.experience.map((exp, idx) => (
              <div key={idx} className="border-l-2 border-dotted border-primary pl-4 py-1">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <p className="text-primary font-bold">{exp.title} @ {exp.company}</p>
                  <span className="text-xs opacity-70 font-semibold">{exp.period}</span>
                </div>
                <p className="text-muted-foreground text-xs italic mb-2">{exp.location}</p>
                <ul className="space-y-1.5 pl-2">
                  {exp.achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary shrink-0">&gt;</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-2 text-xs sm:text-sm font-mono my-2">
            <div><span className="text-muted-foreground font-semibold">EMAIL:</span> <a href={`mailto:${RESUME_DATA.email}`} className="text-primary underline hover:opacity-80">{RESUME_DATA.email}</a></div>
            <div><span className="text-muted-foreground font-semibold">PHONE:</span> <span className="text-primary">{RESUME_DATA.phone}</span></div>
            <div><span className="text-muted-foreground font-semibold">LINKEDIN:</span> <a href={RESUME_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">{RESUME_DATA.linkedin}</a></div>
            <div><span className="text-muted-foreground font-semibold">CURRENT_LOCATION:</span> <span className="text-primary">Bengaluru, India</span></div>
          </div>
        );
        break;

      case 'github':
        const username = args[1] || 'manjunathanchettiar2908';
        output = (
          <div className="space-y-2 text-xs sm:text-sm font-mono my-2 p-2 bg-secondary border border-primary/20">
            <p className="text-primary font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-primary animate-pulse" />
              RETRIEVING META FOR: github.com/{username}...
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="opacity-70">Repositories:</span> 24 public</div>
              <div><span className="opacity-70">Followers:</span> 82 engineers</div>
              <div><span className="opacity-70">Contributions (YTD):</span> 418 commits</div>
              <div><span className="opacity-70">Main Stack:</span> Python, Go, Docker</div>
            </div>
            <p className="text-[10px] text-muted-foreground italic mt-2">Fetched using localized cache configuration.</p>
          </div>
        );
        break;

      case 'theme':
        const selectedTheme = args[1];
        if (selectedTheme === 'cyber-green' || selectedTheme === 'amber-decay' || selectedTheme === 'monochrome' || selectedTheme === 'default') {
          setActiveTheme(selectedTheme);
          output = (
            <div className="space-y-1 text-xs sm:text-sm font-mono my-1">
              <p>⚡ Terminal system layout color adjustments adjusted successfully to: <span className="font-extrabold underline uppercase text-primary">{selectedTheme}</span></p>
              <p className="text-[10px] text-muted-foreground">Spectrum filters recalibrated for retro OS container frame.</p>
            </div>
          );
        } else {
          output = (
            <div className="space-y-2 text-xs sm:text-sm font-mono my-1">
              <p className="text-primary font-bold">[ RETRO THEME COMMAND PANEL ]</p>
              <p>Type <span className="font-bold">theme &lt;name&gt;</span> to customize this terminal's appearance:</p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-muted-foreground text-xs">
                <li><span className="font-bold text-primary">theme default</span> - Reset to standard portfolio style</li>
                <li><span className="font-bold text-primary">theme cyber-green</span> - Classic lime-phosphor retro screen theme</li>
                <li><span className="font-bold text-primary">theme amber-decay</span> - Luminous orange CRT amber decay theme</li>
                <li><span className="font-bold text-primary">theme monochrome</span> - High-contrast monochromatic black/white contrast</li>
              </ul>
            </div>
          );
        }
        break;

      case 'matrix':
      case 'rain':
        const wordParam = args[1];
        setMatrixCustomWord(wordParam || undefined);
        setTimeout(() => {
          setTerminalMode('matrix');
        }, 120);
        output = (
          <div className="text-xs sm:text-sm font-mono my-1">
            <span className="animate-pulse">
              Accessing cascade buffer; launching digital rain sequences{wordParam ? ` mapped directly to the signature "${wordParam}"` : ''}...
            </span>
          </div>
        );
        break;

      case 'game':
      case 'snake':
      case 'play':
        setTimeout(() => {
          setTerminalMode('snake');
        }, 120);
        output = (
          <div className="text-xs sm:text-sm font-mono my-1 animate-pulse">
            <span>Loading retroactive 8-bit snake portable emulator logic bundle...</span>
          </div>
        );
        break;

      default:
        isError = true;
        output = (
          <div className="text-destructive font-mono text-xs sm:text-sm">
            Command not found: <span className="underline">{primaryCmd}</span>. Type <span className="font-bold">help</span> to list commands.
          </div>
        );
    }

    setHistory((prev) => [
      ...prev,
      { command: cmd, output }
    ]);
    setInputVal('');

    if (isError) {
      audioSystem.playError();
    } else {
      audioSystem.playSuccess();
    }
  };

  // Suggestion autocomplete engine
  const COMMANDS = ['help', 'whoami', 'skills', 'projects', 'experience', 'contact', 'github', 'theme', 'matrix', 'game', 'snake', 'clear'];
  const trimmedInput = inputVal.trim().toLowerCase();
  const matchedCmd = COMMANDS.find((c) => c.startsWith(trimmedInput));
  const suggestion = matchedCmd && trimmedInput && matchedCmd !== trimmedInput
    ? matchedCmd.slice(trimmedInput.length)
    : '';

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTyping) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Tab' || (e.key === 'ArrowRight' && inputRef.current?.selectionStart === inputVal.length)) {
      if (suggestion) {
        e.preventDefault();
        setInputVal(inputVal + suggestion);
        try {
          audioSystem.playKeystroke();
        } catch (err) {}
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (executedCmds.length > 0) {
        const nextIndex = historyPointer + 1;
        if (nextIndex < executedCmds.length) {
          setHistoryPointer(nextIndex);
          setInputVal(executedCmds[executedCmds.length - 1 - nextIndex]);
          try {
            audioSystem.playKeystroke();
          } catch (err) {}
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyPointer - 1;
      if (nextIndex >= 0) {
        setHistoryPointer(nextIndex);
        setInputVal(executedCmds[executedCmds.length - 1 - nextIndex]);
        try {
          audioSystem.playKeystroke();
        } catch (err) {}
      } else {
        setHistoryPointer(-1);
        setInputVal('');
        try {
          audioSystem.playKeystroke();
        } catch (err) {}
      }
    }
  };

  const handleQuickCommand = (cmd: string) => {
    if (isTyping) return;
    setIsTyping(true);
    setInputVal('');
    
    let currentText = '';
    let charIdx = 0;
    
    const interval = setInterval(() => {
      if (charIdx < cmd.length) {
        currentText += cmd[charIdx];
        setInputVal(currentText);
        try {
          audioSystem.playKeystroke();
        } catch (err) {}
        charIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsTyping(false);
          executeCommand(cmd);
        }, 150);
      }
    }, 60);
  };

  // Refocus input upon boot completion
  useEffect(() => {
    if (!isBooting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isBooting]);

  // Handle selective scrolling so hover-scrolling stays in the terminal
  // unless the terminal is at the very bottom, in which case the app can scroll down.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const delta = e.deltaY;

      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      const isAtTop = scrollTop <= 0;

      if (delta > 0) {
        // Scrolling DOWN
        if (!isAtBottom) {
          // Keep scroll within terminal, prevent event bubble to full app Lenis scroll
          e.stopPropagation();
        }
      } else if (delta < 0) {
        // Scrolling UP
        if (!isAtTop) {
          // Keep scroll within terminal, prevent event bubble
          e.stopPropagation();
        } else {
          // At the very top of terminal, scrolling UP. Prevent full app from scrolling up too.
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY; // positive maps to scrolling down

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      const isAtTop = scrollTop <= 0;

      if (deltaY > 0) {
        // Scrolling DOWN (swipe up)
        if (!isAtBottom) {
          e.stopPropagation();
        }
      } else if (deltaY < 0) {
        // Scrolling UP (swipe down)
        if (!isAtTop) {
          e.stopPropagation();
        } else {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isBooting, history]);

  const t = terminalThemes[activeTheme];
  const themeClass = activeTheme === 'cyber-green'
    ? 'terminal-theme-cyber-green'
    : activeTheme === 'amber-decay'
    ? 'terminal-theme-amber-decay'
    : activeTheme === 'monochrome'
    ? 'terminal-theme-monochrome'
    : 'terminal-theme-default';

  return (
    <div 
      className={`${t.container} ${themeClass} p-4 w-full h-[450px] flex flex-col font-mono cursor-text relative select-text transition-all duration-300 overflow-hidden`}
      onClick={handleTerminalClick}
      id="terminal-container"
    >
      {/* Title Bar styling */}
      <div className={`absolute top-0 left-0 right-0 h-8 ${t.titleBar} flex items-center justify-between px-3 select-none`}>
        <div className={`flex items-center gap-1.5 font-bold tracking-tight ${t.titleText}`}>
          <TerminalIcon className="size-4 shrink-0 animate-pulse" />
          <span className="text-xs font-bold font-mono">manjunathan@chettiar-os:~</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`size-2 rounded-full border ${t.indicatorBorder} opacity-40 inline-block`} />
          <span className={`size-2 rounded-full border ${t.indicatorBorder} opacity-40 inline-block`} />
          <span className={`size-2 rounded-full border ${t.indicatorBorder} opacity-40 inline-block`} />
        </div>
      </div>

      {/* Terminal Area */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto mt-8 pr-1 space-y-4 select-text scrollbar-none scroll-smooth mb-1"
      >
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {item.command && (
              <div className={`flex items-center gap-2 font-bold ${t.terminalText} font-mono text-xs sm:text-sm`}>
                <span className={t.mutedText}>visitor@chettiar-os:~$</span>
                <span>{item.command}</span>
              </div>
            )}
            <div className={t.terminalText}>{item.output}</div>
          </div>
        ))}

        {/* Current Active Input Line */}
        {!isBooting && (
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold pt-1 animate-fade-in">
            <span className={`${t.mutedText} shrink-0 select-none`}>visitor@chettiar-os:~$</span>
            <div className="flex-1 flex items-center relative">
              {/* Autosuggestion Ghost Suffix */}
              {suggestion && (
                <div className={`absolute left-0 top-0 pointer-events-none select-none ${t.terminalText} font-mono text-xs sm:text-sm font-bold flex items-center h-full w-full whitespace-pre`}>
                  <span className="text-transparent">{inputVal}</span>
                  <span className={t.ghostSuggestion}>{suggestion}</span>
                  <span className="text-[9px] font-mono font-bold bg-primary/10 text-primary/70 border border-primary/20 px-1 py-0.25 rounded ml-2 scale-90 select-none pointer-events-none animate-pulse">
                    [Tab]
                  </span>
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                disabled={isTyping}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  try {
                    audioSystem.playKeystroke();
                  } catch (err) {}
                }}
                onKeyDown={handleKeyPress}
                className={`w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none p-0 ${t.terminalText} font-mono select-text relative z-10 disabled:opacity-85`}
                autoFocus
                autoCapitalize="none"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        )}
      </div>

      {/* Terminal Quick Tap Chips */}
      {!isBooting && (
        <div className="border-t border-primary/20 pt-2 flex flex-wrap gap-1.5 select-none z-10 shrink-0">
          <span className={`text-[10px] uppercase font-bold mr-1.5 self-center ${t.mutedText}`}>Quick commands:</span>
          {['whoami', 'skills', 'projects', 'theme', 'matrix', 'game', 'experience', 'contact'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickCommand(cmd);
              }}
              className={`text-[10px] sm:text-xs font-mono font-bold border px-2 py-0.5 focus:outline-none focus:ring-0 transition-colors cursor-pointer ${t.quickChip}`}
            >
              {cmd}
            </button>
          ))}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              audioSystem.playClick();
              setHistory([]);
            }}
            className={`text-[10px] sm:text-xs font-mono font-bold border border-dashed px-2 py-0.5 focus:outline-none focus:ring-0 transition-colors ml-auto cursor-pointer ${t.clearChip}`}
          >
            [clear]
          </button>
        </div>
      )}

      {/* Overlays for Matrix Rain or Snake Game */}
      {terminalMode === 'matrix' && (
        <TerminalMatrixOverlay 
          theme={activeTheme} 
          customWord={matrixCustomWord}
          onExit={() => {
            setTerminalMode('normal');
            // Append a finished block to command history as output of previous execution
            setHistory(prev => [
              ...prev,
              { command: '', output: <div className="text-xs italic opacity-85 mt-1">&gt; Matrix stream simulation completed successfully{matrixCustomWord ? ` for custom name "${matrixCustomWord}"` : ''}.</div> }
            ]);
            setTimeout(() => { if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight; }, 60);
          }} 
        />
      )}

      {terminalMode === 'snake' && (
        <TerminalSnake 
          theme={activeTheme} 
          onExit={() => {
            setTerminalMode('normal');
            // Append a finished block to command history as output of previous execution
            setHistory(prev => [
              ...prev,
              { command: '', output: <div className="text-xs italic opacity-85 mt-1">&gt; Interactive emulator session closed safely.</div> }
            ]);
            setTimeout(() => { if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight; }, 60);
          }} 
        />
      )}
    </div>
  );
}
