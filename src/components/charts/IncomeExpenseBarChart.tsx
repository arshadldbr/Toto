import React from 'react';
import { formatCurrency } from '../../utils/currency';

interface IncomeExpenseBarChartProps {
  currentIncome: number;
  currentExpense: number;
  previousIncome?: number;
  previousExpense?: number;
  currency: string;
}

export const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
  currentIncome,
  currentExpense,
  previousIncome = 0,
  previousExpense = 0,
  currency,
}) => {
  const maxVal = Math.max(currentIncome, currentExpense, previousIncome, previousExpense, 1);

  const getPercent = (val: number) => Math.min(100, Math.max(4, Math.round((val / maxVal) * 100)));

  return (
    <div className="space-y-4">
      {/* Current Month Bars */}
      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Income
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentIncome, currency)}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${getPercent(currentIncome)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Expenses
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentExpense, currency)}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${getPercent(currentExpense)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Net Balance Pill */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Net Monthly Cash Flow:
        </span>
        <span
          className={`font-bold ${
            currentIncome >= currentExpense
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {currentIncome >= currentExpense ? '+' : '-'}
          {formatCurrency(Math.abs(currentIncome - currentExpense), currency)}
        </span>
      </div>
    </div>
  );
};
