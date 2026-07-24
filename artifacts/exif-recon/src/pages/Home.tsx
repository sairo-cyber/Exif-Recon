import React from 'react';
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

export default function Home() {
  const { parseFile, reset, data, error, isParsing, imageMeta } = useExifParser();

  const handleReset = () => {
    reset();
  };

  const hasData = data && Object.keys(data).length > 0;
  const hasGps = hasData && (data.latitude !== undefined || data.GPSLatitude !== undefined);

  // Derive simple latitude/longitude for map if available
  let lat: number | undefined;
  let lon: number | undefined;

  if (data?.latitude !== undefined) {
    lat = data.latitude;
    lon = data.longitude;
  } else if (data?.GPSLatitude !== undefined && Array.isArray(data.GPSLatitude)) {
    // If we only got the raw arrays but exifr parsed it roughly (exifr usually gives flat lat/lon)
    // fallback logic just in case
    lat = typeof data.GPSLatitude === 'number' ? data.GPSLatitude : undefined;
    lon = typeof data.GPSLongitude === 'number' ? data.GPSLongitude : undefined;
  }

  // Use flat exifr lat/lon first (exifr adds these automatically if gps:true is used and data is valid)
  const finalLat = lat;
  const finalLon = lon;
  const showMap = finalLat !== undefined && finalLon !== undefined;
  const fieldCount = data ? Object.keys(data).length : 0;

  return (
    <div className="min-h-[100dvh] w-full text-foreground relative flex flex-col">
      <Background />
      
      {!hasData && !error && !isParsing && (
        <div className="flex-1 flex flex-col pt-12 pb-12">
          <Header />
          <div className="flex-1 flex items-center justify-center mt-8">
            <UploadZone onFileSelect={parseFile} />
          </div>
        </div>
      )}

      {isParsing && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
            <div className="font-mono text-cyan tracking-widest animate-pulse">EXTRACTING METADATA...</div>
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
            className="flex-1 flex flex-col p-2 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header Mini */}
            <div className="flex justify-between items-center px-2 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan animate-pulse" />
                <h1 className="font-mono text-xl font-bold tracking-widest">EXIF // RECON</h1>
              </div>
              <button 
                onClick={handleReset}
                className="text-muted-foreground hover:text-cyan font-mono text-xs flex items-center gap-2 border border-border hover:border-cyan/50 px-3 py-1.5 rounded transition-all bg-card"
              >
                <RotateCcw className="w-3 h-3" />
                NEW TARGET
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

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 pb-12">
              
              {/* Left Col - Image */}
              <div className="lg:col-span-5 h-[50vh] lg:h-[calc(100vh-200px)]">
                <ImagePreview url={imageMeta.url} filename={imageMeta.name} />
              </div>

              {/* Right Col - Data */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
                  
                  {/* Inspector Panel */}
                  <div className="xl:col-span-1 h-[600px] xl:h-[calc(100vh-200px)]">
                    <ExifInspector data={data} />
                  </div>

                  {/* Right Side Maps & Actions */}
                  <div className="xl:col-span-1 flex flex-col gap-6">
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
