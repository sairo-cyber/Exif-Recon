import React, { useState, useEffect } from 'react';
import { ExifData } from '../types/exif';
import { HudPanel } from './HudPanel';

function TypewriterValue({ text, delayMs = 15 }: { text: string; delayMs?: number }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, delayMs);
    return () => clearInterval(timer);
  }, [text, delayMs]);
  
  return <span>{displayed}</span>;
}

interface FieldProps {
  label: string;
  value: string | number | undefined | null;
}

function Field({ label, value }: FieldProps) {
  if (value === undefined || value === null || value === '') return null;
  const strVal = String(value);
  
  return (
    <div className="flex justify-between items-end border-b border-[rgba(38,44,51,0.4)] py-1.5 mb-1 group">
      <div className="text-[11px] text-[rgba(0,240,255,0.5)] font-mono uppercase tracking-wider">
        {label}
      </div>
      <div className="text-[10px] text-muted-foreground/30 font-mono flex-1 overflow-hidden mx-4 tracking-widest hidden md:block group-hover:text-muted-foreground/50 transition-colors">
        .................................................................................................................
      </div>
      <div className="text-[12px] text-white font-mono text-right truncate max-w-[60%]">
        <TypewriterValue text={strVal} />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  fields: { label: string; value: any }[];
}

function Section({ title, fields }: SectionProps) {
  const validFields = fields.filter(f => f.value !== undefined && f.value !== null && f.value !== '');
  if (validFields.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <div className="flex-1 h-[1px] bg-border/40" />
        <span className="text-[10px] font-mono text-cyan/50 uppercase px-3 tracking-[0.3em]">
          {title}
        </span>
        <div className="flex-1 h-[1px] bg-border/40" />
      </div>
      <div className="flex flex-col">
        {validFields.map(f => (
          <Field key={f.label} label={f.label} value={f.value} />
        ))}
      </div>
    </div>
  );
}

export function ExifInspector({ data }: { data: ExifData }) {
  const formatDate = (val: string | Date | undefined) => {
    if (!val) return undefined;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      return d.toISOString().replace('T', ' ').substring(0, 19);
    } catch {
      return String(val);
    }
  };

  const formatFraction = (val: any) => {
    if (typeof val === 'number') {
      if (val > 0 && val < 1) {
        return `1/${Math.round(1/val)}`;
      }
      return val;
    }
    return val;
  };

  return (
    <HudPanel title="DATA STREAM" delay={0.2} className="h-full">
      <Section 
        title="CAMERA" 
        fields={[
          { label: 'Make', value: data.Make },
          { label: 'Model', value: data.Model },
          { label: 'Software', value: data.Software },
        ]} 
      />
      <Section 
        title="LENS" 
        fields={[
          { label: 'Lens Model', value: data.LensModel },
          { label: 'Lens Make', value: data.LensMake },
          { label: 'Focal Length', value: data.FocalLength ? `${data.FocalLength}mm` : undefined },
          { label: 'Focal Length (35mm)', value: data.FocalLengthIn35mmFilm ? `${data.FocalLengthIn35mmFilm}mm` : undefined },
        ]} 
      />
      <Section 
        title="EXPOSURE" 
        fields={[
          { label: 'Exposure Time', value: data.ExposureTime ? `${formatFraction(data.ExposureTime)}s` : undefined },
          { label: 'F-Number', value: data.FNumber ? `f/${data.FNumber}` : undefined },
          { label: 'ISO', value: data.ISO },
          { label: 'Exposure Program', value: data.ExposureProgram },
          { label: 'Exposure Mode', value: data.ExposureMode },
          { label: 'Exposure Bias', value: data.ExposureBias ? `${data.ExposureBias} EV` : undefined },
          { label: 'Metering Mode', value: data.MeteringMode },
          { label: 'Flash', value: data.Flash },
        ]} 
      />
      <Section 
        title="IMAGE PROPERTIES" 
        fields={[
          { label: 'Width', value: data.ImageWidth ? `${data.ImageWidth}px` : undefined },
          { label: 'Height', value: data.ImageHeight ? `${data.ImageHeight}px` : undefined },
          { label: 'Orientation', value: data.Orientation },
          { label: 'Color Space', value: data.ColorSpace },
          { label: 'Bits Per Sample', value: data.BitsPerSample },
        ]} 
      />
      <Section 
        title="DATE / TIME" 
        fields={[
          { label: 'Original', value: formatDate(data.DateTimeOriginal) },
          { label: 'Created', value: formatDate(data.CreateDate) },
          { label: 'Modified', value: formatDate(data.ModifyDate) },
        ]} 
      />
      <Section 
        title="DEVICE / SOFTWARE" 
        fields={[
          { label: 'Host Computer', value: data.HostComputer },
          { label: 'Processing Software', value: data.ProcessingSoftware },
        ]} 
      />
    </HudPanel>
  );
}
