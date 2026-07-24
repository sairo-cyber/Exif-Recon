import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Tactical Map Marker icon
const tacticalIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center -translate-x-4 -translate-y-4">
      <div class="absolute inset-0 rounded-none border border-cyan/40 animate-ping"></div>
      <div class="w-3 h-3 rounded-none bg-cyan shadow-[0_0_8px_#00f0ff]"></div>
      <div class="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan/50"></div>
      <div class="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan/50"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16], // center
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

interface CenterPanelProps {
  data: any;
  imageMeta: any;
  hasData: boolean;
  hasGps: boolean;
  lat: number | undefined;
  lon: number | undefined;
  altitude: number | undefined;
  onFileSelect: (f: File) => void;
  isParsing: boolean;
}

export function CenterPanel({
  data, imageMeta, hasData, hasGps, lat, lon, altitude, onFileSelect, isParsing
}: CenterPanelProps) {
  const [activeTab, setActiveTab] = useState<'GEO' | 'RAW' | 'EXPORT'>('GEO');
  
  if (isParsing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[rgba(0,0,0,0.1)] h-full">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border border-cyan/30 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-2 border border-cyan/20 animate-[spin-reverse_2s_linear_infinite]" />
          <div className="absolute inset-4 border border-cyan/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan animate-pulse" />
          </div>
        </div>
        <div className="font-mono text-[11px] text-cyan/70 tracking-widest animate-pulse">EXTRACTING METADATA...</div>
        <div className="font-mono text-[9px] text-muted-foreground/30 tracking-widest">ANALYZING BINARY STRUCTURE</div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[rgba(0,0,0,0.1)] h-full">
        <svg width="120" height="120" viewBox="0 0 120 120" className="mb-8 opacity-40">
          <circle cx="60" cy="60" r="56" stroke="rgba(0,240,255,0.5)" strokeWidth="0.5" fill="none" strokeDasharray="20 8" style={{animationDuration: '8s', animation: 'spin 8s linear infinite', transformOrigin: '60px 60px'}} />
          <circle cx="60" cy="60" r="38" stroke="rgba(0,240,255,0.3)" strokeWidth="0.5" fill="none" />
          <circle cx="60" cy="60" r="20" stroke="rgba(0,240,255,0.4)" strokeWidth="0.5" fill="none" strokeDasharray="6 4" style={{animation: 'spin-reverse 4s linear infinite', transformOrigin: '60px 60px'}} />
          <line x1="0" y1="60" x2="120" y2="60" stroke="rgba(0,240,255,0.2)" strokeWidth="0.5" />
          <line x1="60" y1="0" x2="60" y2="120" stroke="rgba(0,240,255,0.2)" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="2" fill="rgba(0,240,255,0.8)" />
          <line x1="60" y1="4" x2="60" y2="14" stroke="rgba(0,240,255,0.5)" strokeWidth="1" />
          <line x1="60" y1="106" x2="60" y2="116" stroke="rgba(0,240,255,0.5)" strokeWidth="1" />
          <line x1="4" y1="60" x2="14" y2="60" stroke="rgba(0,240,255,0.5)" strokeWidth="1" />
          <line x1="106" y1="60" x2="116" y2="60" stroke="rgba(0,240,255,0.5)" strokeWidth="1" />
        </svg>
        
        <div className="font-mono text-xl font-bold tracking-[0.4em] text-white/80 uppercase mb-2">AWAITING TARGET</div>
        <div className="font-mono text-[11px] text-muted-foreground/40 tracking-widest mb-8">USE OPERATIONS PANEL TO LOAD FILE</div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 flex flex-col justify-end pb-3 px-4 pointer-events-none">
          <div className="font-mono text-[9px] text-muted-foreground/20 leading-relaxed">
            {'>'} SYSTEM READY // FORENSIC ENGINE ACTIVE<br/>
            {'>'} AWAITING IMAGE INPUT...<br/>
            {'>'} ALL MODULES NOMINAL<br/>
            {'>'} GEOINT MODULE: STANDBY<br/>
            {'>'} CRYPTOGRAPHIC ENGINE: READY
          </div>
        </div>
      </div>
    );
  }

  // Generate Report Text
  const generateReport = () => {
    if (!imageMeta || !data) return '';
    const d = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    let rep = `╔══════════════════════════════════════════╗\n`;
    rep +=    `║  EXIF // RECON — FORENSIC REPORT         ║\n`;
    rep +=    `║  Generated: ${d}                  ║\n`;
    rep +=    `╚══════════════════════════════════════════╝\n\n`;

    rep += `FILE INTELLIGENCE\n─────────────────\n`;
    rep += `Filename:    ${imageMeta.name}\n`;
    rep += `Format:      ${imageMeta.type}\n`;
    rep += `Size:        ${imageMeta.size} bytes\n`;
    rep += `Resolution:  ${imageMeta.width}×${imageMeta.height}px\n`;
    rep += `SHA-256:     ${imageMeta.sha256}\n`;
    rep += `MD5:         ${imageMeta.md5}\n\n`;

    rep += `RAW EXIF DATA\n─────────────\n`;
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === 'object') {
        rep += `${k.padEnd(20)} ${JSON.stringify(v)}\n`;
      } else {
        rep += `${k.padEnd(20)} ${v}\n`;
      }
    }
    return rep;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderJsonWithColors = (obj: any) => {
    const jsonStr = JSON.stringify(obj, null, 2);
    // basic colorization
    return jsonStr.split('\n').map((line, i) => {
      // rough regex replacement for visual only
      let coloredLine = line
        .replace(/"([^"]+)":/g, '<span class="text-cyan/60">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="text-[#00ff66]/70">"$1"</span>')
        .replace(/: (true|false|null)/g, ': <span class="text-[#ff003c]/50">$1</span>')
        .replace(/: ([\d.]+)/g, ': <span class="text-[#ff9500]/70">$1</span>');
      return <div key={i} dangerouslySetInnerHTML={{__html: coloredLine}} />;
    });
  };

  const keyExifFields = [
    { label: 'Make', val: data.Make },
    { label: 'Model', val: data.Model },
    { label: 'ExposureTime', val: data.ExposureTime ? `1/${Math.round(1/data.ExposureTime)}s` : null },
    { label: 'FNumber', val: data.FNumber ? `f/${data.FNumber}` : null },
    { label: 'ISO', val: data.ISO },
    { label: 'DateTimeOriginal', val: data.DateTimeOriginal ? new Date(data.DateTimeOriginal).toISOString() : null },
    { label: 'FocalLength', val: data.FocalLength ? `${data.FocalLength}mm` : null },
    { label: 'Software', val: data.Software }
  ].filter(f => f.val != null);

  const fieldCount = Object.keys(data).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Tabs Bar */}
      <div className="h-[32px] border-b border-[#1a2028] flex flex-row bg-[#08090c] flex-shrink-0">
        {[
          { id: 'GEO', label: 'GEO INTELLIGENCE' },
          { id: 'RAW', label: 'RAW METADATA' },
          { id: 'EXPORT', label: 'EXPORT REPORT' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`font-mono text-[10px] tracking-widest uppercase px-4 flex items-center justify-center flex-shrink-0 transition-colors border-b outline-none cursor-pointer ${
                isActive 
                  ? 'bg-[rgba(0,240,255,0.05)] border-[#00f0ff] text-white' 
                  : 'bg-transparent border-transparent text-muted-foreground/40 hover:text-white/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'GEO' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#06070a]">
          {/* Map Area */}
          <div className="h-[55%] relative flex-shrink-0 border-b border-[#1a2028]">
            {hasGps && lat !== undefined && lon !== undefined ? (
              <>
                <MapContainer 
                  center={[lat, lon]} 
                  zoom={14} 
                  scrollWheelZoom={false} 
                  style={{ height: '100%', width: '100%', background: '#08090c' }}
                >
                  <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={[lat, lon]} icon={tacticalIcon} />
                  <MapController center={[lat, lon]} />
                </MapContainer>
                {/* Crosshair Overlay */}
                <div className="absolute inset-0 pointer-events-none z-[400] opacity-40">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan" />
                </div>
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-[400]" />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#06070a] h-full relative">
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-[400] opacity-30" />
                <div className="font-mono text-[10px] text-[#ff003c]/60 tracking-widest uppercase z-10">GPS SIGNAL NOT DETECTED</div>
                <div className="font-mono text-[9px] text-muted-foreground/30 tracking-widest z-10">NO LOCATION METADATA EMBEDDED IN TARGET</div>
              </div>
            )}
          </div>

          {/* Bottom Area */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
            <div className="flex-1 flex flex-row">
              {/* GPS Stats */}
              <div className="flex-1 border-r border-[#1a2028] p-4 flex flex-col justify-center gap-2">
                {hasGps ? (
                  <>
                    <div className="font-mono text-[11px] flex justify-between"><span className="text-muted-foreground/40">LAT</span><span className="text-white">{lat?.toFixed(6)}° N</span></div>
                    <div className="font-mono text-[11px] flex justify-between"><span className="text-muted-foreground/40">LON</span><span className="text-white">{lon?.toFixed(6)}° E</span></div>
                    {altitude !== undefined && (
                      <div className="font-mono text-[11px] flex justify-between"><span className="text-muted-foreground/40">ALT</span><span className="text-white">{altitude.toFixed(1)}m</span></div>
                    )}
                  </>
                ) : (
                  <div className="font-mono text-[11px] text-[#ff003c]/60">NO GPS DATA</div>
                )}
              </div>
              
              {/* Key EXIF */}
              <div className="flex-1 p-4 flex flex-col justify-center gap-1.5 overflow-y-auto custom-scrollbar">
                {keyExifFields.map((f, i) => (
                  <div key={i} className="font-mono text-[10px] flex justify-between items-center gap-2">
                    <span className="text-muted-foreground/40 truncate flex-shrink-0">{f.label}</span>
                    <span className="text-white/80 truncate text-right">{f.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Marquee */}
            <div className="h-[24px] border-t border-[#1a2028] overflow-hidden flex items-center bg-[rgba(0,240,255,0.03)] px-2">
              <div className="animate-marquee whitespace-nowrap font-mono text-[9px] text-muted-foreground/40 tracking-widest uppercase">
                TARGET ACQUIRED // {imageMeta.name} // {imageMeta.width}x{imageMeta.height} // {fieldCount} EXIF FIELDS // GPS: {hasGps ? 'LOCKED' : 'NO SIGNAL'} // SHA256: {imageMeta.sha256.substring(0,8)}... // ANALYSIS COMPLETE
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'RAW' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#06070a]">
          <div className="h-[28px] border-b border-[#1a2028] flex items-center justify-between px-3 flex-shrink-0">
            <span className="font-mono text-[9px] text-muted-foreground/40 tracking-widest uppercase">JSON DATA STREAM</span>
            <button 
              onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
              className="font-mono text-[9px] text-cyan/50 hover:text-cyan uppercase cursor-pointer bg-transparent border-none outline-none"
            >
              [ COPY JSON ]
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 font-mono text-[10px] leading-relaxed custom-scrollbar">
            <div className="text-[#00ff66]/40 mb-4 whitespace-pre">
{`> FORENSIC DATA EXTRACTION COMPLETE
> TARGET: ${imageMeta.name}
> FIELDS EXTRACTED: ${fieldCount}
> ─────────────────────────────────`}
            </div>
            {renderJsonWithColors(data)}
            <div className="mt-2"><span className="cursor-blink w-[6px] h-[10px] bg-white/50 inline-block align-middle" /></div>
          </div>
        </div>
      )}

      {activeTab === 'EXPORT' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#06070a]">
          <div className="h-[28px] border-b border-[#1a2028] flex items-center justify-between px-3 flex-shrink-0">
            <span className="font-mono text-[9px] text-muted-foreground/40 tracking-widest uppercase">TEXT REPORT</span>
            <button 
              onClick={() => copyToClipboard(generateReport())}
              className="font-mono text-[9px] text-cyan/50 hover:text-cyan uppercase cursor-pointer bg-transparent border-none outline-none"
            >
              [ COPY REPORT ]
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 font-mono text-[10px] text-white/70 whitespace-pre custom-scrollbar">
            {generateReport()}
          </div>
        </div>
      )}

    </div>
  );
}
