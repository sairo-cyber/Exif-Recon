import React, { useState, useEffect } from 'react';
import { useScrambleText } from '../hooks/useScrambleText';

export function Header() {
  const { displayText } = useScrambleText('EXIF // RECON', 1500);
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
    
    // Add glitch flicker during the scramble
    const timer1 = setTimeout(() => setIsGlitching(true), 400);
    const timer2 = setTimeout(() => setIsGlitching(false), 450);
    const timer3 = setTimeout(() => setIsGlitching(true), 900);
    const timer4 = setTimeout(() => setIsGlitching(false), 950);

    return () => {
      clearTimeout(timer1); clearTimeout(timer2);
      clearTimeout(timer3); clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="w-full px-8 pt-6 pb-4 flex flex-col relative">
      <div className="font-mono text-xs text-green mb-4">
        [SYS] FORENSIC WORKSTATION v4.2.1 // CLASSIFIED<span className="cursor-blink">|</span>
      </div>
      
      <div className="flex items-center gap-6 mb-4">
        <h1 className={`text-5xl md:text-7xl font-mono font-bold tracking-[0.15em] ${isGlitching ? 'text-cyan' : 'text-white'}`}>
          {displayText}
        </h1>
        <div className="w-[1px] h-12 bg-border/50 hidden md:block" />
        <div className="font-mono text-sm text-muted-foreground tracking-[0.3em] uppercase hidden md:block">
          Digital Forensics<br/>Workstation
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#262c33] mt-2" />

      {/* Right side data readouts */}
      <div className="absolute right-8 top-8 flex flex-col items-end gap-1 font-mono text-[10px] text-muted-foreground/50 hidden sm:flex">
        <div>NODE // LOCAL-001</div>
        <div>CLEARANCE // OPERATOR</div>
        <div>DATE // {currentDate}</div>
      </div>
    </div>
  );
}
