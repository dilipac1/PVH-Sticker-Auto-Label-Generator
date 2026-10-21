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
    fontSize: isCompact ? '12px' : `${settings?.fontSizePt || 17}pt`,
    lineHeight: '2.05',
  };

  return (
    <div
      style={fontStyle}
      className={`font-bold tracking-wide text-black text-left select-none bg-white p-2 border border-dashed border-gray-300 print:border-none print:p-0 print:m-0 print:shadow-none ${className}`}
    >
      {/* CSS Grid with max-content ensures Column 1 NEVER overlaps with Colon or Values */}
      <div className="grid grid-cols-[max-content_24px_1fr] items-baseline gap-y-0.5 w-full font-extrabold text-black">
        {/* GROSS WEIGHT */}
        <div className="whitespace-nowrap pr-3 font-extrabold text-black">
          GROSS WEIGHT
        </div>
        <div className="text-center font-extrabold text-black">:</div>
        <div className="whitespace-nowrap pl-3 font-extrabold text-black">
          {formatWeight(record.grossWeight)}
        </div>

        {/* NET WEIGHT */}
        <div className="whitespace-nowrap pr-3 font-extrabold text-black">
          NET WEIGHT
        </div>
        <div className="text-center font-extrabold text-black">:</div>
        <div className="whitespace-nowrap pl-3 font-extrabold text-black">
          {formatWeight(record.netWeight)}
        </div>

        {/* MEASUREMENT */}
        <div className="whitespace-nowrap pr-3 font-extrabold text-black">
          MEASUREMENT
        </div>
        <div className="text-center font-extrabold text-black">:</div>
        <div className="whitespace-nowrap pl-3 font-extrabold text-black">
          {record.measurementStr || '59.69X38.1X29.21XCM'}
        </div>

        {/* SEASON/YEAR */}
        <div className="whitespace-nowrap pr-3 font-extrabold text-black">
          SEASON/YEAR
        </div>
        <div className="text-center font-extrabold text-black">:</div>
        <div className="whitespace-nowrap pl-3 font-extrabold text-black">
          {record.seasonYear || 'SP27'}
        </div>

        {/* COUNTRY OF ORIGIN */}
        <div className="whitespace-nowrap pr-3 font-extrabold text-black">
          COUNTRY OF ORIGIN
        </div>
        <div className="text-center font-extrabold text-black">:</div>
        <div className="whitespace-nowrap pl-3 font-extrabold text-black">
          {record.countryOfOrigin || 'SRI LANKA'}
        </div>

        {/* PO NUMBER */}
        <div className="whitespace-nowrap pr-3 font-extrabold text-black">
          PO NUMBER
        </div>
        <div className="text-center font-extrabold text-black">:</div>
        <div className="whitespace-nowrap pl-3 font-extrabold text-black">
          {record.poNumber || '4100059739'}
        </div>
      </div>
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
    <div className="sticker-page-pair flex items-center justify-between gap-10 print:gap-12 w-full bg-white p-3 border border-gray-200 print:border-none print:p-0 print:m-0 print:shadow-none">
      <div className="w-[5.3in] print:w-[5.3in] shrink-0">
        <SingleSticker record={leftRecord} settings={settings} />
      </div>
      {rightRecord ? (
        <div className="w-[5.3in] print:w-[5.3in] shrink-0">
          <SingleSticker record={rightRecord} settings={settings} />
        </div>
      ) : (
        <div className="w-[5.3in] print:w-[5.3in] shrink-0 opacity-0 pointer-events-none">
          <SingleSticker record={leftRecord} settings={settings} />
        </div>
      )}
    </div>
  );
};
