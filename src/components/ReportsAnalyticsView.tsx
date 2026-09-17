import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { CategoryIcon } from '../utils/categoryIcons';
import { CategoryDonutChart } from './charts/CategoryDonutChart';
import { IncomeExpenseBarChart } from './charts/IncomeExpenseBarChart';
import {
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  FileSpreadsheet,
  PieChart,
  BarChart3,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ReportsAnalyticsView: React.FC = () => {
  const {
    transactions,
    categories,
    profile,
    selectedYear,
    selectedMonth,
    currentMonthSummary,
    previousMonthSummary,
    monthComparison,
  } = useFinance();

  const [period, setPeriod] = useState<
    'current_month' | 'prev_month' | 'last_30_days' | 'this_year' | 'all'
  >('current_month');

  // Filter transactions based on selected period
  const reportTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (!tx.date) return false;
      const [y, m, d] = tx.date.split('-').map(Number);

      if (period === 'current_month') {
        return y === selectedYear && m === selectedMonth;
      }
      if (period === 'prev_month') {
        const prevM = selectedMonth === 1 ? 12 : selectedMonth - 1;
        const prevY = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
        return y === prevY && m === prevM;
      }
      if (period === 'this_year') {
        return y === selectedYear;
      }
      if (period === 'last_30_days') {
        const txTime = new Date(tx.date).getTime();
        const refTime = new Date('2026-09-17').getTime();
        const diffDays = (refTime - txTime) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 30;
      }
      return true;
    });
  }, [transactions, period, selectedYear, selectedMonth]);

  // Aggregate metrics for this report period
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    let savings = 0;
    const catSpending: Record<string, number> = {};

    reportTransactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income' || tx.type === 'loan_received') {
        income += amt;
      } else if (tx.type === 'expense' || tx.type === 'loan_repayment') {
        expense += amt;
        catSpending[tx.categoryId] = (catSpending[tx.categoryId] || 0) + amt;
      } else if (tx.type === 'savings') {
        savings += amt;
      }
    });

    return {
      income,
      expense,
      savings,
      netCashflow: income - expense,
      catSpending,
      count: reportTransactions.length,
    };
  }, [reportTransactions]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Time', 'Type', 'Amount', 'Currency', 'Category', 'Description', 'Merchant', 'Payment Method', 'Notes'];
    const rows = reportTransactions.map((tx) => {
      const cat = categories.find((c) => c.id === tx.categoryId);
      return [
        `"${tx.date}"`,
        `"${tx.time}"`,
        `"${tx.type}"`,
        tx.amount,
        `"${tx.currency}"`,
        `"${cat?.name || tx.categoryId}"`,
        `"${(tx.description || '').replace(/"/g, '""')}"`,
        `"${(tx.merchant || '').replace(/"/g, '""')}"`,
        `"${tx.paymentMethod}"`,
        `"${(tx.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_report_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Deep insights, category distribution, trends, and statements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="reports-export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            id="reports-print-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto w-fit">
        <button
          onClick={() => setPeriod('current_month')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            period === 'current_month'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          This Month ({selectedMonth}/{selectedYear})
        </button>
        <button
          onClick={() => setPeriod('prev_month')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            period === 'prev_month'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Previous Month
        </button>
        <button
          onClick={() => setPeriod('last_30_days')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            period === 'last_30_days'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => setPeriod('this_year')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            period === 'this_year'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          This Year ({selectedYear})
        </button>
        <button
          onClick={() => setPeriod('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            period === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          All Records
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Total Inflow</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(metrics.income, profile.defaultCurrency)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Total Outflow</span>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(metrics.expense, profile.defaultCurrency)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Net Balance</span>
          <p
            className={`text-xl font-bold mt-1 ${
              metrics.netCashflow >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {metrics.netCashflow >= 0 ? '+' : ''}
            {formatCurrency(metrics.netCashflow, profile.defaultCurrency)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Transactions Recorded</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {metrics.count} Activities
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown Donut */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Category Spending Distribution
            </h3>
            <p className="text-xs text-slate-400">Percentage share per spending category</p>
          </div>

          <CategoryDonutChart
            categorySpending={metrics.catSpending}
            categories={categories}
            currency={profile.defaultCurrency}
            totalExpense={metrics.expense}
          />
        </div>

        {/* Income vs Expense Comparative */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Cashflow Comparison
            </h3>
            <p className="text-xs text-slate-400">Ratio of money earned vs money spent</p>
          </div>

          <IncomeExpenseBarChart
            currentIncome={metrics.income}
            currentExpense={metrics.expense}
            currency={profile.defaultCurrency}
          />

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">Financial Health Ratio:</p>
            <p className="text-slate-500 dark:text-slate-400">
              You are spending{' '}
              <strong className="text-slate-900 dark:text-white">
                {metrics.income > 0 ? Math.round((metrics.expense / metrics.income) * 100) : 0}%
              </strong>{' '}
              of your incoming revenue during this period.
            </p>
          </div>
        </div>
      </div>

      {/* Month-over-Month Category Trend Analysis (PRD Section 46) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Category Spending Trends (Current vs Previous Month)
          </h3>
          <p className="text-xs text-slate-400">
            Identify increasing or decreasing expenses across months
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Category</th>
                <th className="pb-3 text-right">Previous Month</th>
                <th className="pb-3 text-right">Current Month</th>
                <th className="pb-3 text-right">Difference</th>
                <th className="pb-3 text-right pr-2">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {categories
                .filter((c) => c.id !== 'income_general')
                .map((cat) => {
                  const curr = currentMonthSummary.categorySpending[cat.id] || 0;
                  const prev = previousMonthSummary?.categorySpending[cat.id] || 0;
                  const diff = curr - prev;
                  const percent = prev > 0 ? Math.round((diff / prev) * 100) : curr > 0 ? 100 : 0;

                  if (curr === 0 && prev === 0) return null;

                  return (
                    <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 pl-2 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color || '#64748B' }}
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {cat.name}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-500 dark:text-slate-400">
                        {formatCurrency(prev, profile.defaultCurrency)}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(curr, profile.defaultCurrency)}
                      </td>
                      <td className="py-3 text-right font-semibold">
                        <span
                          className={
                            diff > 0
                              ? 'text-rose-600'
                              : diff < 0
                              ? 'text-emerald-600'
                              : 'text-slate-400'
                          }
                        >
                          {diff > 0 ? '+' : ''}
                          {formatCurrency(diff, profile.defaultCurrency)}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
                            diff > 0
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : diff < 0
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                          }`}
                        >
                          {diff > 0 ? (
                            <>
                              <TrendingUp className="w-3 h-3" />
                              <span>+{percent}%</span>
                            </>
                          ) : diff < 0 ? (
                            <>
                              <TrendingDown className="w-3 h-3" />
                              <span>{percent}%</span>
                            </>
                          ) : (
                            <>
                              <Minus className="w-3 h-3" />
                              <span>Stable</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
