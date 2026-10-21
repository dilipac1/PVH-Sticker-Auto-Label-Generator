import React, { useState, useEffect } from 'react';
import { StickerRecord, PresetDefaults } from '../types';
import { convertInchToCmStr, calculateNetWeight } from '../utils/excel';
import { SingleSticker } from './StickerView';
import { X, Plus, Sparkles, Calculator, CheckCircle2 } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecords: (records: StickerRecord[]) => void;
  presetDefaults: PresetDefaults;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddRecords,
  presetDefaults,
}) => {
  const [poNumber, setPoNumber] = useState(presetDefaults.poNumber);
  const [seasonYear, setSeasonYear] = useState(presetDefaults.seasonYear);
  const [countryOfOrigin, setCountryOfOrigin] = useState(presetDefaults.countryOfOrigin);
  const [tareWeight, setTareWeight] = useState<string | number>(presetDefaults.tareWeight || 0.45);
  const [grossWeight, setGrossWeight] = useState<string | number>(3.20);

  // Dimensions in inches
  const [lengthInch, setLengthInch] = useState<string | number>(presetDefaults.defaultLengthInch || 23.5);
  const [widthInch, setWidthInch] = useState<string | number>(presetDefaults.defaultWidthInch || 15.0);
  const [heightInch, setHeightInch] = useState<string | number>(presetDefaults.defaultHeightInch || 11.5);

  // Quantity - default empty string with placeholder so typing 3 gives 3, not 13
  const [quantityStr, setQuantityStr] = useState<string>('');
  const [cartonCounter, setCartonCounter] = useState(1);

  // Toast / Success notification state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const numGross = parseFloat(String(grossWeight)) || 0;
  const numTare = parseFloat(String(tareWeight)) || 0;
  const numL = parseFloat(String(lengthInch)) || 0;
  const numW = parseFloat(String(widthInch)) || 0;
  const numH = parseFloat(String(heightInch)) || 0;

  // Real-time conversion state
  const [computed, setComputed] = useState(() =>
    convertInchToCmStr(numL, numW, numH)
  );
  const [netWeight, setNetWeight] = useState(() =>
    calculateNetWeight(numGross, numTare)
  );

  useEffect(() => {
    setComputed(convertInchToCmStr(numL, numW, numH));
  }, [numL, numW, numH]);

  useEffect(() => {
    setNetWeight(calculateNetWeight(numGross, numTare));
  }, [numGross, numTare]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantityStr) || 1;
    const newRecords: StickerRecord[] = [];

    for (let i = 0; i < qty; i++) {
      const currentGross = numGross;
      const currentNet = calculateNetWeight(currentGross, numTare);

      newRecords.push({
        id: `rec-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
        cartonNo: cartonCounter + i,
        totalCartons: qty > 1 ? cartonCounter + qty - 1 : 1,
        grossWeight: currentGross,
        netWeight: currentNet,
        tareWeight: numTare,
        lengthInch: numL,
        widthInch: numW,
        heightInch: numH,
        lengthCm: computed.lengthCm,
        widthCm: computed.widthCm,
        heightCm: computed.heightCm,
        measurementStr: computed.measurementStr,
        seasonYear: seasonYear.toUpperCase().trim(),
        countryOfOrigin: countryOfOrigin.toUpperCase().trim(),
        poNumber: poNumber.trim(),
        createdAt: new Date().toISOString(),
      });
    }

    onAddRecords(newRecords);

    // Show floating toast message in bottom right corner
    const addedCount = newRecords.length;
    setSuccessMsg(
      `Added ${addedCount} sticker${addedCount > 1 ? 's' : ''} (PO: ${poNumber.trim()}).`
    );

    // Auto-increment carton number for next addition
    setCartonCounter((prev) => prev + qty);

    // Reset quantity back to empty placeholder
    setQuantityStr('');

    // Auto hide success toast after 3.5 seconds
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3500);
  };

  const previewRecord: StickerRecord = {
    id: 'preview',
    cartonNo: cartonCounter,
    grossWeight: numGross,
    netWeight,
    tareWeight: numTare,
    lengthInch: numL,
    widthInch: numW,
    heightInch: numH,
    lengthCm: computed.lengthCm,
    widthCm: computed.widthCm,
    heightCm: computed.heightCm,
    measurementStr: computed.measurementStr,
    seasonYear: seasonYear.toUpperCase().trim() || 'SP27',
    countryOfOrigin: countryOfOrigin.toUpperCase().trim() || 'SRI LANKA',
    poNumber: poNumber.trim() || '4100059739',
    createdAt: new Date().toISOString(),
  };

  const currentQtyDisplay = parseInt(quantityStr) || 1;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
        {/* Modal Container: Extra Wide & Fits without scrollbar */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-6xl w-full my-auto overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg shadow-xs">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Create Carton Sticker(s)</h2>
                <p className="text-xs text-slate-500">
                  Enter Gross Weight and Inch Dimensions. Modal stays open for continuous entry.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Form Inputs (Left side) */}
            <div className="md:col-span-7 space-y-3.5">
              {/* Row 1: PO & Season & Country */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    PO NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={poNumber}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 4100059739"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    SEASON/YEAR
                  </label>
                  <input
                    type="text"
                    required
                    value={seasonYear}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setSeasonYear(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. SP27"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    COUNTRY OF ORIGIN
                  </label>
                  <input
                    type="text"
                    required
                    value={countryOfOrigin}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. SRI LANKA"
                  />
                </div>
              </div>

              {/* Row 2: Gross Weight & Tare & Net Weight */}
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-blue-600" />
                    WEIGHT CALCULATOR (KG)
                  </span>
                  <span className="text-slate-500 font-normal text-[11px]">
                    Net = Gross - Tare (0.45 KG)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      GROSS WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={grossWeight}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setGrossWeight(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      TARE WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={tareWeight}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setTareWeight(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      CALCULATED NET (KG)
                    </label>
                    <div className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono font-bold bg-slate-100 text-slate-800">
                      {netWeight.toFixed(2)} KG
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Inch Dimensions & Auto CM Concatenate */}
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    MEASUREMENT: INCH TO CM FORMULA
                  </span>
                  <span className="text-[11px] font-mono text-amber-800">1 INCH = 2.54 CM</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      LENGTH (INCH)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={lengthInch}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setLengthInch(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                      = {computed.lengthCm} CM
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      WIDTH (INCH)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={widthInch}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setWidthInch(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                      = {computed.widthCm} CM
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      HEIGHT (INCH)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={heightInch}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setHeightInch(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                      = {computed.heightCm} CM
                    </span>
                  </div>
                </div>

                {/* Formatted Output */}
                <div className="pt-0.5 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-slate-600">
                    OUTPUT:
                  </span>
                  <div className="flex-1 px-2.5 py-1 text-xs font-mono font-bold bg-white border border-amber-300 text-slate-900 rounded-md tracking-wide">
                    {computed.measurementStr}
                  </div>
                </div>
              </div>

              {/* Quantity Input - Empty default with auto select onFocus */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  QUANTITY OF STICKERS
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantityStr}
                  placeholder="1"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setQuantityStr(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-bold"
                />
              </div>
            </div>

            {/* Right Column: Live Sticker Preview */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
                  <span>LIVE STICKER PREVIEW</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    Zebra 4" x 12" Format
                  </span>
                </div>

                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-center">
                  <div className="bg-white p-3 shadow-md rounded-md w-full border border-gray-300">
                    <SingleSticker record={previewRecord} isCompact={true} />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Close Window
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add {currentQtyDisplay > 1 ? `${currentQtyDisplay} Stickers` : '1 Sticker'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* FLOATING TOAST NOTIFICATION - BOTTOM RIGHT CORNER */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 transition transform animate-slideUp">
          <div className="p-2 bg-emerald-500 text-white rounded-xl shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-400">Sticker Saved!</p>
            <p className="text-[11px] text-slate-200 font-medium">{successMsg}</p>
          </div>
        </div>
      )}
    </>
  );
};
