import React, { useCallback, useState, useEffect } from 'react';

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
    <div className="w-full max-w-4xl mx-auto px-4 mt-8 md:mt-16">
      <div
        className={`relative group flex flex-col items-center justify-center py-16 px-4 transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging ? 'bg-[rgba(0,240,255,0.05)] border-[rgba(0,240,255,0.5)]' : 'bg-transparent border-[#262c33] hover:border-[rgba(0,240,255,0.2)] hover:shadow-[inset_0_0_20px_rgba(0,240,255,0.02)]'}
        `}
        style={{
          borderWidth: isDragging ? '2px' : '1px',
          borderStyle: 'solid',
          boxShadow: isDragging ? 'inset 0 0 40px rgba(0,240,255,0.05)' : 'none'
        }}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        {/* L-Marks */}
        <div className={`absolute -top-[2px] -left-[2px] w-[12px] h-[12px] border-t-[2px] border-l-[2px] border-[#00f0ff] transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
        <div className={`absolute -top-[2px] -right-[2px] w-[12px] h-[12px] border-t-[2px] border-r-[2px] border-[#00f0ff] transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
        <div className={`absolute -bottom-[2px] -left-[2px] w-[12px] h-[12px] border-b-[2px] border-l-[2px] border-[#00f0ff] transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
        <div className={`absolute -bottom-[2px] -right-[2px] w-[12px] h-[12px] border-b-[2px] border-r-[2px] border-[#00f0ff] transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />

        {/* Scanline inside zone */}
        <div 
          className="absolute left-0 right-0 h-[1px] bg-[rgba(0,240,255,0.15)] pointer-events-none"
          style={{ animation: 'scan-horizontal 4s infinite linear' }}
        />

        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/jpeg, image/png, image/webp, image/heic"
          onChange={handleFileChange}
        />

        {/* Target SVG */}
        <div className="relative mb-6">
          <svg width="48" height="48" viewBox="0 0 48 48" className="stroke-[rgba(0,240,255,0.5)] fill-transparent">
            {/* Rotating outer ring */}
            <circle cx="24" cy="24" r="20" strokeWidth="1" strokeDasharray="4 4" className="origin-center animate-[spin_20s_linear_infinite]" />
            {/* Inner crosshair */}
            <line x1="24" y1="0" x2="24" y2="48" strokeWidth="1" />
            <line x1="0" y1="24" x2="48" y2="24" strokeWidth="1" />
            <circle cx="24" cy="24" r="8" strokeWidth="1" />
            <circle cx="24" cy="24" r="2" fill="rgba(0,240,255,0.5)" />
          </svg>
        </div>

        <h3 className="text-2xl font-mono text-white mb-3 tracking-[0.3em] font-bold z-10">
          LOAD TARGET
        </h3>
        <p className="text-[11px] font-mono text-muted-foreground/60 mb-4 tracking-widest uppercase z-10">
          DRAG FILE — CLICK TO BROWSE — PASTE (CTRL+V)
        </p>
        
        <div className="w-[80px] h-[1px] bg-[#262c33] mb-4 z-10" />

        <div className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.4em] z-10">
          JPEG · PNG · WEBP · HEIC
        </div>
      </div>
    </div>
  );
}
