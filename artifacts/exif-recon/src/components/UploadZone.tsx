import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Crosshair } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) onFileSelect(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <div
        className={`relative group flex flex-col items-center justify-center p-12 md:p-24 border-2 border-dashed transition-all duration-300 cursor-pointer bg-card/40 backdrop-blur-sm ${
          isDragging 
            ? 'border-cyan bg-cyan/5 shadow-[0_0_30px_rgba(0,240,255,0.1)]' 
            : 'border-border hover:border-cyan/50 hover:bg-card/80'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        {/* Tactical corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan/70" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan/70" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan/70" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan/70" />

        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/jpeg, image/png, image/webp, image/heic"
          onChange={handleFileChange}
        />

        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 animate-ping opacity-20 bg-cyan rounded-full" />
          <div className="relative bg-card border border-border p-4 rounded-full">
            <Crosshair className={`w-8 h-8 ${isDragging ? 'text-cyan' : 'text-muted-foreground'}`} />
          </div>
        </motion.div>

        <h3 className="text-xl font-mono text-white mb-2 tracking-wide text-center">
          DRAG & DROP TARGET
        </h3>
        <p className="text-sm font-mono text-muted-foreground text-center mb-6">
          CLICK TO BROWSE OR PASTE IMAGE (CTRL+V)
        </p>
        
        <div className="flex gap-4 text-xs font-mono text-muted-foreground/60 uppercase tracking-widest">
          <span>JPEG</span>
          <span>PNG</span>
          <span>WEBP</span>
          <span>HEIC</span>
        </div>
      </div>
    </motion.div>
  );
}
