import React, { useState, useEffect } from 'react';
import { StickerRecord, PrinterSettings, PresetDefaults } from './types';
import {
  INITIAL_DEMO_RECORDS,
  DEFAULT_PRINTER_SETTINGS,
} from './utils/excel';
import { Header } from './components/Header';
import { DatabaseTable } from './components/DatabaseTable';
import { QuickAddModal } from './components/QuickAddModal';
import { PrintSheetModal } from './components/PrintSheetModal';
import { PrinterSettingsModal } from './components/PrinterSettingsModal';

export default function App() {
  // LocalStorage state management with auto-sorting by Carton Number ascending (#1, #2, #3...)
  const [records, setRecords] = useState<StickerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('pvh_sticker_records');
      const loaded: StickerRecord[] = saved ? JSON.parse(saved) : INITIAL_DEMO_RECORDS;
      return loaded.sort((a, b) => (a.cartonNo || 0) - (b.cartonNo || 0));
    } catch {
      return INITIAL_DEMO_RECORDS.sort((a, b) => (a.cartonNo || 0) - (b.cartonNo || 0));
    }
  });

  const [printerSettings, setPrinterSettings] = useState<PrinterSettings>(() => {
    try {
      const saved = localStorage.getItem('pvh_printer_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PRINTER_SETTINGS,
          ...parsed,
          fontSizePt: parsed.fontSizePt || 17,
        };
      }
      return DEFAULT_PRINTER_SETTINGS;
    } catch {
      return DEFAULT_PRINTER_SETTINGS;
    }
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Print queue subset - always sorted by carton number
  const [printQueue, setPrintQueue] = useState<StickerRecord[]>(records);

  // Sync to private browser LocalStorage
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

  // Record CRUD operations with auto-sort by Carton Number ascending
  const handleAddRecords = (newRecords: StickerRecord[]) => {
    setRecords((prev) => {
      const combined = [...prev, ...newRecords];
      return combined.sort((a, b) => (a.cartonNo || 0) - (b.cartonNo || 0));
    });
  };

  const handleUpdateRecord = (updated: StickerRecord) => {
    setRecords((prev) => {
      const updatedList = prev.map((r) => (r.id === updated.id ? updated : r));
      return updatedList.sort((a, b) => (a.cartonNo || 0) - (b.cartonNo || 0));
    });
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
    setRecords((prev) => {
      const combined = [...prev, dup];
      return combined.sort((a, b) => (a.cartonNo || 0) - (b.cartonNo || 0));
    });
  };

  // Open print modal with custom record set sorted by Carton Number
  const triggerPrintForRecords = (targetRecords: StickerRecord[]) => {
    const sortedTarget = [...targetRecords].sort(
      (a, b) => (a.cartonNo || 0) - (b.cartonNo || 0)
    );
    setPrintQueue(sortedTarget);
    setIsPrintModalOpen(true);
  };

  const triggerPrintAll = () => {
    const sortedAll = [...records].sort(
      (a, b) => (a.cartonNo || 0) - (b.cartonNo || 0)
    );
    setPrintQueue(sortedAll);
    setIsPrintModalOpen(true);
  };

  const presetDefaults: PresetDefaults = {
    seasonYear: records[0]?.seasonYear || 'SP27',
    countryOfOrigin: records[0]?.countryOfOrigin || 'SRI LANKA',
    poNumber: records[0]?.poNumber || '4100059739',
    tareWeight: printerSettings.defaultTareWeight || 0.45,
    defaultLengthInch: records[0]?.lengthInch || 23.5,
    defaultWidthInch: records[0]?.widthInch || 15.0,
    defaultHeightInch: records[0]?.heightInch || 11.5,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* App Header - Hidden during print */}
      <div className="print:hidden">
        <Header
          records={records}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenPrintModal={triggerPrintAll}
        />
      </div>

      {/* Main Content Workspace - Hidden during print */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 print:hidden">
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
