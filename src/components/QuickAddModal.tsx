import React, { useState, useEffect } from 'react';
import { StickerRecord, PresetDefaults } from '../types';
import { convertInchToCmStr, calculateNetWeight } from '../utils/excel';
import { SingleSticker } from './StickerView';
import { X, Plus, Sparkles, Calculator } from 'lucide-react';

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
  const [tareWeight, setTareWeight] = useState(presetDefaults.tareWeight);
  const [grossWeight, setGrossWeight] = useState(3.20);

  // Dimensions in inches
  const [lengthInch, setLengthInch] = useState(presetDefaults.defaultLengthInch || 23.5);
  const [widthInch, setWidthInch] = useState(presetDefaults.defaultWidthInch || 15.0);
  const [heightInch, setHeightInch] = useState(presetDefaults.defaultHeightInch || 11.5);

  // Quantity / Batch range
  const [quantity, setQuantity] = useState(1);
  const [startCartonNo, setStartCartonNo] = useState(1);
  const [autoIncrementWeight, setAutoIncrementWeight] = useState(false);

  // Real-time conversion state
  const [computed, setComputed] = useState(() =>
    convertInchToCmStr(lengthInch, widthInch, heightInch)
  );
  const [netWeight, setNetWeight] = useState(() =>
    calculateNetWeight(grossWeight, tareWeight)
  );

  useEffect(() => {
    setComputed(convertInchToCmStr(lengthInch, widthInch, heightInch));
  }, [lengthInch, widthInch, heightInch]);

  useEffect(() => {
    setNetWeight(calculateNetWeight(grossWeight, tareWeight));
  }, [grossWeight, tareWeight]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecords: StickerRecord[] = [];

    for (let i = 0; i < quantity; i++) {
      const currentGross = autoIncrementWeight
        ? Math.round((grossWeight + i * 0.1) * 100) / 100
        : grossWeight;
      const currentNet = calculateNetWeight(currentGross, tareWeight);

      newRecords.push({
        id: `rec-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        cartonNo: startCartonNo + i,
        totalCartons: quantity > 1 ? startCartonNo + quantity - 1 : 1,
        grossWeight: currentGross,
        netWeight: currentNet,
        tareWeight,
        lengthInch,
        widthInch,
        heightInch,
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
    onClose();
  };

  const previewRecord: StickerRecord = {
    id: 'preview',
    cartonNo: startCartonNo,
    grossWeight,
    netWeight,
    tareWeight,
    lengthInch,
    widthInch,
    heightInch,
    lengthCm: computed.lengthCm,
    widthCm: computed.widthCm,
    heightCm: computed.heightCm,
    measurementStr: computed.measurementStr,
    seasonYear: seasonYear.toUpperCase().trim() || 'SP27',
    countryOfOrigin: countryOfOrigin.toUpperCase().trim() || 'SRI LANKA',
    poNumber: poNumber.trim() || '4100059739',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Create Carton Sticker(s)</h2>
              <p className="text-xs text-slate-500">
                Enter Gross Weight and Inch Dimensions. Inch to CM formula auto-converts.
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

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Form Inputs (Left side) */}
          <div className="md:col-span-7 space-y-4">
            {/* Row 1: PO & Season & Country */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PO NUMBER
                </label>
                <input
                  type="text"
                  required
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 4100059739"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SEASON/YEAR
                </label>
                <input
                  type="text"
                  required
                  value={seasonYear}
                  onChange={(e) => setSeasonYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. SP27"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  COUNTRY OF ORIGIN
                </label>
                <input
                  type="text"
                  required
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. SRI LANKA"
                />
              </div>
            </div>

            {/* Row 2: Gross Weight & Tare & Net Weight */}
            <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  WEIGHT CALCULATOR (KG)
                </span>
                <span className="text-slate-500 font-normal text-[11px]">
                  Net = Gross - Tare (0.50 KG)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GROSS WEIGHT (KG)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    TARE WEIGHT (KG)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={tareWeight}
                    onChange={(e) => setTareWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CALCULATED NET (KG)
                  </label>
                  <div className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono font-bold bg-slate-100 text-slate-800">
                    {netWeight.toFixed(2)} KG
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Inch Dimensions & Auto CM Concatenate */}
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  MEASUREMENT: INCH TO CM FORMULA
                </span>
                <span className="text-xs font-mono text-amber-800">1 INCH = 2.54 CM</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LENGTH (INCH)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={lengthInch}
                    onChange={(e) => setLengthInch(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    = {computed.lengthCm} CM
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WIDTH (INCH)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={widthInch}
                    onChange={(e) => setWidthInch(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    = {computed.widthCm} CM
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    HEIGHT (INCH)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={heightInch}
                    onChange={(e) => setHeightInch(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    = {computed.heightCm} CM
                  </span>
                </div>
              </div>

              {/* Formatted CONCATENATE Output */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  EXCEL CONCATENATE OUTPUT (Printed on Sticker):
                </span>
                <div className="w-full px-3 py-2 text-sm font-mono font-bold bg-white border border-amber-300 text-slate-900 rounded-lg tracking-wide">
                  {computed.measurementStr}
                </div>
              </div>
            </div>

            {/* Batch / Quantity Option */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  QUANTITY OF STICKERS
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  START CARTON NUMBER
                </label>
                <input
                  type="number"
                  min="1"
                  value={startCartonNo}
                  onChange={(e) => setStartCartonNo(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Sticker Preview */}
          <div className="md:col-span-5 flex flex-col">
            <div className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
              <span>LIVE STICKER PREVIEW</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                PVH Excel Format
              </span>
            </div>

            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex-1 flex items-center justify-center">
              <div className="bg-white p-4 shadow-md rounded-md w-full border border-gray-300">
                <SingleSticker record={previewRecord} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add {quantity > 1 ? `${quantity} Stickers` : '1 Sticker'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
