import React, { useState, useEffect } from 'react';
import { StickerRecord, PrinterSettings, PresetDefaults } from './types';
import {
  INITIAL_DEMO_RECORDS,
  DEFAULT_PRINTER_SETTINGS,
  convertInchToCmStr,
  calculateNetWeight,
} from './utils/excel';
import { Header } from './components/Header';
import { DatabaseTable } from './components/DatabaseTable';
import { QuickAddModal } from './components/QuickAddModal';
import { PrintSheetModal } from './components/PrintSheetModal';
import { PrinterSettingsModal } from './components/PrinterSettingsModal';
import { SingleSticker, TwoUpStickerPair } from './components/StickerView';
import {
  CheckCircle2,
  Sparkles,
  Calculator,
  Printer,
  FileSpreadsheet,
  Info,
  Sliders,
  ChevronRight,
  Layers,
} from 'lucide-react';

export default function App() {
  // LocalStorage state management
  const [records, setRecords] = useState<StickerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('pvh_sticker_records');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_RECORDS;
    } catch {
      return INITIAL_DEMO_RECORDS;
    }
  });

  const [printerSettings, setPrinterSettings] = useState<PrinterSettings>(() => {
    try {
      const saved = localStorage.getItem('pvh_printer_settings');
      return saved ? JSON.parse(saved) : DEFAULT_PRINTER_SETTINGS;
    } catch {
      return DEFAULT_PRINTER_SETTINGS;
    }
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Print queue subset (if printing selected records vs all)
  const [printQueue, setPrintQueue] = useState<StickerRecord[]>(records);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pvh_sticker_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('pvh_printer_settings', JSON.stringify(printerSettings));
  }, [printerSettings]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (filteredIds: string[]) => {
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Record CRUD operations
  const handleAddRecords = (newRecords: StickerRecord[]) => {
    setRecords((prev) => [...newRecords, ...prev]);
  };

  const handleUpdateRecord = (updated: StickerRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteRecords = (idsToDelete: string[]) => {
    setRecords((prev) => prev.filter((r) => !idsToDelete.includes(r.id)));
    setSelectedIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
  };

  const handleDuplicateRecord = (rec: StickerRecord) => {
    const dup: StickerRecord = {
      ...rec,
      id: `dup-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      cartonNo: (rec.cartonNo || 1) + 1,
      createdAt: new Date().toISOString(),
    };
    setRecords((prev) => [dup, ...prev]);
  };

  const handleResetDemo = () => {
    if (confirm('Reset database records to initial Excel demo data?')) {
      setRecords(INITIAL_DEMO_RECORDS);
      setSelectedIds([]);
    }
  };

  // Open print modal with custom record set
  const triggerPrintForRecords = (targetRecords: StickerRecord[]) => {
    setPrintQueue(targetRecords);
    setIsPrintModalOpen(true);
  };

  const triggerPrintAll = () => {
    setPrintQueue(records);
    setIsPrintModalOpen(true);
  };

  const presetDefaults: PresetDefaults = {
    seasonYear: records[0]?.seasonYear || 'SP27',
    countryOfOrigin: records[0]?.countryOfOrigin || 'SRI LANKA',
    poNumber: records[0]?.poNumber || '4100059739',
    tareWeight: printerSettings.defaultTareWeight || 0.5,
    defaultLengthInch: records[0]?.lengthInch || 23.5,
    defaultWidthInch: records[0]?.widthInch || 15.0,
    defaultHeightInch: records[0]?.heightInch || 11.5,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* App Header */}
      <Header
        records={records}
        onImportRecords={(imported) => {
          setRecords((prev) => [...imported, ...prev]);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenPrintModal={triggerPrintAll}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner Explaining Understanding from Video */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500 text-white tracking-wide uppercase">
                  Excel Video Formula Analyzed
                </span>
                <span className="text-slate-400 text-xs font-mono">
                  =CONCATENATE(P5,"X",Q5,"X",R5,"X",S5)
                </span>
              </div>
              <h2 className="text-base font-bold text-white">
                Automated PVH Sticker Generator & Batch Print Engine
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                As seen in your Excel video, dimensions entered in <strong>INCHES</strong> are multiplied by <strong>2.54</strong> to convert to <strong>CM</strong>, concatenated into <code className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded font-mono">59.69X38.1X29.21XCM</code> format, and combined with Gross & Net weight (<code className="bg-slate-800 text-emerald-300 px-1 py-0.5 rounded font-mono">Net = Gross - 0.50 KG</code>).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Add New Sticker
              </button>
            </div>
          </div>
        </div>

        {/* Live Sticker Preview Side-by-Side Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Exact Print Area Preview (Dual 2-Up Side-by-Side Format)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Matching your Excel print page preview ({records.length} records in DB)
            </span>
          </div>

          {/* 2-Up Sample Rendering */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto">
            {records.length > 0 ? (
              <TwoUpStickerPair
                leftRecord={records[0]}
                rightRecord={records[1] || records[0]}
                settings={printerSettings}
              />
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No stickers available to preview.
              </div>
            )}
          </div>
        </div>

        {/* Database Table Section */}
        <DatabaseTable
          records={records}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onUpdateRecord={handleUpdateRecord}
          onDeleteRecords={handleDeleteRecords}
          onDuplicateRecord={handleDuplicateRecord}
          onPrintRecords={triggerPrintForRecords}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Modals */}
      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRecords={handleAddRecords}
        presetDefaults={presetDefaults}
      />

      <PrintSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        records={printQueue}
        settings={printerSettings}
        onUpdateSettings={setPrinterSettings}
      />

      <PrinterSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={printerSettings}
        onSave={setPrinterSettings}
      />
    </div>
  );
}
