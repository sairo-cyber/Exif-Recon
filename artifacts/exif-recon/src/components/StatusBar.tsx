import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  filename: string;
  width: number;
  height: number;
  sizeBytes: number;
  fieldCount: number;
  hasGps: boolean;
}

export function StatusBar({ filename, width, height, sizeBytes, fieldCount, hasGps }: StatusBarProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full bg-[#08090c] border-y border-[#1a2028] py-1.5 px-4 my-4 flex items-center justify-between font-mono text-[11px] overflow-hidden">
      
      <div className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis mr-4">
        <span className="text-green mr-2 cursor-blink">■</span>
        <span className="text-[rgba(0,240,255,0.4)] mr-2">ACTIVE ACQUISITION</span>
        <span className="text-[rgba(38,44,51,0.8)] mx-2">//</span>
        <span className="text-white truncate max-w-[150px] md:max-w-[300px]" title={filename}>{filename}</span>
        <span className="text-[rgba(38,44,51,0.8)] mx-2">//</span>
        <span className="text-white">{width}×{height}px</span>
        <span className="text-[rgba(38,44,51,0.8)] mx-2 hidden sm:inline">//</span>
        <span className="text-white hidden sm:inline">{formatSize(sizeBytes)}</span>
        <span className="text-[rgba(38,44,51,0.8)] mx-2 hidden md:inline">//</span>
        <span className="text-white hidden md:inline">{fieldCount} EXIF FIELDS</span>
        <span className="text-[rgba(38,44,51,0.8)] mx-2 hidden lg:inline">//</span>
        <span className="text-[rgba(0,240,255,0.4)] mr-2 hidden lg:inline">GPS:</span>
        <span className="hidden lg:inline">
          {hasGps ? (
            <span className="text-green flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green rounded-none opacity-80 cursor-blink" />
              LOCKED
            </span>
          ) : (
            <span className="text-[#ff003c]">NO SIGNAL</span>
          )}
        </span>
      </div>

      <div className="text-muted-foreground/60 whitespace-nowrap flex-shrink-0">
        T+{elapsed}s
      </div>
    </div>
  );
}
