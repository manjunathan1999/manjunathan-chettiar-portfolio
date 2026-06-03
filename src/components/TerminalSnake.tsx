import { useState, useEffect, useRef } from 'react';
import { audioSystem } from '@/src/lib/audio';
import { Gamepad2, Award, SkipBack, Play, Pause } from 'lucide-react';

interface TerminalSnakeProps {
  theme: 'default' | 'cyber-green' | 'amber-decay' | 'monochrome';
  onExit: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

export default function TerminalSnake({ theme, onExit }: TerminalSnakeProps) {
  // Game dimensions
  const GRID_ROWS = 12;
  const GRID_COLS = 16;

  // Local storage name for persistence
  const HIGH_SCORE_KEY = 'manju_retro_snake_high_score';

  // Game states
  const [snake, setSnake] = useState<Point[]>([
    { x: 5, y: 5 },
    { x: 5, y: 6 },
    { x: 5, y: 7 },
  ]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Point>({ x: 10, y: 3 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Direction update queue to prevent fast double-taps causing self-collisions
  const directionRef = useRef<Direction>('UP');
  const nextDirectionRef = useRef<Direction>('UP');

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Set direction ref helper
  const changeDirection = (newDir: Direction) => {
    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opposites[newDir] !== directionRef.current) {
      nextDirectionRef.current = newDir;
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying && !isGameOver && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setIsPlaying(true);
        try { audioSystem.playClick(); } catch (err) {}
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case 'Escape':
          e.preventDefault();
          onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, onExit]);

  // Generate random food coordinate that is not on the snake body
  const generateFood = (currentSnake: Point[]) => {
    let newFood: Point;
    let isOnSnake = true;
    while (isOnSnake) {
      const randX = Math.floor(Math.random() * GRID_COLS);
      const randY = Math.floor(Math.random() * GRID_ROWS);
      newFood = { x: randX, y: randY };
      isOnSnake = currentSnake.some(part => part.x === newFood.x && part.y === newFood.y);
    }
    setFood(newFood!);
  };

  // Main game tick loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const gameTick = () => {
      setSnake(prevSnake => {
        // Sync our reference pointer
        directionRef.current = nextDirectionRef.current;
        const currentDir = directionRef.current;
        
        const head = prevSnake[0];
        let newHead: Point;

        switch (currentDir) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Boundary or self-collision checks
        const hitWall = newHead.x < 0 || newHead.x >= GRID_COLS || newHead.y < 0 || newHead.y >= GRID_ROWS;
        const hitSelf = prevSnake.some(part => part.x === newHead.x && part.y === newHead.y);

        if (hitWall || hitSelf) {
          setIsGameOver(true);
          setIsPlaying(false);
          try { audioSystem.playError(); } catch (err) {}
          return prevSnake; // freeze
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if food was eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          try { audioSystem.playSuccess(); } catch (err) {}
          setScore(prevScore => {
            const nextScore = prevScore + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem(HIGH_SCORE_KEY, nextScore.toString());
            }
            return nextScore;
          });
          generateFood(prevSnake);
        } else {
          // Remove tail if didn't eat
          newSnake.pop();
        }

        // Sync direction state
        setDirection(currentDir);

        return newSnake;
      });
    };

    const intervalId = setInterval(gameTick, 140);
    return () => clearInterval(intervalId);
  }, [isPlaying, isGameOver, food, highScore]);

  // Restart handler
  const resetGame = () => {
    try { audioSystem.playClick(); } catch (err) {}
    setSnake([
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
    ]);
    directionRef.current = 'UP';
    nextDirectionRef.current = 'UP';
    setDirection('UP');
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood({ x: 9, y: 3 });
  };

  // Determine visual accent based on theme
  const getThemeAccents = () => {
    switch (theme) {
      case 'cyber-green':
        return {
          textColor: 'text-[#00FF00]',
          borderColor: 'border-[#00FF00]',
          bgBoard: 'bg-[#030903]',
          gridColor: 'text-[#00FF00]/10',
          headColor: 'bg-[#00FF00] border border-white',
          bodyColor: 'bg-[#00FF00]/60 border border-[#00FF00]',
          foodColor: 'text-white animate-pulse',
          btnStyle: 'border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10 active:bg-[#00FF00] active:text-black',
        };
      case 'amber-decay':
        return {
          textColor: 'text-[#FFB000]',
          borderColor: 'border-[#FFB000]',
          bgBoard: 'bg-[#0d0700]',
          gridColor: 'text-[#FFB000]/10',
          headColor: 'bg-[#FFB000] border border-[#FFD050]',
          bodyColor: 'bg-[#FFB000]/60 border border-[#FFB000]',
          foodColor: 'text-white animate-pulse',
          btnStyle: 'border-[#FFB000] text-[#FFB000] hover:bg-[#FFB000]/10 active:bg-[#FFB000] active:text-black',
        };
      case 'monochrome':
      default:
        // Use high-contrast terminal styling as default inside raw bg-black cabinet
        return {
          textColor: 'text-white',
          borderColor: 'border-white',
          bgBoard: 'bg-zinc-950',
          gridColor: 'text-zinc-800',
          headColor: 'bg-white border border-zinc-300',
          bodyColor: 'bg-zinc-500 border border-zinc-400',
          foodColor: 'text-white animate-pulse',
          btnStyle: 'border-white text-white hover:bg-zinc-800 active:bg-white active:text-black',
        };
    }
  };

  const css = getThemeAccents();

  // Render direction buttons for tactile mobile gaming
  const MobileControllerButton = ({ dir, label }: { dir: Direction, label: string }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          changeDirection(dir);
        }}
        className={`w-10 h-10 border border-primary font-bold text-xs select-none active:scale-95 transition-transform flex items-center justify-center cursor-pointer ${css.btnStyle}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md select-none overflow-y-auto">
      {/* CRT scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%),_linear-gradient(90deg,_rgba(0,255,0,0.03),_rgba(255,0,255,0.01),_rgba(0,0,255,0.03))] bg-[size:100%_4px,_6px_100%] opacity-40 z-40" />

      {/* Retro arcade cabinet frame */}
      <div className={`relative w-full max-w-2xl border-4 ${css.borderColor} bg-black p-5 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col font-mono justify-between z-10 ${css.textColor} relative`}>
        {/* Glowing border simulation on active themes */}
        <div className={`absolute inset-0 -m-1 border-2 ${css.borderColor} opacity-30 animate-pulse pointer-events-none`} />

        {/* Game Header with close option */}
        <div className={`flex justify-between items-center pb-3 border-b border-dashed ${theme === 'cyber-green' ? 'border-[#00FF00]/30' : theme === 'amber-decay' ? 'border-[#FFB000]/30' : 'border-white/20'} shrink-0`}>
          <div className="flex items-center gap-1.5 font-bold uppercase text-xs sm:text-sm">
            <Gamepad2 className="size-4 shrink-0 animate-bounce" />
            <span>SNAKE_PORTABLE_EMULATOR.V3</span>
          </div>
          
          <button
            onClick={() => {
              try { audioSystem.playClick(); } catch (e) {}
              onExit();
            }}
            className={`px-3 py-1 border text-[10px] font-bold uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer bg-black z-50 ${css.btnStyle}`}
            aria-label="Exit Game Console"
          >
            ✕ EXIT GAME [ESC]
          </button>
        </div>

        {/* Score & Achievements dashboard banner */}
        <div className={`flex justify-between items-center py-2 px-2 mt-2 border rounded-sm ${theme === 'cyber-green' ? 'bg-[#00FF00]/5 border-[#00FF00]/10' : theme === 'amber-decay' ? 'bg-[#FFB000]/5 border-[#FFB000]/10' : 'bg-white/5 border-white/10'}`}>
          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
            <Award className="size-4 text-yellow-500" />
            <span>CORE SCORE:</span>
            <span className="font-black text-sm uppercase px-1">{score}</span>
          </div>
          <div className={`text-xs uppercase font-bold ${theme === 'cyber-green' ? 'text-[#00FF00]/70' : theme === 'amber-decay' ? 'text-[#FFB000]/70' : 'text-zinc-400'}`}>
            HIGH_RECORD: <span className="font-semibold text-yellow-500">{highScore}</span>
          </div>
        </div>

        {/* Middle arena area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 items-center justify-center py-4 my-auto">
          
          {/* Board Arena representing GRID_ROWS x GRID_COLS */}
          <div className="md:col-span-7 flex justify-center items-center">
            <div 
              className={`relative border-2 ${css.borderColor} ${css.bgBoard} p-1.5 grid gap-[1px] shadow-inner`}
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: '400px',
                aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`
              }}
            >
              {/* Generate cells */}
              {Array.from({ length: GRID_ROWS }).map((_, rIdx) => 
                Array.from({ length: GRID_COLS }).map((_, cIdx) => {
                  const isHead = snake[0].x === cIdx && snake[0].y === rIdx;
                  const bodyIndex = snake.findIndex((part, idx) => idx > 0 && part.x === cIdx && part.y === rIdx);
                  const isBody = bodyIndex !== -1;
                  const isFood = food.x === cIdx && food.y === rIdx;

                  if (isHead) {
                    return (
                      <div key={`${rIdx}-${cIdx}`} className={`rounded-[2px] ${css.headColor} shadow-sm`} />
                    );
                  } else if (isBody) {
                    return (
                      <div key={`${rIdx}-${cIdx}`} className={`rounded-[2px] ${css.bodyColor}`} />
                    );
                  } else if (isFood) {
                    return (
                      <div key={`${rIdx}-${cIdx}`} className="flex justify-center items-center font-bold text-sm select-none">
                        <span className={`${css.foodColor} text-xs font-bold`}>★</span>
                      </div>
                    );
                  } else {
                    return (
                      <div key={`${rIdx}-${cIdx}`} className={`flex justify-center items-center text-[7px] ${css.gridColor} select-none`}>
                        ·
                      </div>
                    );
                  }
                })
              )}

              {/* Game overlays */}
              {!isPlaying && !isGameOver && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4 z-20">
                  <p className="text-sm font-black uppercase text-white animate-bounce tracking-widest">ARCADE SYS READY</p>
                  <button
                    onClick={resetGame}
                    className={`mt-3.5 px-5 py-2 border-2 text-xs font-extrabold uppercase bg-black cursor-pointer shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5 ${css.btnStyle}`}
                  >
                    <Play className="size-4 shrink-0" />
                    <span>LAUNCH RENDER ENGINE</span>
                  </button>
                  <p className="text-[9px] text-muted-foreground mt-3 uppercase font-medium">Use computer keypads (WASD / Arrows) or touch buttons</p>
                </div>
              )}

              {isGameOver && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4 z-20">
                  <p className="text-base font-black text-red-500 uppercase tracking-widest animate-pulse">COLLISION CAUGHT</p>
                  <p className="text-xs mt-1.5 text-white uppercase font-bold">FINAL SECTOR SCORE: <span className="text-base font-black text-yellow-500">{score}</span></p>
                  <button
                    onClick={resetGame}
                    className={`mt-3.5 px-5 py-2 border-2 text-xs font-extrabold uppercase bg-black cursor-pointer shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5 ${css.btnStyle}`}
                  >
                    <Play className="size-4 shrink-0" />
                    <span>TRY AGAIN</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controller HUD and quick action board */}
          <div className="md:col-span-5 flex flex-col justify-between h-full py-1 gap-4">
            {/* HUD instructions */}
            <div className={`hidden sm:block text-[10px] uppercase leading-tight space-y-1 p-2.5 border rounded-sm ${theme === 'cyber-green' ? 'bg-[#00FF00]/5 border-[#00FF00]/15 text-[#00FF00]/80' : theme === 'amber-decay' ? 'bg-[#FFB000]/5 border-[#FFB000]/15 text-[#FFB000]/80' : 'bg-white/5 border-white/10 text-zinc-300'}`}>
              <p className={`font-bold ${theme === 'cyber-green' ? 'text-[#00FF00]' : theme === 'amber-decay' ? 'text-[#FFB000]' : 'text-white'}`}>=== GAMEPLAY MAP ===</p>
              <p>• Steer away from boundary walls</p>
              <p>• Avoid colliding with own body</p>
              <p>• Earn 10pts per star consumed</p>
              <p>• Sound synthesis: active</p>
            </div>

            {/* Retro styled D-Pad controls for mobile and click-tapping ease */}
            <div className="flex flex-col items-center select-none shrink-0">
              {/* UP row */}
              <div className="mb-1">
                <MobileControllerButton dir="UP" label="▲" />
              </div>
              {/* L / R row */}
              <div className="flex gap-3">
                <MobileControllerButton dir="LEFT" label="◀" />
                <div className="w-10 h-10 flex items-center justify-center text-base cursor-default select-none">
                  🕹
                </div>
                <MobileControllerButton dir="RIGHT" label="▶" />
              </div>
              {/* DOWN row */}
              <div className="mt-1">
                <MobileControllerButton dir="DOWN" label="▼" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer info strip */}
        <div className={`border-t pt-2 flex justify-between items-center text-[10px] mt-2 shrink-0 ${theme === 'cyber-green' ? 'border-[#00FF00]/20 text-[#00FF00]/60' : theme === 'amber-decay' ? 'border-[#FFB000]/20 text-[#FFB000]/60' : 'border-white/10 text-zinc-500'}`}>
          <span>PORT: CHETTIAR-CRT_TTY // CRT80</span>
          <span className="flex items-center gap-1 uppercase">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-ping" />
            Active Mode
          </span>
        </div>
      </div>
    </div>
  );
}
