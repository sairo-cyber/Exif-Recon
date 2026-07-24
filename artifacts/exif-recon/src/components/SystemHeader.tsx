import React, { useState, useEffect } from 'react';
import { useScrambleText } from '../hooks/useScrambleText';

interface SystemHeaderProps {
  onReset: () => void;
  hasFile: boolean;
}

export function SystemHeader({ onReset, hasFile }: SystemHeaderProps) {
  const { displayText } = useScrambleText('EXIF // RECON', 1500);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setUptime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-[56px] bg-[#08090c] border-b border-[rgba(38,44,51,0.6)] flex items-center px-4 flex-shrink-0">
      
      <div className="flex items-baseline gap-4">
        <h1 className="font-mono font-bold text-2xl tracking-[0.2em] text-white m-0 leading-none">
          {displayText}
        </h1>
        <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.25em] uppercase hidden md:inline-block">
          DIGITAL FORENSICS WORKSTATION
        </span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {hasFile && (
          <button 
            onClick={onReset}
            className="font-mono text-[10px] text-muted-foreground/60 hover:text-[#ff003c] cursor-pointer border border-[#262c33] hover:border-[#ff003c]/50 px-3 py-1 transition-colors bg-transparent rounded-none outline-none focus:outline-none"
          >
            [ CLEAR TARGET ]
          </button>
        )}
        <div className="font-mono text-[10px] text-muted-foreground/30 hidden sm:block">
          SYS T+{uptime}s
        </div>
      </div>

    </div>
  );
}
