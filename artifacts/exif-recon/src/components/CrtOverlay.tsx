import React from 'react';
import { motion } from 'framer-motion';

export function CrtOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-overlay">
      {/* Repeating Scanlines */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px)',
          backgroundSize: '100% 4px'
        }}
      />
      
      {/* Drifting Bright Scanline */}
      <motion.div
        className="absolute left-0 right-0 h-[120px]"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0,240,255,0.025), transparent)'
        }}
        initial={{ top: '-20%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity, repeatDelay: 4 }}
      />
      
      {/* SVG Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
        }}
      />

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
