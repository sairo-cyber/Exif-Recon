export interface ExifData {
  // CAMERA
  Make?: string;
  Model?: string;
  Software?: string;

  // LENS
  LensModel?: string;
  LensMake?: string;
  FocalLength?: number;
  FocalLengthIn35mmFilm?: number;

  // EXPOSURE
  ExposureTime?: number;
  FNumber?: number;
  ISO?: number;
  ExposureProgram?: string;
  ExposureMode?: string;
  ExposureBias?: number;
  MeteringMode?: string;
  Flash?: string;

  // IMAGE
  ImageWidth?: number;
  ImageHeight?: number;
  Orientation?: string;
  ColorSpace?: string;
  BitsPerSample?: number;

  // DATE/TIME
  DateTimeOriginal?: string | Date;
  CreateDate?: string | Date;
  ModifyDate?: string | Date;

  // GPS
  latitude?: number;
  longitude?: number;
  GPSAltitude?: number;
  GPSLatitude?: number | number[];
  GPSLongitude?: number | number[];

  // DEVICE/SOFTWARE
  HostComputer?: string;
  ProcessingSoftware?: string;

  [key: string]: any;
}
