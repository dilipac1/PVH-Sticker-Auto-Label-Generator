export interface StickerRecord {
  id: string;
  cartonNo?: number;
  totalCartons?: number;
  grossWeight: number; // in KG
  netWeight: number; // in KG
  tareWeight: number; // in KG (default 0.50)
  // Inches dimensions
  lengthInch: number;
  widthInch: number;
  heightInch: number;
  // Converted CM dimensions (calculated or manual override)
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  measurementStr: string; // e.g. "59.69X38.1X29.21XCM"
  seasonYear: string; // e.g. "SP27"
  countryOfOrigin: string; // e.g. "SRI LANKA"
  poNumber: string; // e.g. "4100059739"
  createdAt: string;
  notes?: string;
}

export interface PrinterSettings {
  layoutMode: '2-up' | '1-up'; // '2-up' for dual side-by-side like Excel print area, '1-up' for single thermal roll
  paperSize: 'zebra-12x4' | 'a4-landscape' | 'custom';
  defaultTareWeight: number; // Default 0.50 KG
  fontSizePt: number; // Font size in pt or px
  fontFamily: 'Arial' | 'Times New Roman' | 'Courier New' | 'Trebuchet MS';
  uppercaseOnly: boolean;
  labelWidthPx: number; // Width of label column (e.g. 195px)
  columnWidthMm: number;
  rowGapMm: number;
  stickerWidthMm: number;
  stickerHeightMm: number;
  showBorder: boolean;
  showMargins: boolean;
  copiesPerSticker: number;
}

export interface PresetDefaults {
  seasonYear: string;
  countryOfOrigin: string;
  poNumber: string;
  tareWeight: number;
  defaultLengthInch: number;
  defaultWidthInch: number;
  defaultHeightInch: number;
}
