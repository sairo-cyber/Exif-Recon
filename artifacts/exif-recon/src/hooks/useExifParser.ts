import { useState, useCallback } from 'react';
import exifr from 'exifr';
import { ExifData } from '../types/exif';

export function useExifParser() {
  const [data, setData] = useState<ExifData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [imageMeta, setImageMeta] = useState<{
    width: number;
    height: number;
    size: number;
    name: string;
    type: string;
    url: string;
  } | null>(null);

  const parseFile = useCallback(async (file: File) => {
    setIsParsing(true);
    setError(null);
    setData(null);

    if (!file.type.match(/image\/(jpeg|png|webp|heic)/)) {
      setError(`UNSUPPORTED FORMAT // ${file.name}`);
      setIsParsing(false);
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      setImageMeta({
        width: img.width,
        height: img.height,
        size: file.size,
        name: file.name,
        type: file.type,
        url,
      });

      const parsedData = await exifr.parse(file, {
        tiff: true,
        xmp: true,
        icc: true,
        iptc: true,
        exif: true,
        gps: true
      });

      if (!parsedData || Object.keys(parsedData).length === 0) {
        setError('NO METADATA DETECTED // File contains no embedded EXIF data');
      } else {
        setData(parsedData as ExifData);
      }
    } catch (err) {
      console.error(err);
      setError('METADATA PARSE FAILURE // EXIF data corrupted or missing');
    } finally {
      setIsParsing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setImageMeta(null);
  }, []);

  return { parseFile, reset, data, error, isParsing, imageMeta };
}
