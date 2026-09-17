import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { CategoryIcon } from '../utils/categoryIcons';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  X,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Transaction } from '../types';

export const CalendarView: React.FC = () => {
  const {
    transactions,
    categories,
    profile,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    openAddTx,
    openEditTx,
  } = useFinance();

  // Selected date on calendar (defaults to today 2026-09-17)
  const [selectedDay, setSelectedDay] = useState<number>(17);

  // Calculate calendar grid days
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDayWeekday = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0 = Sunday

  // Group transactions by day
  const dailyTransactionsMap = useMemo(() => {
    const map: Record<number, { income: number; expense: number; txs: Transaction[] }> = {};

    transactions.forEach((tx) => {
      if (!tx.date) return;
      const [y, m, d] = tx.date.split('-').map(Number);
      if (y === selectedYear && m === selectedMonth) {
        if (!map[d]) {
          map[d] = { income: 0, expense: 0, txs: [] };
        }
        map[d].txs.push(tx);
        if (tx.type === 'income' || tx.type === 'loan_received') {
          map[d].income += tx.amount;
        } else if (tx.type === 'expense' || tx.type === 'loan_repayment') {
          map[d].expense += tx.amount;
        }
      }
    });

    return map;
  }, [transactions, selectedYear, selectedMonth]);

  const selectedDayData = dailyTransactionsMap[selectedDay] || { income: 0, expense: 0, txs: [] };

  const selectedDateString = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(
    selectedDay
  ).padStart(2, '0')}`;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Day-by-day cashflow breakdown and timeline
          </p>
        </div>

        <button
          onClick={() => openAddTx('expense')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add on {selectedDateString}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-600" />
              <span>
                {monthNames[selectedMonth - 1]} {selectedYear}
              </span>
            </h2>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (selectedMonth === 1) {
                    setSelectedMonth(12);
                    setSelectedYear(selectedYear - 1);
                  } else {
                    setSelectedMonth(selectedMonth - 1);
                  }
                }}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (selectedMonth === 12) {
                    setSelectedMonth(1);
                    setSelectedYear(selectedYear + 1);
                  } else {
                    setSelectedMonth(selectedMonth + 1);
                  }
                }}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-transparent" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const data = dailyTransactionsMap[dayNum];
              const isSelected = selectedDay === dayNum;
              const isToday = selectedYear === 2026 && selectedMonth === 9 && dayNum === 17;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`h-16 sm:h-20 p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs ring-2 ring-emerald-500'
                      : isToday
                      ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20'
                      : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : isToday
                          ? 'text-amber-600 font-black'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {data && data.txs.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  {data && (
                    <div className="space-y-0.5 overflow-hidden">
                      {data.expense > 0 && (
                        <p className="text-[9px] font-bold text-rose-600 truncate">
                          -{formatCurrency(data.expense, profile.defaultCurrency, { compact: true })}
                        </p>
                      )}
                      {data.income > 0 && (
                        <p className="text-[9px] font-bold text-emerald-600 truncate">
                          +{formatCurrency(data.income, profile.defaultCurrency, { compact: true })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Transaction Breakdown Drawer */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selected Day Breakdown
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedDateString}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {monthNames[selectedMonth - 1]} {selectedDay}, {selectedYear}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              <span className="text-[10px] font-bold uppercase">Day Inflow</span>
              <p className="text-base font-bold mt-0.5">
                {formatCurrency(selectedDayData.income, profile.defaultCurrency)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
              <span className="text-[10px] font-bold uppercase">Day Outflow</span>
              <p className="text-base font-bold mt-0.5">
                {formatCurrency(selectedDayData.expense, profile.defaultCurrency)}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase">
              Transactions ({selectedDayData.txs.length})
            </h4>

            {selectedDayData.txs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No activity recorded on this date.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-80 overflow-y-auto">
                {selectedDayData.txs.map((tx) => {
                  const cat = categories.find((c) => c.id === tx.categoryId);
                  const isIncome = tx.type === 'income' || tx.type === 'loan_received';

                  return (
                    <div
                      key={tx.id}
                      onClick={() => openEditTx(tx)}
                      className="py-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-1 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: cat?.color ? `${cat.color}20` : '#F1F5F9',
                            color: cat?.color || '#334155',
                          }}
                        >
                          <CategoryIcon name={cat?.icon} size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {tx.description}
                          </p>
                          <p className="text-[10px] text-slate-400">{tx.time || 'All day'}</p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-black shrink-0 ${
                          isIncome ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount, profile.defaultCurrency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
