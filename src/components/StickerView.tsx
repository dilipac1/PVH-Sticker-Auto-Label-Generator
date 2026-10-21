import React from 'react';
import { StickerRecord, PrinterSettings } from '../types';
import { formatWeight } from '../utils/excel';

interface StickerViewProps {
  record: StickerRecord;
  settings?: PrinterSettings;
  className?: string;
  isCompact?: boolean;
}

export const SingleSticker: React.FC<StickerViewProps> = ({
  record,
  settings,
  className = '',
  isCompact = false,
}) => {
  const fontStyle = {
    fontFamily: settings?.fontFamily || 'Arial, sans-serif',
    fontSize: isCompact ? '13px' : `${settings?.fontSizePt || 17}pt`,
    lineHeight: '2.05', // Clean vertical line height
  };

  const labelWidth = settings?.labelWidthPx || 275;

  return (
    <div
      style={fontStyle}
      className={`font-bold tracking-wide text-black text-left select-none bg-white p-2 border border-dashed border-gray-300 print:border-none print:p-0 print:m-0 print:shadow-none ${className}`}
    >
      <table className="w-full border-collapse text-left border-none table-fixed">
        <tbody>
          {/* GROSS WEIGHT */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
              className="font-extrabold text-black tracking-wider whitespace-nowrap pr-3 py-1"
            >
              GROSS WEIGHT
            </td>
            <td className="w-6 text-center font-extrabold px-1 py-1">:</td>
            <td className="font-extrabold text-black pl-3 whitespace-nowrap py-1">
              {formatWeight(record.grossWeight)}
            </td>
          </tr>

          {/* NET WEIGHT */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
              className="font-extrabold text-black tracking-wider whitespace-nowrap pr-3 py-1"
            >
              NET WEIGHT
            </td>
            <td className="w-6 text-center font-extrabold px-1 py-1">:</td>
            <td className="font-extrabold text-black pl-3 whitespace-nowrap py-1">
              {formatWeight(record.netWeight)}
            </td>
          </tr>

          {/* MEASUREMENT */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
              className="font-extrabold text-black tracking-wider whitespace-nowrap pr-3 py-1"
            >
              MEASUREMENT
            </td>
            <td className="w-6 text-center font-extrabold px-1 py-1">:</td>
            <td className="font-extrabold text-black pl-3 whitespace-nowrap py-1">
              {record.measurementStr || '59.69X38.1X29.21XCM'}
            </td>
          </tr>

          {/* SEASON/YEAR */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
              className="font-extrabold text-black tracking-wider whitespace-nowrap pr-3 py-1"
            >
              SEASON/YEAR
            </td>
            <td className="w-6 text-center font-extrabold px-1 py-1">:</td>
            <td className="font-extrabold text-black pl-3 whitespace-nowrap py-1">
              {record.seasonYear || 'SP27'}
            </td>
          </tr>

          {/* COUNTRY OF ORIGIN */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
              className="font-extrabold text-black tracking-wider whitespace-nowrap pr-3 py-1"
            >
              COUNTRY OF ORIGIN
            </td>
            <td className="w-6 text-center font-extrabold px-1 py-1">:</td>
            <td className="font-extrabold text-black pl-3 whitespace-nowrap py-1">
              {record.countryOfOrigin || 'SRI LANKA'}
            </td>
          </tr>

          {/* PO NUMBER */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
              className="font-extrabold text-black tracking-wider whitespace-nowrap pr-3 py-1"
            >
              PO NUMBER
            </td>
            <td className="w-6 text-center font-extrabold px-1 py-1">:</td>
            <td className="font-extrabold text-black pl-3 whitespace-nowrap py-1">
              {record.poNumber || '4100059739'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface TwoUpPairProps {
  leftRecord: StickerRecord;
  rightRecord?: StickerRecord;
  settings?: PrinterSettings;
}

export const TwoUpStickerPair: React.FC<TwoUpPairProps> = ({
  leftRecord,
  rightRecord,
  settings,
}) => {
  return (
    <div className="sticker-page-pair flex items-center justify-between w-full bg-white p-2 border border-gray-200 print:border-none print:p-0 print:m-0 print:shadow-none">
      <div className="w-[5.7in] print:w-[5.7in] shrink-0">
        <SingleSticker record={leftRecord} settings={settings} />
      </div>
      {rightRecord ? (
        <div className="w-[5.7in] print:w-[5.7in] shrink-0">
          <SingleSticker record={rightRecord} settings={settings} />
        </div>
      ) : (
        <div className="w-[5.7in] print:w-[5.7in] shrink-0 opacity-0 pointer-events-none">
          <SingleSticker record={leftRecord} settings={settings} />
        </div>
      )}
    </div>
  );
};
