import React, { useEffect, useState } from 'react';
import { HudPanel } from './HudPanel';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface GpsMapProps {
  latitude: number;
  longitude: number;
  altitude?: number;
}

// Tactical Map Marker icon
const tacticalIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center -translate-x-4 -translate-y-4">
      <div class="absolute inset-0 rounded-full border border-cyan/40 animate-ping"></div>
      <div class="w-3 h-3 rounded-full bg-cyan shadow-[0_0_8px_#00f0ff]"></div>
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
    map.setView(center, 14, {
      animate: true,
      duration: 1.5
    });
  }, [center, map]);
  return null;
}

export function GpsMap({ latitude, longitude, altitude }: GpsMapProps) {
  return (
    <HudPanel 
      title="GPS LOCATION" 
      icon={
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          <MapPin className="w-4 h-4 text-cyan" />
        </div>
      } 
      delay={0.4}
      className="h-[400px]"
    >
      <div className="w-full h-[280px] bg-card border border-border relative z-0 rounded overflow-hidden">
        <MapContainer 
          center={[latitude, longitude]} 
          zoom={14} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%', background: '#08090c' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[latitude, longitude]} icon={tacticalIcon} />
          <MapController center={[latitude, longitude]} />
        </MapContainer>
        
        {/* CRT Scanline overlay on map */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-[400]" />
      </div>

      <div className="mt-4 flex flex-col gap-1 text-sm font-mono text-muted-foreground uppercase">
        <div className="flex justify-between border-b border-border/50 pb-1">
          <span>LAT</span>
          <span className="text-white">{latitude.toFixed(6)}°</span>
        </div>
        <div className="flex justify-between border-b border-border/50 pb-1">
          <span>LON</span>
          <span className="text-white">{longitude.toFixed(6)}°</span>
        </div>
        {altitude !== undefined && (
          <div className="flex justify-between border-b border-border/50 pb-1">
            <span>ALT</span>
            <span className="text-white">{altitude.toFixed(2)}m</span>
          </div>
        )}
      </div>
    </HudPanel>
  );
}
