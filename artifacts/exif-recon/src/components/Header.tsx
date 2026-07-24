import React from 'react';
import { motion } from 'framer-motion';
import { useScrambleText } from '../hooks/useScrambleText';
import { ShieldAlert } from 'lucide-react';

export function Header() {
  const { displayText } = useScrambleText('EXIF // RECON', 1500);

  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-2"
      >
        <ShieldAlert className="w-8 h-8 text-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
        <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-[0.2em] text-white">
          {displayText}
        </h1>
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="text-muted-foreground font-mono text-sm tracking-widest uppercase mt-2"
      >
        Digital Forensics Workstation
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
        className="mt-6 flex items-center gap-3 text-xs font-mono text-green/80 bg-green/5 px-4 py-1.5 rounded border border-green/20"
      >
        <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
        SYSTEM READY // AWAITING INPUT
      </motion.div>
    </div>
  );
}
