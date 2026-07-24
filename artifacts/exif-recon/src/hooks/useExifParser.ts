import { useState, useCallback } from 'react';
import exifr from 'exifr';
import SparkMD5 from 'spark-md5';
import { ExifData } from '../types/exif';

export interface ImageMeta {
  width: number;
  height: number;
  size: number;
  name: string;
  type: string;
  url: string;
  sha256: string;
  md5: string;
  lastModified: number;
}

export function useExifParser() {
  const [data, setData] = useState<ExifData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);

  const parseFile = useCallback(async (file: File) => {
    setIsParsing(true);
    setError(null);
    setData(null);

    if (!file.type.match(/image\/(jpeg|png|webp|heic)/)) {
      setError(`UNSUPPORTED FORMAT // ${file.name}`);
      setIsParsing(false);
      return false;
    }

    try {
      const buffer = await file.arrayBuffer();
      
      // SHA-256
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // MD5
      const md5 = SparkMD5.ArrayBuffer.hash(buffer);

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
        sha256,
        md5,
        lastModified: file.lastModified
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
        setData({} as ExifData); // Still set empty object so UI knows file is loaded
      } else {
        setData(parsedData as ExifData);
      }
      return true;
    } catch (err) {
      console.error(err);
      setError('METADATA PARSE FAILURE // EXIF data corrupted or missing');
      return false;
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
