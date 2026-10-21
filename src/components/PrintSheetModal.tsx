import React, { useState } from 'react';
import { StickerRecord, PrinterSettings } from '../types';
import { SingleSticker, TwoUpStickerPair } from './StickerView';
import { Printer, X, Settings2, FileText, LayoutGrid } from 'lucide-react';

interface PrintSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: StickerRecord[];
  settings: PrinterSettings;
  onUpdateSettings: (settings: PrinterSettings) => void;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({
  isOpen,
  onClose,
  records,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen || records.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  // Group records for 2-up layout
  const pairs: { left: StickerRecord; right?: StickerRecord }[] = [];
  if (settings.layoutMode === '2-up') {
    for (let i = 0; i < records.length; i += 2) {
      pairs.push({
        left: records[i],
        right: records[i + 1],
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Screen only */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Sticker Print Preview ({records.length} Stickers)</h2>
              <p className="text-xs text-slate-300">
                Exact PVH Excel layout with Inch-to-CM formula output.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex bg-slate-800 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => onUpdateSettings({ ...settings, layoutMode: '2-up' })}
                className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                  settings.layoutMode === '2-up'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                2-Up Dual (Excel)
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, layoutMode: '1-up' })}
                className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                  settings.layoutMode === '1-up'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Single Thermal Roll
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Now
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Content Area */}
        <div className="flex-1 p-8 bg-slate-200 overflow-y-auto print:bg-white print:p-0 print:overflow-visible">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 print:shadow-none print:border-none print:p-0 print:max-w-none">
            {settings.layoutMode === '2-up' ? (
              <div className="space-y-6 print:space-y-4">
                {pairs.map((pair, index) => (
                  <TwoUpStickerPair
                    key={`pair-${index}`}
                    leftRecord={pair.left}
                    rightRecord={pair.right}
                    settings={settings}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6 print:space-y-0">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 bg-white border border-gray-300 rounded mb-4 print:border-none print:m-0 print:p-0 page-break-after-always"
                  >
                    <SingleSticker record={rec} settings={settings} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info - Screen only */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between print:hidden">
          <span>
            Ready to print on <strong>Zebra ZD410 / standard printer</strong> using 2-up thermal sticker format.
          </span>
          <span className="font-mono text-slate-700">
            Font: {settings.fontFamily} ({settings.fontSizePt}pt)
          </span>
        </div>
      </div>
    </div>
  );
};
