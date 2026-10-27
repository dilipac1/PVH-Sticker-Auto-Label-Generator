import * as XLSX from 'xlsx';
import { StickerRecord, PrinterSettings } from '../types';

/**
 * Converts inches to CM and formats measurement string:
 * Example: 23.5 in, 15 in, 11.5 in => 59.69X38.1X29.21 CM
 */
export function convertInchToCmStr(lInch: number, wInch: number, hInch: number): {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  measurementStr: string;
} {
  const lCm = Math.round(lInch * 2.54 * 100) / 100;
  const wCm = Math.round(wInch * 2.54 * 100) / 100;
  const hCm = Math.round(hInch * 2.54 * 100) / 100;

  // Format numbers to strip redundant trailing zeros if whole/single decimal (e.g. 38.1 instead of 38.10)
  const formatCm = (num: number) => {
    if (Number.isInteger(num)) return num.toString();
    const str = num.toFixed(2);
    return str.endsWith('0') ? str.slice(0, -1) : str;
  };

  // Removed last X before CM and replaced with a space as requested
  const str = `${formatCm(lCm)}X${formatCm(wCm)}X${formatCm(hCm)} CM`;

  return {
    lengthCm: lCm,
    widthCm: wCm,
    heightCm: hCm,
    measurementStr: str,
  };
}

export function formatWeight(weight: number): string {
  if (isNaN(weight)) return '0.00 KG';
  return `${weight.toFixed(2)} KG`;
}

export function calculateNetWeight(grossWeight: number, tareWeight: number = 0.45): number {
  if (isNaN(grossWeight)) return 0;
  const net = grossWeight - tareWeight;
  return Math.max(0, Math.round(net * 100) / 100);
}

// Initial Sample Data from User Video & Image
export const INITIAL_DEMO_RECORDS: StickerRecord[] = [
  {
    id: 'demo-1',
    cartonNo: 1,
    totalCartons: 2,
    grossWeight: 3.20,
    netWeight: 2.75,
    tareWeight: 0.45,
    lengthInch: 23.5,
    widthInch: 15.0,
    heightInch: 11.5,
    lengthCm: 59.69,
    widthCm: 38.1,
    heightCm: 29.21,
    measurementStr: '59.69X38.1X29.21 CM',
    seasonYear: 'SP27',
    countryOfOrigin: 'SRI LANKA',
    poNumber: '4100059739',
    createdAt: new Date().toISOString(),
    notes: 'Carton 1 of 2 from Excel video sample',
  },
  {
    id: 'demo-2',
    cartonNo: 2,
    totalCartons: 2,
    grossWeight: 2.10,
    netWeight: 1.65,
    tareWeight: 0.45,
    lengthInch: 17.0,
    widthInch: 15.0,
    heightInch: 6.0,
    lengthCm: 43.18,
    widthCm: 38.1,
    heightCm: 15.24,
    measurementStr: '43.18X38.1X15.24 CM',
    seasonYear: 'SP27',
    countryOfOrigin: 'SRI LANKA',
    poNumber: '4100059739',
    createdAt: new Date().toISOString(),
    notes: 'Carton 2 of 2 from Excel video sample',
  },
];

export const DEFAULT_PRINTER_SETTINGS: PrinterSettings = {
  layoutMode: '2-up',
  paperSize: 'zebra-12x4', // Exact Zebra ZT410 (4.00 in x 12.00 in Landscape)
  defaultTareWeight: 0.45, // Default Tare Weight 0.45 KG
  fontSizePt: 17, // User requested 17pt default
  fontFamily: 'Arial',
  uppercaseOnly: true,
  labelWidthPx: 275, // Generous 275px label width
  columnWidthMm: 80,
  rowGapMm: 4,
  stickerWidthMm: 95,
  stickerHeightMm: 55,
  showBorder: false,
  showMargins: false,
  copiesPerSticker: 1,
};

// Export records to Excel file (.xlsx)
export function exportToExcel(records: StickerRecord[], filename = 'PVH_Stickers_Database.xlsx') {
  const data = records.map((r) => ({
    'PO NUMBER': r.poNumber,
    'CARTON NO': r.cartonNo || 1,
    'GROSS WEIGHT (KG)': r.grossWeight,
    'TARE WEIGHT (KG)': r.tareWeight,
    'NET WEIGHT (KG)': r.netWeight,
    'LENGTH (INCH)': r.lengthInch,
    'WIDTH (INCH)': r.widthInch,
    'HEIGHT (INCH)': r.heightInch,
    'MEASUREMENT (CM)': r.measurementStr,
    'SEASON/YEAR': r.seasonYear,
    'COUNTRY OF ORIGIN': r.countryOfOrigin,
    'DATE CREATED': new Date(r.createdAt).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Stickers');
  XLSX.writeFile(workbook, filename);
}

// Import records from Excel file (.xlsx or .csv)
export function parseExcelFile(file: File): Promise<Partial<StickerRecord>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

        const parsed: Partial<StickerRecord>[] = jsonData.map((row, index) => {
          const poNumber = String(row['PO NUMBER'] || row['PO'] || row['po_number'] || '4100059739').trim();
          const grossWeight = parseFloat(row['GROSS WEIGHT (KG)'] || row['GROSS WEIGHT'] || row['gross_weight'] || '0') || 0;
          const tareWeight = parseFloat(row['TARE WEIGHT (KG)'] || row['TARE WEIGHT'] || row['tare_weight'] || '0.45') || 0.45;

          const lIn = parseFloat(row['LENGTH (INCH)'] || row['LENGTH'] || row['l_inch'] || '23.5') || 23.5;
          const wIn = parseFloat(row['WIDTH (INCH)'] || row['WIDTH'] || row['w_inch'] || '15') || 15;
          const hIn = parseFloat(row['HEIGHT (INCH)'] || row['HEIGHT'] || row['h_inch'] || '11.5') || 11.5;

          const conv = convertInchToCmStr(lIn, wIn, hIn);
          const netWeight = calculateNetWeight(grossWeight, tareWeight);

          return {
            id: `import-${Date.now()}-${index}`,
            cartonNo: parseInt(row['CARTON NO'] || row['CARTON'] || `${index + 1}`),
            grossWeight,
            netWeight,
            tareWeight,
            lengthInch: lIn,
            widthInch: wIn,
            heightInch: hIn,
            lengthCm: conv.lengthCm,
            widthCm: conv.widthCm,
            heightCm: conv.heightCm,
            measurementStr: row['MEASUREMENT (CM)'] || conv.measurementStr,
            seasonYear: String(row['SEASON/YEAR'] || row['SEASON'] || 'SP27').trim().toUpperCase(),
            countryOfOrigin: String(row['COUNTRY OF ORIGIN'] || row['COUNTRY'] || 'SRI LANKA').trim().toUpperCase(),
            poNumber,
            createdAt: new Date().toISOString(),
          };
        });

        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
