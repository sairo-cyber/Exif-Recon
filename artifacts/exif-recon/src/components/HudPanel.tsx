import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HudPanelProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function HudPanel({ title, children, className = '', delay = 0 }: HudPanelProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19)); // HH:mm:ss
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`relative bg-card rounded-none border border-border flex flex-col ${className}`}
      style={{ boxShadow: '0 0 0 1px rgba(0,240,255,0.05), 0 4px 24px rgba(0,0,0,0.8)' }}
    >
      {/* Corner marks */}
      <div className="absolute -top-[2px] -left-[2px] w-1.5 h-1.5 border-t-[3px] border-l-[3px] border-[rgba(0,240,255,0.4)] pointer-events-none z-20" />
      <div className="absolute -top-[2px] -right-[2px] w-1.5 h-1.5 border-t-[3px] border-r-[3px] border-[rgba(0,240,255,0.4)] pointer-events-none z-20" />
      <div className="absolute -bottom-[2px] -left-[2px] w-1.5 h-1.5 border-b-[3px] border-l-[3px] border-[rgba(0,240,255,0.4)] pointer-events-none z-20" />
      <div className="absolute -bottom-[2px] -right-[2px] w-1.5 h-1.5 border-b-[3px] border-r-[3px] border-[rgba(0,240,255,0.4)] pointer-events-none z-20" />

      {/* Animated Top Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.8) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'sweep-border 3s infinite linear'
        }}
      />

      {/* Header */}
      <div className="bg-[#0d1117] border-b border-border px-3 py-2 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-[4px] h-[4px] bg-[#ff003c] opacity-30" />
            <div className="w-[4px] h-[4px] bg-[#eab308] opacity-30" />
            <div className="w-[4px] h-[4px] bg-[#22c55e] opacity-30" />
          </div>
          <div className="w-[1px] h-3 bg-border/50" />
          <h3 className="font-mono text-[11px] font-bold text-muted-foreground tracking-[0.2em] uppercase">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted-foreground/60">{time}</span>
          <span className="font-mono text-[9px] bg-green/10 text-green border border-green/20 px-1 py-0.5 rounded-sm">SYS</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 overflow-auto custom-scrollbar relative">
        {children}
      </div>
    </motion.div>
  );
}
