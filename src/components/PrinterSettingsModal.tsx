import React from 'react';
import { PrinterSettings } from '../types';
import { X, Sliders, Check } from 'lucide-react';

interface PrinterSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrinterSettings;
  onSave: (settings: PrinterSettings) => void;
}

export const PrinterSettingsModal: React.FC<PrinterSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof PrinterSettings, value: any) => {
    onSave({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 text-white rounded-lg">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Printer & Layout Config</h2>
              <p className="text-xs text-slate-500">Fine-tune sticker text and Zebra alignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Default Tare Weight */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              DEFAULT TARE WEIGHT (KG)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.defaultTareWeight}
              onChange={(e) => handleChange('defaultTareWeight', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Subtracted automatically from Gross Weight to calculate Net Weight.
            </span>
          </div>

          {/* Label Column Width (px) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              LABEL COLUMN WIDTH (PX)
            </label>
            <input
              type="number"
              min="140"
              max="300"
              value={settings.labelWidthPx || 195}
              onChange={(e) => handleChange('labelWidthPx', parseInt(e.target.value) || 195)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Controls gap between label text (e.g. COUNTRY OF ORIGIN) and colon (:). Default 195px prevents overlap.
            </span>
          </div>

          {/* Font Family */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              STICKER FONT FAMILY
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Times New Roman">Times New Roman (Excel Default)</option>
              <option value="Arial">Arial (Sans-Serif Clean)</option>
              <option value="Courier New">Courier New (Monospaced Crisp)</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              FONT SIZE (PT)
            </label>
            <input
              type="number"
              step="0.5"
              min="8"
              max="20"
              value={settings.fontSizePt}
              onChange={(e) => handleChange('fontSizePt', parseFloat(e.target.value) || 11)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Layout Mode */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              DEFAULT PRINT LAYOUT MODE
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleChange('layoutMode', '2-up')}
                className={`py-2 px-3 border rounded-lg text-center font-bold transition ${
                  settings.layoutMode === '2-up'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                2-Up (Side-by-Side)
              </button>
              <button
                type="button"
                onClick={() => handleChange('layoutMode', '1-up')}
                className={`py-2 px-3 border rounded-lg text-center font-bold transition ${
                  settings.layoutMode === '1-up'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                1-Up (Single Roll)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
