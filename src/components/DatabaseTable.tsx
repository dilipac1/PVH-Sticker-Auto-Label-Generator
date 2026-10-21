import React, { useState } from 'react';
import { StickerRecord } from '../types';
import { convertInchToCmStr, calculateNetWeight, formatWeight } from '../utils/excel';
import {
  Printer,
  Trash2,
  Copy,
  Plus,
  Search,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Check,
} from 'lucide-react';

interface DatabaseTableProps {
  records: StickerRecord[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (filteredIds: string[]) => void;
  onUpdateRecord: (updated: StickerRecord) => void;
  onDeleteRecords: (ids: string[]) => void;
  onDuplicateRecord: (record: StickerRecord) => void;
  onPrintRecords: (records: StickerRecord[]) => void;
  onOpenAddModal: () => void;
}

export const DatabaseTable: React.FC<DatabaseTableProps> = ({
  records,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onUpdateRecord,
  onDeleteRecords,
  onDuplicateRecord,
  onPrintRecords,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeason, setFilterSeason] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get unique seasons for filtering dropdown
  const uniqueSeasons = Array.from(new Set(records.map((r) => r.seasonYear))).filter(Boolean);

  // Filter records based on search and dropdown
  const filteredRecords = records.filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      r.poNumber.toLowerCase().includes(query) ||
      r.seasonYear.toLowerCase().includes(query) ||
      r.countryOfOrigin.toLowerCase().includes(query) ||
      r.measurementStr.toLowerCase().includes(query) ||
      (r.cartonNo && r.cartonNo.toString().includes(query));

    const matchesSeason = filterSeason === 'ALL' || r.seasonYear === filterSeason;

    return matchesQuery && matchesSeason;
  });

  const filteredIds = filteredRecords.map((r) => r.id);
  const isAllSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));

  // Inline edit handlers
  const handleCellChange = (
    record: StickerRecord,
    field: keyof StickerRecord,
    value: any
  ) => {
    let updated = { ...record, [field]: value };

    // Auto update weights if gross or tare changes
    if (field === 'grossWeight' || field === 'tareWeight') {
      const g = field === 'grossWeight' ? parseFloat(value) || 0 : record.grossWeight;
      const t = field === 'tareWeight' ? parseFloat(value) || 0 : record.tareWeight;
      updated.grossWeight = g;
      updated.tareWeight = t;
      updated.netWeight = calculateNetWeight(g, t);
    }

    // Auto update measurements if inch dimensions change
    if (field === 'lengthInch' || field === 'widthInch' || field === 'heightInch') {
      const l = field === 'lengthInch' ? parseFloat(value) || 0 : record.lengthInch;
      const w = field === 'widthInch' ? parseFloat(value) || 0 : record.widthInch;
      const h = field === 'heightInch' ? parseFloat(value) || 0 : record.heightInch;

      const conv = convertInchToCmStr(l, w, h);
      updated.lengthInch = l;
      updated.widthInch = w;
      updated.heightInch = h;
      updated.lengthCm = conv.lengthCm;
      updated.widthCm = conv.widthCm;
      updated.heightCm = conv.heightCm;
      updated.measurementStr = conv.measurementStr;
    }

    onUpdateRecord(updated);
  };

  const selectedRecords = records.filter((r) => selectedIds.includes(r.id));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Bar / Search & Actions */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PO Number, Season, Country..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {uniqueSeasons.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterSeason}
                onChange={(e) => setFilterSeason(e.target.value)}
                className="py-1.5 px-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Seasons</option>
                {uniqueSeasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Selected Actions & Add */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={() => onPrintRecords(selectedRecords)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Selected ({selectedIds.length})
              </button>

              <button
                onClick={() => onDeleteRecords(selectedIds)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete ({selectedIds.length})
              </button>
            </>
          )}

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Sticker Entry
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <th className="p-3 w-10 text-center">
                <button
                  onClick={() => onToggleSelectAll(filteredIds)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3 font-bold">PO NUMBER</th>
              <th className="p-3 font-bold">CARTON</th>
              <th className="p-3 font-bold text-right">GROSS (KG)</th>
              <th className="p-3 font-bold text-right">NET (KG)</th>
              <th className="p-3 font-bold text-center">INCH (L x W x H)</th>
              <th className="p-3 font-bold">MEASUREMENT (CM)</th>
              <th className="p-3 font-bold">SEASON</th>
              <th className="p-3 font-bold">COUNTRY</th>
              <th className="p-3 font-bold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                  No sticker records found. Click "New Sticker Entry" or "Import Excel" to add records.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => {
                const isSelected = selectedIds.includes(r.id);

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-blue-50/40 transition font-mono ${
                      isSelected ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onToggleSelect(r.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* PO NUMBER */}
                    <td className="p-3 font-bold text-slate-900">
                      <input
                        type="text"
                        value={r.poNumber}
                        onChange={(e) => handleCellChange(r, 'poNumber', e.target.value)}
                        className="w-28 px-1.5 py-0.5 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded font-mono font-bold bg-transparent"
                      />
                    </td>

                    {/* CARTON NO */}
                    <td className="p-3 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                        #{r.cartonNo || 1}
                      </span>
                    </td>

                    {/* GROSS WEIGHT */}
                    <td className="p-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={r.grossWeight}
                        onChange={(e) => handleCellChange(r, 'grossWeight', e.target.value)}
                        className="w-20 px-1.5 py-0.5 text-right font-bold text-emerald-700 bg-emerald-50/50 border border-emerald-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>

                    {/* NET WEIGHT */}
                    <td className="p-3 text-right font-bold text-slate-700">
                      {formatWeight(r.netWeight)}
                    </td>

                    {/* INCH INPUTS (L x W x H) */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px]">
                        <input
                          type="number"
                          step="0.1"
                          value={r.lengthInch}
                          onChange={(e) => handleCellChange(r, 'lengthInch', e.target.value)}
                          className="w-12 text-center p-0.5 border border-slate-200 rounded hover:border-blue-400 focus:border-blue-500"
                          title="Length (inch)"
                        />
                        <span className="text-slate-400">×</span>
                        <input
                          type="number"
                          step="0.1"
                          value={r.widthInch}
                          onChange={(e) => handleCellChange(r, 'widthInch', e.target.value)}
                          className="w-12 text-center p-0.5 border border-slate-200 rounded hover:border-blue-400 focus:border-blue-500"
                          title="Width (inch)"
                        />
                        <span className="text-slate-400">×</span>
                        <input
                          type="number"
                          step="0.1"
                          value={r.heightInch}
                          onChange={(e) => handleCellChange(r, 'heightInch', e.target.value)}
                          className="w-12 text-center p-0.5 border border-slate-200 rounded hover:border-blue-400 focus:border-blue-500"
                          title="Height (inch)"
                        />
                        <span className="text-slate-400 text-[10px]">in</span>
                      </div>
                    </td>

                    {/* MEASUREMENT CONCATENATED STRING */}
                    <td className="p-3 font-bold text-amber-900 bg-amber-50/40 rounded">
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {r.measurementStr}
                      </span>
                    </td>

                    {/* SEASON */}
                    <td className="p-3 font-semibold text-slate-800">
                      <input
                        type="text"
                        value={r.seasonYear}
                        onChange={(e) => handleCellChange(r, 'seasonYear', e.target.value)}
                        className="w-16 px-1 py-0.5 uppercase border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent"
                      />
                    </td>

                    {/* COUNTRY */}
                    <td className="p-3 font-semibold text-slate-800">
                      <input
                        type="text"
                        value={r.countryOfOrigin}
                        onChange={(e) => handleCellChange(r, 'countryOfOrigin', e.target.value)}
                        className="w-24 px-1 py-0.5 uppercase border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent"
                      />
                    </td>

                    {/* ROW ACTIONS */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onPrintRecords([r])}
                          title="Print this single sticker"
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateRecord(r)}
                          title="Duplicate record"
                          className="p-1 text-slate-500 hover:bg-slate-200 rounded transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecords([r.id])}
                          title="Delete record"
                          className="p-1 text-rose-500 hover:bg-rose-100 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredRecords.length}</span> of{' '}
          <span className="font-bold text-slate-800">{records.length}</span> records
        </div>
        <div className="flex items-center gap-4">
          <span className="text-amber-700 font-mono text-[11px]">
            Formula: INCH × 2.54 = CM
          </span>
          <span className="text-blue-700 font-mono text-[11px]">
            Net Weight = Gross Weight - 0.50 KG
          </span>
        </div>
      </div>
    </div>
  );
};
