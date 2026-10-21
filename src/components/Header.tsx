import React, { useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Printer,
  Sliders,
  RotateCcw,
  Tag,
  Sparkles,
} from 'lucide-react';
import { StickerRecord, PrinterSettings } from '../types';
import { exportToExcel, parseExcelFile } from '../utils/excel';

interface HeaderProps {
  records: StickerRecord[];
  onImportRecords: (newRecords: StickerRecord[]) => void;
  onOpenSettings: () => void;
  onOpenPrintModal: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  records,
  onImportRecords,
  onOpenSettings,
  onOpenPrintModal,
  onResetDemo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedPartial = await parseExcelFile(file);
      const fullRecords: StickerRecord[] = parsedPartial.map((p) => ({
        id: p.id || `imp-${Date.now()}-${Math.random()}`,
        cartonNo: p.cartonNo || 1,
        totalCartons: p.totalCartons || 1,
        grossWeight: p.grossWeight || 0,
        netWeight: p.netWeight || 0,
        tareWeight: p.tareWeight || 0.5,
        lengthInch: p.lengthInch || 23.5,
        widthInch: p.widthInch || 15,
        heightInch: p.heightInch || 11.5,
        lengthCm: p.lengthCm || 59.69,
        widthCm: p.widthCm || 38.1,
        heightCm: p.heightCm || 29.21,
        measurementStr: p.measurementStr || '59.69X38.1X29.21XCM',
        seasonYear: p.seasonYear || 'SP27',
        countryOfOrigin: p.countryOfOrigin || 'SRI LANKA',
        poNumber: p.poNumber || '4100059739',
        createdAt: new Date().toISOString(),
      }));

      onImportRecords(fullRecords);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      alert('Error reading Excel file. Please ensure it is a valid .xlsx or .csv file.');
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-inner flex items-center justify-center">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                PVH Sticker & Auto Label Generator
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Inch→CM Formula
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Auto-calculating Carton Sticker Printer matching exact Excel layout
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          {/* Import Excel */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
            title="Upload Excel or CSV file"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            Import Excel
          </button>

          {/* Export Excel */}
          <button
            onClick={() => exportToExcel(records)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
            title="Download database as Excel spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export Excel
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetDemo}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            title="Reset to Excel video demo records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo
          </button>

          {/* Config Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition"
            title="Printer & Layout Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Auto Print All Button */}
          <button
            onClick={onOpenPrintModal}
            disabled={records.length === 0}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print All ({records.length})
          </button>
        </div>
      </div>
    </header>
  );
};
