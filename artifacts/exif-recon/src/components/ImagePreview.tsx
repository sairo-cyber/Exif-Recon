import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize, Target } from 'lucide-react';
import { HudPanel } from './HudPanel';

interface ImagePreviewProps {
  url: string;
  filename: string;
}

export function ImagePreview({ url, filename }: ImagePreviewProps) {
  const [scale, setScale] = useState(1);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    setIsScanning(true);
    const t = setTimeout(() => setIsScanning(false), 1500);
    return () => clearTimeout(t);
  }, [url]);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.5, 4));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.5, 0.5));
  const handleResetZoom = () => setScale(1);

  return (
    <HudPanel title="TARGET IMAGE" icon={<Target className="w-4 h-4 text-cyan" />} className="h-full flex flex-col">
      <div className="relative flex-1 bg-background/50 overflow-hidden min-h-[300px] flex items-center justify-center rounded-sm border border-border/50">
        
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-background/90 backdrop-blur-sm"
            >
              {/* Radar circle */}
              <div className="relative w-48 h-48 rounded-full border border-cyan/30 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan/10 scale-50" />
                <div className="absolute inset-0 rounded-full border border-cyan/10 scale-75" />
                <div className="w-full h-[1px] bg-cyan/20 absolute top-1/2 left-0" />
                <div className="h-full w-[1px] bg-cyan/20 absolute top-0 left-1/2" />
                
                {/* Sweep line */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 w-24 h-[2px] bg-cyan origin-left drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="absolute bottom-4 text-cyan font-mono text-xs animate-pulse">
                SCANNING ACQUISITION...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanline overlay over image */}
        <motion.div 
          className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan/10 to-transparent pointer-events-none z-10"
          initial={{ top: -100 }}
          animate={{ top: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.2}
          style={{ scale }}
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing p-4"
        >
          <img 
            src={url} 
            alt="Target" 
            className="max-w-full max-h-full object-contain pointer-events-none border border-border/50 shadow-lg"
          />
        </motion.div>

        {/* Zoom controls overlay */}
        <div className="absolute bottom-4 right-4 flex bg-card/80 backdrop-blur-md border border-border rounded p-1 gap-1 z-20">
          <button onClick={handleZoomOut} className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleResetZoom} className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded transition-colors" title="Reset Zoom">
            <Maximize className="w-4 h-4" />
          </button>
          <button onClick={handleZoomIn} className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs font-mono text-muted-foreground truncate" title={filename}>
        FILE: <span className="text-white">{filename}</span>
      </div>
    </HudPanel>
  );
}
