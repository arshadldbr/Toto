import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Download, ExternalLink } from 'lucide-react';

export const ReceiptViewerModal: React.FC = () => {
  const { receiptModalUrl, closeReceipt } = useFinance();

  if (!receiptModalUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Attached Receipt Preview
          </h3>
          <div className="flex items-center gap-2">
            <a
              href={receiptModalUrl}
              download="receipt-attachment"
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={closeReceipt}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950/5 dark:bg-slate-950/40">
          <img
            src={receiptModalUrl}
            alt="Receipt preview"
            className="max-h-[70vh] object-contain rounded-xl shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
