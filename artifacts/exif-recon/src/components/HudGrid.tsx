import React from 'react';
import { motion } from 'framer-motion';

export function HudGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#08090c]">
      
      {/* Large Grid (60px) */}
      <div 
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(38,44,51,1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(38,44,51,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Small Grid (15px) */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(38,44,51,1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(38,44,51,1) 1px, transparent 1px)
          `,
          backgroundSize: '15px 15px'
        }}
      />
      
      {/* Horizontal Telemetry Lines */}
      <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-[rgba(38,44,51,0.5)]" />
      <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-[rgba(38,44,51,0.5)]" />
      <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-[rgba(38,44,51,0.5)]" />
      <div className="absolute top-[100%] left-0 right-0 h-[1px] bg-[rgba(38,44,51,0.5)]" />

      {/* Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-[rgba(0,240,255,0.3)]"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
          }}
          transition={{
            duration: Math.random() * 40 + 40,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
