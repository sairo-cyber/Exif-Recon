import React from 'react';
import { ExifData } from '../types/exif';
import { HudPanel } from './HudPanel';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface ExifInspectorProps {
  data: ExifData;
}

interface FieldProps {
  label: string;
  value: string | number | undefined | null;
  delay: number;
}

function Field({ label, value, delay }: FieldProps) {
  if (value === undefined || value === null || value === '') return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.02 + 0.3, duration: 0.3 }}
      className="mb-3"
    >
      <div className="text-[10px] text-muted-foreground font-mono mb-0.5 uppercase tracking-wider">{label}</div>
      <div className="text-sm text-white font-mono break-all">{String(value)}</div>
    </motion.div>
  );
}

interface SectionProps {
  title: string;
  fields: { label: string; value: any }[];
  startIndex: number;
}

function Section({ title, fields, startIndex }: SectionProps) {
  const validFields = fields.filter(f => f.value !== undefined && f.value !== null && f.value !== '');
  if (validFields.length === 0) return null;

  return (
    <div className="mb-8 relative pl-3">
      {/* Left accent border */}
      <motion.div 
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <div className="text-xs font-bold text-cyan/70 font-mono mb-3 tracking-widest uppercase border-b border-border/50 pb-1 inline-block pr-4">
        {title}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        {validFields.map((f, i) => (
          <Field key={f.label} label={f.label} value={f.value} delay={startIndex + i} />
        ))}
      </div>
    </div>
  );
}

export function ExifInspector({ data }: ExifInspectorProps) {
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

  let fieldIndex = 0;

  return (
    <HudPanel title="METADATA READOUT" icon={<Terminal className="w-4 h-4 text-cyan" />} delay={0.2} className="h-full">
      <Section 
        title="CAMERA" 
        startIndex={fieldIndex += 10}
        fields={[
          { label: 'Make', value: data.Make },
          { label: 'Model', value: data.Model },
          { label: 'Software', value: data.Software },
        ]} 
      />
      <Section 
        title="LENS" 
        startIndex={fieldIndex += 10}
        fields={[
          { label: 'Lens Model', value: data.LensModel },
          { label: 'Lens Make', value: data.LensMake },
          { label: 'Focal Length', value: data.FocalLength ? `${data.FocalLength}mm` : undefined },
          { label: 'Focal Length (35mm)', value: data.FocalLengthIn35mmFilm ? `${data.FocalLengthIn35mmFilm}mm` : undefined },
        ]} 
      />
      <Section 
        title="EXPOSURE" 
        startIndex={fieldIndex += 10}
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
        startIndex={fieldIndex += 10}
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
        startIndex={fieldIndex += 10}
        fields={[
          { label: 'Original', value: formatDate(data.DateTimeOriginal) },
          { label: 'Created', value: formatDate(data.CreateDate) },
          { label: 'Modified', value: formatDate(data.ModifyDate) },
        ]} 
      />
      <Section 
        title="DEVICE / SOFTWARE" 
        startIndex={fieldIndex += 10}
        fields={[
          { label: 'Host Computer', value: data.HostComputer },
          { label: 'Processing Software', value: data.ProcessingSoftware },
        ]} 
      />
      
      {/* Catch-all for any other strings/numbers we didn't explicitly map, if we want to show them? 
          Actually, instruction says: "Groups to display... (only show fields that actually exist)"
          We'll stick to the specific groups mentioned to keep it clean. */}
    </HudPanel>
  );
}
