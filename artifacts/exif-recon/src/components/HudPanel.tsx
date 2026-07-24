import React from 'react';
import { motion } from 'framer-motion';

interface HudPanelProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function HudPanel({ title, icon, children, className = '', delay = 0 }: HudPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`bg-card/90 backdrop-blur-sm border border-border rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="bg-background/80 border-b border-border px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-cyan/50" />
          <h3 className="font-mono text-xs font-bold text-muted-foreground tracking-widest uppercase">
            {title}
          </h3>
        </div>
        {icon && <div>{icon}</div>}
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 overflow-auto custom-scrollbar relative group">
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ boxShadow: 'inset 0 0 20px rgba(0,240,255,0.03)' }}
        />
        {children}
      </div>
    </motion.div>
  );
}
