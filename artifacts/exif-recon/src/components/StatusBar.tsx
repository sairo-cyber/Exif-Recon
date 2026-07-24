import React from 'react';
import { motion } from 'framer-motion';

interface StatusBarProps {
  filename: string;
  width: number;
  height: number;
  sizeBytes: number;
  fieldCount: number;
  hasGps: boolean;
}

export function StatusBar({ filename, width, height, sizeBytes, fieldCount, hasGps }: StatusBarProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-card border-y border-border py-1.5 px-4 my-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground uppercase"
    >
      <div className="flex items-center gap-2 max-w-[200px] md:max-w-xs truncate">
        <span className="text-cyan/50 text-[10px]">FILE</span>
        <span className="text-white truncate" title={filename}>{filename}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-cyan/50 text-[10px]">RES</span>
        <span className="text-white">{width}x{height}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-cyan/50 text-[10px]">SIZE</span>
        <span className="text-white">{formatSize(sizeBytes)}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-cyan/50 text-[10px]">EXIF FIELDS</span>
        <span className="text-white">{fieldCount}</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-cyan/50 text-[10px]">GPS</span>
        {hasGps ? (
          <span className="text-green flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
            AVAILABLE
          </span>
        ) : (
          <span className="text-destructive">UNAVAILABLE</span>
        )}
      </div>
    </motion.div>
  );
}
