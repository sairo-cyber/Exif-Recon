import React, { useState } from 'react';
import { PanelHeader } from './PanelHeader';

interface RightPanelProps {
  imageMeta: any;
  fieldCount: number;
  onFileSelect: (f: File) => void;
  isParsing: boolean;
  hasData: boolean;
  data: any;
  logs: string[];
  hasGps: boolean;
  onSanitize: () => void;
  isSanitizing: boolean;
  sanitizedUrl: string | null;
}

export function RightPanel({
  fieldCount,
  onFileSelect,
  isParsing,
  hasData,
  hasGps,
  logs,
  onSanitize,
  isSanitizing,
  sanitizedUrl,
  imageMeta
}: RightPanelProps) {
  const [isDragging, setDragging] = useState(false);

  const handleDownload = () => {
    if (!sanitizedUrl || !imageMeta) return;
    const a = document.createElement('a');
    a.href = sanitizedUrl;
    const extIdx = imageMeta.name.lastIndexOf('.');
    const base = extIdx !== -1 ? imageMeta.name.substring(0, extIdx) : imageMeta.name;
    const ext = extIdx !== -1 ? imageMeta.name.substring(extIdx) : '.jpg';
    a.download = `${base}_SANITIZED${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col overflow-hidden h-full bg-[#08090c]">
      <PanelHeader title="OPERATIONS" statusLabel="ONLINE" statusColor="rgba(0,255,102,0.7)" />

      <div className="flex-1 flex flex-col overflow-y-auto gap-0 bg-[rgba(0,0,0,0.2)]">
        
        {/* SECTION 1: UPLOAD TARGET */}
        <div className="px-3 py-3 border-b border-[#1a2028]">
          <div className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-widest mb-2">// LOAD IMAGE FILE</div>
          <div 
            className="border border-[#262c33] hover:border-cyan/40 transition-colors cursor-pointer flex flex-col items-center justify-center py-5 gap-2 relative group"
            onClick={() => document.getElementById('file-upload-right')?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) onFileSelect(f); }}
            style={isDragging ? {borderColor: 'rgba(0,240,255,0.5)', boxShadow: 'inset 0 0 20px rgba(0,240,255,0.04)'} : {}}
          >
            {/* L-marks */}
            <div className={`absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-cyan transition-opacity ${isDragging ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`} />
            <div className={`absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-cyan transition-opacity ${isDragging ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`} />
            <div className={`absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-cyan transition-opacity ${isDragging ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`} />
            <div className={`absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-cyan transition-opacity ${isDragging ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`} />

            <input id="file-upload-right" type="file" className="hidden" accept="image/jpeg, image/png, image/webp, image/heic" onChange={(e) => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); }} />
            <div className="font-mono text-[11px] tracking-[0.2em] text-white/50 uppercase">DRAG TARGET</div>
            <div className="font-mono text-[9px] text-muted-foreground/30 tracking-widest">OR CLICK TO BROWSE</div>
            <div className="font-mono text-[8px] text-muted-foreground/20 tracking-widest mt-1">JPEG · PNG · WEBP · HEIC</div>
          </div>
        </div>

        {/* SECTION 2: PURGE EXIF DATA */}
        {hasData && (
          <div className="px-3 py-3 border-b border-[#1a2028]">
            <div className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-widest mb-2">// METADATA SANITIZER</div>
            <div className="font-mono text-[9px] text-muted-foreground/30 mb-2 leading-relaxed">
              Strips {fieldCount} EXIF fields from image binary. Pixel data preserved.
            </div>
            
            {!sanitizedUrl ? (
              <button 
                onClick={onSanitize} 
                disabled={isSanitizing || fieldCount === 0}
                className="w-full bg-transparent border border-[#ff003c]/30 hover:border-[#ff003c]/60 text-[#ff003c]/70 hover:text-[#ff003c] font-mono text-[10px] tracking-widest uppercase py-2 transition-all hover:shadow-[0_0_12px_rgba(255,0,60,0.1)] disabled:opacity-30 disabled:hover:shadow-none cursor-pointer rounded-none outline-none"
              >
                {isSanitizing ? '[ PURGING... ]' : '[ PURGE EXIF DATA ]'}
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="font-mono text-[9px] text-[#00ff66]/60 border border-[#00ff66]/20 px-2 py-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00ff66] inline-block flex-shrink-0" />
                  PURGE COMPLETE — {fieldCount} FIELDS DESTROYED
                </div>
                <button 
                  onClick={handleDownload} 
                  className="w-full bg-transparent border border-cyan/30 hover:border-cyan/60 text-cyan/70 hover:text-cyan font-mono text-[10px] tracking-widest uppercase py-2 transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] cursor-pointer rounded-none outline-none"
                >
                  [ DOWNLOAD CLEAN FILE ]
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: SYSTEM STATUS */}
        <div className="flex-1 px-3 py-3 flex flex-col gap-1">
          <div className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-widest mb-2">// SYSTEM STATUS</div>
          {[
            { label: 'FORENSIC ENGINE', value: 'ONLINE', color: '#00ff66' },
            { label: 'EXIF PARSER', value: 'READY', color: '#00ff66' },
            { label: 'CRYPTO MODULE', value: 'ACTIVE', color: '#00ff66' },
            { label: 'GEO MODULE', value: hasGps ? 'SIGNAL' : 'NO SIGNAL', color: hasGps ? '#00ff66' : '#ff003c' },
            { label: 'TARGET LOADED', value: hasData ? 'POSITIVE' : 'NEGATIVE', color: hasData ? '#00ff66' : 'rgba(255,255,255,0.2)' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-[3px] border-b border-[#1a2028]">
              <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-wider">{s.label}</span>
              <span className="font-mono text-[8px] uppercase tracking-wider flex items-center gap-1" style={{color: s.color}}>
                <span className="w-1 h-1 inline-block rounded-none" style={{background: s.color}} />
                {s.value}
              </span>
            </div>
          ))}
          
          <div className="mt-auto pt-3 border-t border-[#1a2028] mt-4">
            <div className="font-mono text-[8px] text-muted-foreground/30 uppercase tracking-widest mb-1">// ACTIVITY LOG</div>
            <div className="font-mono text-[9px] text-muted-foreground/25 leading-relaxed space-y-0.5">
              {logs.slice(-4).map((log, i) => {
                const timeStr = log.substring(0, 10);
                const msgStr = log.substring(11);
                return (
                  <div key={i} className="flex gap-1">
                    <span className="text-cyan/30">{'>'}</span>
                    <span><span className="text-cyan/20">{timeStr}</span> {msgStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
