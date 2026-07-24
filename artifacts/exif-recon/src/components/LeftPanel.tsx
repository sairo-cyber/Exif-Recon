import React from 'react';
import { PanelHeader } from './PanelHeader';
import { ImageMeta } from '../hooks/useExifParser';
import { ExifData } from '../types/exif';

interface LeftPanelProps {
  imageMeta: ImageMeta | null;
  hasData: boolean;
  data: ExifData | null;
  logs: string[];
}

export function LeftPanel({ imageMeta, hasData, data, logs }: LeftPanelProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const formatDate = (ms: number) => {
    return new Date(ms).toISOString().replace('T', ' ').substring(0, 19);
  };

  const truncateHash = (hash: string) => {
    if (!hash || hash.length < 24) return hash;
    return hash.substring(0, 16) + '...' + hash.substring(hash.length - 8);
  };

  const hasExif = data && Object.keys(data).length > 0;
  const hasGps = hasExif && (data.latitude !== undefined || data.GPSLatitude !== undefined);

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <PanelHeader 
        title="FILE INTELLIGENCE" 
        statusColor={hasData ? "rgba(0,240,255,0.7)" : "rgba(38,44,51,0.8)"}
        statusLabel={hasData ? "ACTIVE" : "STANDBY"} 
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-[rgba(0,0,0,0.2)]">
        
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
            <div className="w-16 h-16 border border-[#262c33] flex items-center justify-center">
              <div className="w-6 h-6 border border-[#262c33]" />
            </div>
            <div className="font-mono text-[10px] text-muted-foreground/40 tracking-widest text-center uppercase">
              NO TARGET LOADED
            </div>
            <div className="font-mono text-[9px] text-muted-foreground/25 tracking-widest text-center">
              LOAD FILE VIA<br/>OPERATIONS PANEL
            </div>
          </div>
        ) : (
          <>
            {/* Image Preview Area */}
            <div className="h-[160px] flex-shrink-0 border-b border-[#1a2028] bg-[#06070a] relative flex items-center justify-center p-2">
              <img 
                src={imageMeta?.url} 
                alt="Target" 
                className="max-w-full max-h-full object-contain pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                <div className="w-[1px] h-full bg-cyan" />
                <div className="h-[1px] w-full bg-cyan absolute" />
                <div className="w-4 h-4 border border-cyan absolute" />
              </div>
            </div>

            {/* File Intel Rows */}
            <div className="flex flex-col pb-4">
              {[
                { label: 'FILENAME', value: imageMeta?.name, title: imageMeta?.name },
                { label: 'FORMAT', value: imageMeta?.type },
                { label: 'FILE SIZE', value: imageMeta ? formatSize(imageMeta.size) : '' },
                { label: 'RESOLUTION', value: imageMeta ? `${imageMeta.width}×${imageMeta.height}` : '' },
                { label: 'SHA-256', value: imageMeta ? truncateHash(imageMeta.sha256) : '', title: imageMeta?.sha256 },
                { label: 'MD5', value: imageMeta ? truncateHash(imageMeta.md5) : '', title: imageMeta?.md5 },
                { label: 'LAST MODIFIED', value: imageMeta ? formatDate(imageMeta.lastModified) : '' },
              ].map((row, i) => (
                <div key={i} className="flex flex-col border-b border-[#1a2028] px-3 py-[5px]" title={row.title}>
                  <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-widest">{row.label}</span>
                  <span className="font-mono text-[11px] text-white/80 truncate">{row.value}</span>
                </div>
              ))}

              <div className="flex flex-col border-b border-[#1a2028] px-3 py-[5px]">
                <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-widest">EXIF STATUS</span>
                <span className={`font-mono text-[11px] truncate ${hasExif ? 'text-[#00ff66]' : 'text-[#ff003c]'}`}>
                  {hasExif ? `METADATA FOUND (${Object.keys(data).length} FIELDS)` : 'NO EXIF DATA'}
                </span>
              </div>

              <div className="flex flex-col border-b border-[#1a2028] px-3 py-[5px]">
                <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-widest">GPS</span>
                {hasGps ? (
                  <span className="font-mono text-[11px] text-[#00ff66] flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-none opacity-80 cursor-blink flex-shrink-0" />
                    COORDINATES EMBEDDED
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-[#ff003c]/50 truncate">NOT PRESENT</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Terminal Log Area */}
      <div className="h-[80px] flex-shrink-0 border-t border-[#1a2028] flex flex-col bg-[#06070a]">
        <PanelHeader title="SYS LOG" />
        <div className="flex-1 p-2 overflow-hidden flex flex-col justify-end">
          {logs.slice(-5).map((log, i) => {
            const timeStr = log.substring(0, 10); // "[HH:MM:SS]"
            const msgStr = log.substring(11);
            return (
              <div key={i} className="font-mono text-[9px] leading-relaxed">
                <span className="text-[rgba(0,240,255,0.4)] mr-2">{'>'} {timeStr}</span>
                <span className="text-white/50">{msgStr}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
