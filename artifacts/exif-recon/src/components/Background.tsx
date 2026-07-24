import React from 'react';
import { motion } from 'framer-motion';

export function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
      
      {/* Large Grid */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(38,44,51,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(38,44,51,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Small Grid */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(38,44,51,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(38,44,51,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Telemetry lines */}
      <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-[rgba(38,44,51,0.3)]" />
      <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-[rgba(38,44,51,0.3)]" />
      <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-[rgba(38,44,51,0.3)]" />

      {/* Particles */}
      {Array.from({ length: 25 }).map((_, i) => {
        const size = Math.random() > 0.5 ? 2 : 1;
        return (
          <motion.div
            key={i}
            className="absolute bg-cyan"
            style={{ width: size, height: size }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.15 + 0.25
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: Math.random() * 40 + 20,
              opacity: {
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                repeatType: "reverse"
              },
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}

      {/* Scanline */}
      <motion.div
        className="absolute left-0 right-0 h-[3px] bg-gradient-to-b from-transparent via-[rgba(0,240,255,0.06)] to-transparent"
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 2
        }}
      />
      
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
    </div>
  );
}
