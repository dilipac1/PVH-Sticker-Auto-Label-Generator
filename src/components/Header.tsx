import React from 'react';
import { Printer, Sliders, Tag } from 'lucide-react';
import { StickerRecord } from '../types';

interface HeaderProps {
  records: StickerRecord[];
  onOpenSettings: () => void;
  onOpenPrintModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  records,
  onOpenSettings,
  onOpenPrintModal,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-inner flex items-center justify-center">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              PVH Carton Sticker Generator
            </h1>
            <p className="text-xs text-slate-400">
              Automated Carton Label Printer for Zebra ZT410 (4" x 12")
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Config Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition"
            title="Printer & Layout Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Auto Print All Button */}
          <button
            onClick={onOpenPrintModal}
            disabled={records.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print All ({records.length})
          </button>
        </div>
      </div>
    </header>
  );
};
