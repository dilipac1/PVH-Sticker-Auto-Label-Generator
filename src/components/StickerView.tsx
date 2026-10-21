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
    fontSize: isCompact ? '11px' : `${settings?.fontSizePt || 11.5}pt`,
    lineHeight: '1.75',
  };

  const labelWidth = settings?.labelWidthPx || 200;

  return (
    <div
      style={fontStyle}
      className={`font-bold tracking-tight text-black text-left select-none bg-white p-2 border border-dashed border-gray-300 print:border-none print:p-0 print:m-0 print:shadow-none ${className}`}
    >
      <table className="w-full border-collapse text-left border-none table-fixed">
        <tbody>
          {/* GROSS WEIGHT */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px` }}
              className="font-bold text-black tracking-wider whitespace-nowrap pr-2"
            >
              GROSS WEIGHT
            </td>
            <td className="w-5 text-center font-bold px-1">:</td>
            <td className="font-bold text-black pl-3 whitespace-nowrap">
              {formatWeight(record.grossWeight)}
            </td>
          </tr>

          {/* NET WEIGHT */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px` }}
              className="font-bold text-black tracking-wider whitespace-nowrap pr-2"
            >
              NET WEIGHT
            </td>
            <td className="w-5 text-center font-bold px-1">:</td>
            <td className="font-bold text-black pl-3 whitespace-nowrap">
              {formatWeight(record.netWeight)}
            </td>
          </tr>

          {/* MEASUREMENT */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px` }}
              className="font-bold text-black tracking-wider whitespace-nowrap pr-2"
            >
              MEASUREMENT
            </td>
            <td className="w-5 text-center font-bold px-1">:</td>
            <td className="font-bold text-black pl-3 whitespace-nowrap">
              {record.measurementStr || '59.69X38.1X29.21XCM'}
            </td>
          </tr>

          {/* SEASON/YEAR */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px` }}
              className="font-bold text-black tracking-wider whitespace-nowrap pr-2"
            >
              SEASON/YEAR
            </td>
            <td className="w-5 text-center font-bold px-1">:</td>
            <td className="font-bold text-black pl-3 whitespace-nowrap">
              {record.seasonYear || 'SP27'}
            </td>
          </tr>

          {/* COUNTRY OF ORIGIN */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px` }}
              className="font-bold text-black tracking-wider whitespace-nowrap pr-2"
            >
              COUNTRY OF ORIGIN
            </td>
            <td className="w-5 text-center font-bold px-1">:</td>
            <td className="font-bold text-black pl-3 whitespace-nowrap">
              {record.countryOfOrigin || 'SRI LANKA'}
            </td>
          </tr>

          {/* PO NUMBER */}
          <tr className="align-baseline">
            <td
              style={{ width: `${labelWidth}px` }}
              className="font-bold text-black tracking-wider whitespace-nowrap pr-2"
            >
              PO NUMBER
            </td>
            <td className="w-5 text-center font-bold px-1">:</td>
            <td className="font-bold text-black pl-3 whitespace-nowrap">
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
    <div className="sticker-page-pair flex items-center justify-between w-full bg-white p-3 border border-gray-200 print:border-none print:p-0 print:m-0 print:shadow-none">
      <div className="w-[5.4in] print:w-[5.4in] shrink-0">
        <SingleSticker record={leftRecord} settings={settings} />
      </div>
      {rightRecord ? (
        <div className="w-[5.4in] print:w-[5.4in] shrink-0">
          <SingleSticker record={rightRecord} settings={settings} />
        </div>
      ) : (
        <div className="w-[5.4in] print:w-[5.4in] shrink-0 opacity-0 pointer-events-none">
          <SingleSticker record={leftRecord} settings={settings} />
        </div>
      )}
    </div>
  );
};
