import React, { useState, useEffect } from 'react';
import { Background } from '../components/Background';
import { Header } from '../components/Header';
import { UploadZone } from '../components/UploadZone';
import { ImagePreview } from '../components/ImagePreview';
import { StatusBar } from '../components/StatusBar';
import { ExifInspector } from '../components/ExifInspector';
import { GpsMap } from '../components/GpsMap';
import { SanitizePanel } from '../components/SanitizePanel';
import { useExifParser } from '../hooks/useExifParser';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';

function SystemClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(new Date().toISOString().substring(0, 19).replace('T', ' '));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span>{time}</span>;
}

export default function Home() {
  const { parseFile, reset, data, error, isParsing, imageMeta } = useExifParser();

  const handleReset = () => {
    reset();
  };

  const hasData = data && Object.keys(data).length > 0;
  const hasGps = hasData && (data.latitude !== undefined || data.GPSLatitude !== undefined);

  let lat: number | undefined;
  let lon: number | undefined;

  if (data?.latitude !== undefined) {
    lat = data.latitude;
    lon = data.longitude;
  } else if (data?.GPSLatitude !== undefined && Array.isArray(data.GPSLatitude)) {
    lat = typeof data.GPSLatitude === 'number' ? data.GPSLatitude : undefined;
    lon = typeof data.GPSLongitude === 'number' ? data.GPSLongitude : undefined;
  }

  const finalLat = lat;
  const finalLon = lon;
  const showMap = finalLat !== undefined && finalLon !== undefined;
  const fieldCount = data ? Object.keys(data).length : 0;

  return (
    <div className="min-h-[100dvh] w-full text-foreground relative flex flex-col">
      <Background />
      
      {/* Top System Bar */}
      <div className="w-full h-[28px] bg-[#06070a] border-b border-[#1a2028] flex items-center justify-between px-4 z-50">
        <div className="flex items-center font-mono text-[10px] uppercase tracking-widest">
          <span className="text-green mr-2">■ EXIF-RECON</span>
          <span className="text-muted-foreground hidden sm:inline">// FORENSIC IMAGE ANALYSIS SYSTEM</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-muted-foreground tracking-widest">
          <SystemClock />
        </div>
      </div>
      
      {!hasData && !error && !isParsing && (
        <div className="flex-1 flex flex-col pb-12">
          <Header />
          <div className="flex-1 flex items-center justify-center mt-2">
            <UploadZone onFileSelect={parseFile} />
          </div>
        </div>
      )}

      {isParsing && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
            <div className="font-mono text-[11px] text-cyan tracking-[0.3em] animate-pulse">EXTRACTING METADATA...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/50 p-8 rounded max-w-lg text-center flex flex-col items-center gap-4 shadow-[0_0_30px_rgba(255,0,60,0.15)]"
          >
            <AlertTriangle className="w-12 h-12 text-destructive" />
            <h2 className="text-xl font-mono text-destructive uppercase tracking-widest">{error}</h2>
            <button 
              onClick={handleReset}
              className="mt-4 px-6 py-2 bg-transparent hover:bg-destructive/10 text-white border border-border hover:border-destructive rounded font-mono text-sm flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              RETURN TO UPLOAD
            </button>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {hasData && imageMeta && !isParsing && !error && (
          <motion.div 
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header Mini */}
            <div className="flex justify-between items-center px-4 pt-4 mb-2">
              <div className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] sm:tracking-widest">
                SYSTEM <span className="text-cyan/50 mx-1 sm:mx-2">//</span> ANALYSIS <span className="text-cyan/50 mx-1 sm:mx-2">//</span> <span className="text-white">TARGET ACQUIRED</span>
              </div>
              <button 
                onClick={handleReset}
                className="text-muted-foreground hover:text-[#ff003c] font-mono text-xs tracking-[0.2em] transition-colors"
              >
                [ CLEAR TARGET ]
              </button>
            </div>

            <StatusBar 
              filename={imageMeta.name}
              width={imageMeta.width}
              height={imageMeta.height}
              sizeBytes={imageMeta.size}
              fieldCount={fieldCount}
              hasGps={showMap}
            />

            <div className="flex-1 flex flex-col lg:flex-row mt-2 pb-12 px-2 md:px-4">
              
              {/* Left Col - Image */}
              <div className="w-full lg:w-[45%] h-[50vh] lg:h-[calc(100vh-180px)] pr-0 lg:pr-6 pb-6 lg:pb-0">
                <ImagePreview url={imageMeta.url} filename={imageMeta.name} />
              </div>

              {/* Vertical Grid Separator */}
              <div className="hidden lg:block w-[1px] h-[calc(100vh-180px)] bg-[#1a2028]" />

              {/* Right Col - Data */}
              <div className="w-full lg:w-[55%] pl-0 lg:pl-6 h-auto lg:h-[calc(100vh-180px)]">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
                  
                  {/* Inspector Panel */}
                  <div className="xl:col-span-1 h-[600px] xl:h-full">
                    <ExifInspector data={data} />
                  </div>

                  {/* Right Side Maps & Actions */}
                  <div className="xl:col-span-1 flex flex-col gap-6 h-[800px] xl:h-full">
                    {showMap && (
                      <GpsMap 
                        latitude={finalLat} 
                        longitude={finalLon} 
                        altitude={data.GPSAltitude} 
                      />
                    )}
                    
                    <div className={showMap ? "" : "flex-1"}>
                      <SanitizePanel 
                        imageUrl={imageMeta.url} 
                        filename={imageMeta.name} 
                        fieldCount={fieldCount} 
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
