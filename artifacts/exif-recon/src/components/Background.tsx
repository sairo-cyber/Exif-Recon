import React from 'react';
import { motion } from 'framer-motion';

export function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
      {/* Tactical grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(38,44,51,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(38,44,51,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-cyan/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
          }}
          transition={{
            duration: Math.random() * 40 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Occasional scanline */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/10 to-transparent"
        initial={{ top: -10 }}
        animate={{ top: '110%' }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 8
        }}
      />
      
      {/* Subtle center noise vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,9,12,0.6)_100%)]" />
    </div>
  );
}
