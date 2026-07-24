import React, { useState, useEffect } from 'react';

export function SystemBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19));
      setDate(now.toISOString().substring(0, 10));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[24px] bg-[#060709] border-b border-[rgba(38,44,51,0.8)] flex items-center justify-between px-3 flex-shrink-0">
      
      <div className="flex items-center gap-2">
        <div className="w-[5px] h-[5px] bg-[#00ff66] cursor-blink" />
        <span className="font-mono text-[10px] text-[#00ff66] font-bold tracking-widest leading-none">
          EXIF-RECON
        </span>
        <div className="w-[1px] h-[10px] bg-[rgba(38,44,51,0.8)] mx-1" />
        <span className="font-mono text-[10px] text-muted-foreground/40 tracking-widest leading-none hidden sm:block">
          FORENSIC INTELLIGENCE SYSTEM v4.2.1
        </span>
      </div>

      <div className="flex items-center font-mono text-[10px] text-muted-foreground/50 tracking-widest leading-none">
        <span>{time}</span>
        <span className="mx-2">//</span>
        <span>{date}</span>
      </div>

    </div>
  );
}
