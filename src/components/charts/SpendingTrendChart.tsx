import React, { useState } from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface SpendingTrendChartProps {
  transactions: Transaction[];
  year: number;
  month: number;
  currency: string;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  transactions,
  year,
  month,
  currency,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{ day: number; amount: number } | null>(null);

  // Total days in month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Aggregate daily expenses
  const dailySpending: Record<number, number> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    dailySpending[d] = 0;
  }

  transactions.forEach((tx) => {
    if (tx.type === 'expense' && tx.date) {
      const parts = tx.date.split('-');
      if (parts.length === 3) {
        const d = parseInt(parts[2], 10);
        if (d >= 1 && d <= daysInMonth) {
          dailySpending[d] = (dailySpending[d] || 0) + (Number(tx.amount) || 0);
        }
      }
    }
  });

  const maxDaily = Math.max(...Object.values(dailySpending), 1);

  return (
    <div className="space-y-3">
      {/* Tooltip bar */}
      <div className="flex items-center justify-between text-xs min-h-[20px]">
        <span className="text-slate-500 dark:text-slate-400">Daily spending trend</span>
        {hoveredDay ? (
          <span className="font-bold text-slate-900 dark:text-white">
            Day {hoveredDay.day}: {formatCurrency(hoveredDay.amount, currency)}
          </span>
        ) : (
          <span className="text-slate-400 text-[11px]">Hover over bars to view daily total</span>
        )}
      </div>

      {/* Bar graph container */}
      <div className="h-28 flex items-end gap-1 sm:gap-1.5 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const amt = dailySpending[day] || 0;
          const heightPercent = amt > 0 ? Math.max(8, Math.round((amt / maxDaily) * 100)) : 3;
          const isToday = day === 17 && month === 9 && year === 2026;

          return (
            <div
              key={day}
              onMouseEnter={() => setHoveredDay({ day, amount: amt })}
              onMouseLeave={() => setHoveredDay(null)}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-200 ${
                  amt > 0
                    ? isToday
                      ? 'bg-emerald-500 hover:bg-emerald-400'
                      : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-500'
                    : 'bg-slate-100 dark:bg-slate-800/60'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Axis Days Labels */}
      <div className="flex justify-between text-[10px] text-slate-400 px-0.5">
        <span>Day 1</span>
        <span>Day 10</span>
        <span>Day 20</span>
        <span>Day {daysInMonth}</span>
      </div>
    </div>
  );
};
