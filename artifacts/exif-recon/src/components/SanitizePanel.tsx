import React, { useState } from 'react';
import { HudPanel } from './HudPanel';
import { ShieldCheck, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SanitizePanelProps {
  imageUrl: string;
  filename: string;
  fieldCount: number;
}

export function SanitizePanel({ imageUrl, filename, fieldCount }: SanitizePanelProps) {
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [sanitizedUrl, setSanitizedUrl] = useState<string | null>(null);

  const handleSanitize = async () => {
    setIsSanitizing(true);
    
    try {
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      
      ctx.drawImage(img, 0, 0);
      
      // Determine format to maintain
      const isPng = filename.toLowerCase().endsWith('.png');
      const format = isPng ? 'image/png' : 'image/jpeg';
      const quality = isPng ? undefined : 0.95;

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, format, quality));
      
      if (!blob) throw new Error('Failed to create blob');
      
      const cleanUrl = URL.createObjectURL(blob);
      
      // Simulate slightly longer processing for effect
      await new Promise(r => setTimeout(r, 800));
      
      setSanitizedUrl(cleanUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSanitizing(false);
    }
  };

  const handleDownload = () => {
    if (!sanitizedUrl) return;
    const a = document.createElement('a');
    a.href = sanitizedUrl;
    const extIdx = filename.lastIndexOf('.');
    const base = extIdx !== -1 ? filename.substring(0, extIdx) : filename;
    const ext = extIdx !== -1 ? filename.substring(extIdx) : '.jpg';
    a.download = `${base}_SANITIZED${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <HudPanel 
      title="METADATA SANITIZER" 
      icon={<ShieldCheck className="w-4 h-4 text-destructive" />} 
      delay={0.6}
    >
      <div className="text-sm font-mono text-muted-foreground mb-4">
        Remove all {fieldCount} EXIF fields at the pixel level. Image quality will be preserved, but all embedded metadata will be permanently destroyed.
      </div>

      <AnimatePresence mode="wait">
        {!sanitizedUrl ? (
          <motion.div 
            key="sanitize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={handleSanitize}
              disabled={isSanitizing}
              className="w-full relative group bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/50 hover:border-destructive p-3 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSanitizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-sm uppercase tracking-widest">PURGING DATA...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span className="font-mono text-sm uppercase tracking-widest font-bold">SANITIZE IMAGE</span>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="download"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-green bg-green/10 border border-green/30 p-3 rounded">
              <ShieldCheck className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm">EXIF DATA PURGED</span>
                <span className="font-mono text-[10px] text-green/70">Original pixels preserved. {fieldCount} fields destroyed.</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-cyan/10 hover:bg-cyan/20 text-cyan border border-cyan/50 hover:border-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] p-3 rounded flex items-center justify-center gap-2 transition-all group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-mono text-sm uppercase tracking-widest font-bold">DOWNLOAD CLEAN IMAGE</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </HudPanel>
  );
}
