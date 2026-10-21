import React from 'react';
import { StickerRecord, PrinterSettings } from '../types';
import { SingleSticker, TwoUpStickerPair } from './StickerView';
import { Printer, X } from 'lucide-react';

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
}) => {
  if (!isOpen || records.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  // Group records into pairs for 2-up layout
  const pairs: { left: StickerRecord; right?: StickerRecord }[] = [];
  for (let i = 0; i < records.length; i += 2) {
    pairs.push({
      left: records[i],
      right: records[i + 1],
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 overflow-hidden print:p-0 print:bg-white print:static print:inset-auto">
      {/* Expanded Modal Box: max-w-[1320px] fits 12" sheet cleanly without scrollbar */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-[1320px] w-[96vw] max-h-[95vh] flex flex-col my-auto overflow-hidden print:max-w-none print:w-full print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Header - Hidden in Print */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Sticker Print Preview ({records.length} Stickers)</h2>
              <p className="text-xs text-slate-300">
                Exact 4" x 12" Zebra Stock Layout (2 Stickers per 12" x 4" Page).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Printable Content Container - Fits cleanly on screen without scrollbar */}
        <div className="flex-1 p-6 bg-slate-200 overflow-visible flex items-center justify-center print:bg-white print:p-0">
          <div
            id="printable-sheet"
            className="printable-only-area w-full max-w-[1260px] bg-white p-5 rounded-lg shadow-lg border border-gray-200 print:shadow-none print:border-none print:p-0 print:max-w-none print:w-full print:bg-white"
          >
            <div className="space-y-6 print:space-y-0">
              {pairs.map((pair, index) => (
                <TwoUpStickerPair
                  key={`pair-${index}`}
                  leftRecord={pair.left}
                  rightRecord={pair.right}
                  settings={settings}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer - Hidden in Print */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between print:hidden">
          <span>
            Target Stock: <strong>Zebra ZT410 (4" x 12" Landscape)</strong>. Strictly 2 stickers per page.
          </span>
          <span className="font-mono text-slate-700">
            Font: {settings.fontFamily} ({settings.fontSizePt}pt)
          </span>
        </div>
      </div>
    </div>
  );
};
