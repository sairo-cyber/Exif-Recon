import React, { useState, useCallback, useEffect } from 'react';
import { HudGrid } from '../components/HudGrid';
import { CrtOverlay } from '../components/CrtOverlay';
import { SystemBar } from '../components/SystemBar';
import { SystemHeader } from '../components/SystemHeader';
import { LeftPanel } from '../components/LeftPanel';
import { CenterPanel } from '../components/CenterPanel';
import { RightPanel } from '../components/RightPanel';
import { useExifParser } from '../hooks/useExifParser';

export default function Home() {
  const { parseFile, reset, data, isParsing, imageMeta } = useExifParser();
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toTimeString().slice(0,8)}] SYSTEM INITIALIZED // FORENSIC ENGINE READY`
  ]);

  const [isSanitizing, setIsSanitizing] = useState(false);
  const [sanitizedUrl, setSanitizedUrl] = useState<string | null>(null);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toTimeString().slice(0, 8);
    setLogs(prev => [...prev.slice(-19), `[${time}] ${msg}`]);
  }, []);

  const handleFileSelect = async (f: File) => {
    addLog(`TARGET ACQUISITION // ${f.name}`);
    setSanitizedUrl(null); // reset sanitize state
    const success = await parseFile(f);
    if (success) {
      addLog(`METADATA EXTRACTED // PARSE COMPLETE`);
    } else {
      addLog(`PARSE FAILURE // UNSUPPORTED OR CORRUPTED`);
    }
  };

  const handleReset = useCallback(() => {
    reset();
    setSanitizedUrl(null);
    addLog('TARGET CLEARED // READY');
  }, [reset, addLog]);

  const handleSanitize = async () => {
    if (!imageMeta) return;
    setIsSanitizing(true);
    addLog('INITIATING PURGE // METADATA SANITIZATION');
    
    try {
      const img = new Image();
      img.src = imageMeta.url;
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
      
      const isPng = imageMeta.name.toLowerCase().endsWith('.png');
      const format = isPng ? 'image/png' : 'image/jpeg';
      const quality = isPng ? undefined : 0.95;

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, format, quality));
      
      if (!blob) throw new Error('Failed to create blob');
      
      const cleanUrl = URL.createObjectURL(blob);
      
      // Artificial delay for effect
      await new Promise(r => setTimeout(r, 800));
      
      setSanitizedUrl(cleanUrl);
      addLog('PURGE COMPLETE // EXIF DESTROYED');
    } catch (err) {
      console.error(err);
      addLog('PURGE FAILED // SYSTEM ERROR');
    } finally {
      setIsSanitizing(false);
    }
  };

  const hasData = data !== null && Object.keys(data).length >= 0; 
  // Object.keys(data).length >= 0 ensures even files with 0 exif show as active target.
  const hasGps = hasData && data && (data.latitude !== undefined || data.GPSLatitude !== undefined);

  let finalLat: number | undefined;
  let finalLon: number | undefined;
  
  if (data?.latitude !== undefined) {
    finalLat = data.latitude;
    finalLon = data.longitude;
  } else if (data?.GPSLatitude !== undefined && Array.isArray(data.GPSLatitude)) {
    finalLat = typeof data.GPSLatitude === 'number' ? data.GPSLatitude : undefined;
    finalLon = typeof data.GPSLongitude === 'number' ? data.GPSLongitude : undefined;
  }

  const fieldCount = data ? Object.keys(data).length : 0;

  // Watch for GPS logic
  useEffect(() => {
    if (hasData && hasGps && finalLat !== undefined) {
      addLog('GEOINT // GPS COORDINATES EMBEDDED');
    }
  }, [hasData, hasGps, finalLat, addLog]);

  return (
    <div className="h-full overflow-hidden flex flex-col bg-[#08090c]">
      <HudGrid />
      <CrtOverlay />
      <SystemBar />
      <SystemHeader onReset={handleReset} hasFile={hasData || isParsing} />
      
      <div className="flex-1 flex flex-row overflow-hidden min-h-0 w-full relative z-10">
        
        {/* LEFT PANEL */}
        <div className="w-[272px] flex-shrink-0 flex flex-col overflow-hidden border-r border-[#1a2028]">
          <LeftPanel 
            imageMeta={imageMeta} 
            hasData={hasData} 
            data={data} 
            logs={logs} 
          />
        </div>

        {/* CENTER PANEL */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CenterPanel 
            data={data} 
            imageMeta={imageMeta} 
            hasData={hasData} 
            hasGps={hasGps} 
            lat={finalLat} 
            lon={finalLon} 
            altitude={data?.GPSAltitude} 
            onFileSelect={handleFileSelect} 
            isParsing={isParsing} 
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[256px] flex-shrink-0 flex flex-col overflow-hidden border-l border-[#1a2028]">
          <RightPanel 
            imageMeta={imageMeta} 
            fieldCount={fieldCount} 
            onFileSelect={handleFileSelect} 
            isParsing={isParsing} 
            hasData={hasData} 
            data={data} 
            hasGps={hasGps}
            logs={logs} 
            onSanitize={handleSanitize}
            isSanitizing={isSanitizing}
            sanitizedUrl={sanitizedUrl}
          />
        </div>

      </div>
    </div>
  );
}
