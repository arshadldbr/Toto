import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { CategoryIcon } from '../utils/categoryIcons';
import { CategoryDonutChart } from './charts/CategoryDonutChart';
import { IncomeExpenseBarChart } from './charts/IncomeExpenseBarChart';
import { SpendingTrendChart } from './charts/SpendingTrendChart';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Building,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  Receipt,
  Calendar,
  Layers,
} from 'lucide-react';
import { TransactionType } from '../types';

export const Dashboard: React.FC = () => {
  const {
    profile,
    selectedYear,
    selectedMonth,
    currentMonthSummary,
    previousMonthSummary,
    overallBalances,
    dashboardInsights,
    transactions,
    categories,
    openAddTx,
    openEditTx,
    setActiveTab,
    openReceipt,
  } = useFinance();

  // Get recent 5 transactions for current month
  const recentMonthTransactions = transactions
    .filter((tx) => {
      if (!tx.date) return false;
      const [y, m] = tx.date.split('-').map(Number);
      return y === selectedYear && m === selectedMonth;
    })
    .slice(0, 5);

  const budgetUsage = currentMonthSummary.budgetUsagePercent;
  let budgetBarColor = 'bg-emerald-500';
  if (budgetUsage >= 100) budgetBarColor = 'bg-rose-500';
  else if (budgetUsage >= 90) budgetBarColor = 'bg-amber-500';
  else if (budgetUsage >= 75) budgetBarColor = 'bg-yellow-500';

  const quickActions: Array<{
    type: TransactionType;
    label: string;
    icon: React.ReactElement;
    color: string;
  }> = [
    {
      type: 'expense',
      label: '+ Expense',
      icon: <ArrowDownLeft className="w-4 h-4 text-rose-500" />,
      color: 'hover:border-rose-300 dark:hover:border-rose-700',
    },
    {
      type: 'income',
      label: '+ Income',
      icon: <ArrowUpRight className="w-4 h-4 text-emerald-500" />,
      color: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    },
    {
      type: 'savings',
      label: '+ Savings',
      icon: <PiggyBank className="w-4 h-4 text-blue-500" />,
      color: 'hover:border-blue-300 dark:hover:border-blue-700',
    },
    {
      type: 'credit',
      label: '+ Credit/Debit',
      icon: <CreditCard className="w-4 h-4 text-amber-500" />,
      color: 'hover:border-amber-300 dark:hover:border-amber-700',
    },
    {
      type: 'loan_repayment',
      label: '+ Loan Repay',
      icon: <Building className="w-4 h-4 text-purple-500" />,
      color: 'hover:border-purple-300 dark:hover:border-purple-700',
    },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Welcome & Quick Date Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Overview for September 17, 2026 • Real-time calculations
          </p>
        </div>

        {/* Quick Add Button */}
        <div className="flex items-center gap-2">
          <button
            id="dashboard-main-add-tx-btn"
            onClick={() => openAddTx('expense')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Quick Action Shortcuts (PRD Section 42) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {quickActions.map((qa) => (
          <button
            key={qa.type}
            id={`quick-action-btn-${qa.type}`}
            onClick={() => openAddTx(qa.type)}
            className={`flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs shrink-0 transition-all ${qa.color}`}
          >
            {qa.icon}
            <span>{qa.label}</span>
          </button>
        ))}
      </div>

      {/* Financial Summary Cards (PRD Section 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Income */}
        <div
          id="summary-card-income"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Income
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(currentMonthSummary.totalIncome, profile.defaultCurrency)}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Selected month inflow</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div
          id="summary-card-expenses"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Expenses
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(currentMonthSummary.totalExpense, profile.defaultCurrency)}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Selected month outflow</p>
          </div>
        </div>

        {/* Remaining Budget */}
        <div
          id="summary-card-remaining-budget"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Remaining Budget
            </span>
            <div
              className={`p-1.5 rounded-lg ${
                currentMonthSummary.remainingBudget >= 0
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p
              className={`text-lg sm:text-xl font-bold tracking-tight ${
                currentMonthSummary.remainingBudget < 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatCurrency(currentMonthSummary.remainingBudget, profile.defaultCurrency)}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Budget: {formatCurrency(currentMonthSummary.monthlyBudget, profile.defaultCurrency, { compact: true })}
            </p>
          </div>
        </div>

        {/* Savings Pool */}
        <div
          id="summary-card-savings"
          onClick={() => setActiveTab('savings')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Savings
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(overallBalances.totalSavingsPool, profile.defaultCurrency)}
            </p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5 flex items-center gap-0.5">
              <span>View goals</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Credit (Receivable) */}
        <div
          id="summary-card-credit"
          onClick={() => setActiveTab('credit_debit')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Credit (Receivable)
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(overallBalances.outstandingCredit, profile.defaultCurrency)}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Others owe you</p>
          </div>
        </div>

        {/* Debit (Payable) */}
        <div
          id="summary-card-debit"
          onClick={() => setActiveTab('credit_debit')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-indigo-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Debit (Payable)
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(overallBalances.outstandingDebit, profile.defaultCurrency)}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">You owe others</p>
          </div>
        </div>

        {/* Outstanding Loans */}
        <div
          id="summary-card-loans"
          onClick={() => setActiveTab('loans')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between cursor-pointer hover:border-purple-400 transition-colors col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Loan Balance
            </span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(overallBalances.outstandingLoans, profile.defaultCurrency)}
            </p>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5 flex items-center gap-0.5">
              <span>View loans</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>

      {/* Budget Progress Card (PRD Section 7) */}
      <div
        id="dashboard-budget-card"
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Monthly Budget Usage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatCurrency(currentMonthSummary.totalExpense, profile.defaultCurrency)} of{' '}
              {formatCurrency(currentMonthSummary.monthlyBudget, profile.defaultCurrency)} spent
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-lg font-black tracking-tight ${
                budgetUsage >= 100
                  ? 'text-rose-600 dark:text-rose-400'
                  : budgetUsage >= 90
                  ? 'text-amber-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {budgetUsage}%
            </span>
            <p className="text-[10px] text-slate-400">Consumed</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${budgetBarColor} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(100, Math.max(2, budgetUsage))}%` }}
          />
        </div>

        {/* Warning alerts according to PRD thresholds */}
        {budgetUsage >= 100 ? (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Budget Exceeded!</strong> You have spent{' '}
              {formatCurrency(currentMonthSummary.totalExpense - currentMonthSummary.monthlyBudget, profile.defaultCurrency)}{' '}
              over your monthly limit.
            </span>
          </div>
        ) : budgetUsage >= 90 ? (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Warning:</strong> You have consumed {budgetUsage}% of your monthly budget. Only{' '}
              {formatCurrency(currentMonthSummary.remainingBudget, profile.defaultCurrency)} remaining.
            </span>
          </div>
        ) : budgetUsage >= 75 ? (
          <div className="p-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>75% of your monthly budget is consumed. Pace your remaining expenses.</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Budget on track
            </span>
            <button
              onClick={() => setActiveTab('budget')}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Configure Budgets &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Smart Dashboard Insights (PRD Section 27) */}
      {dashboardInsights.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Smart Financial Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dashboardInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3"
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    insight.type === 'alert'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                      : insight.type === 'warning'
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                      : insight.type === 'success'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                  }`}
                >
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compact Analytics Area (PRD Section 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown Donut */}
        <div
          id="dashboard-category-chart-card"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Spending by Category
              </h3>
              <p className="text-xs text-slate-400">Distribution for selected month</p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Full Report &rarr;
            </button>
          </div>

          <CategoryDonutChart
            categorySpending={currentMonthSummary.categorySpending}
            categories={categories}
            currency={profile.defaultCurrency}
            totalExpense={currentMonthSummary.totalExpense}
          />
        </div>

        {/* Income vs Expense & Trend */}
        <div
          id="dashboard-cashflow-chart-card"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Income vs Expense
              </h3>
              <p className="text-xs text-slate-400">Monthly cashflow summary</p>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <IncomeExpenseBarChart
            currentIncome={currentMonthSummary.totalIncome}
            currentExpense={currentMonthSummary.totalExpense}
            previousIncome={previousMonthSummary?.totalIncome}
            previousExpense={previousMonthSummary?.totalExpense}
            currency={profile.defaultCurrency}
          />

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <SpendingTrendChart
              transactions={transactions}
              year={selectedYear}
              month={selectedMonth}
              currency={profile.defaultCurrency}
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions List (PRD Section 14) */}
      <div
        id="dashboard-recent-transactions-card"
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-400">
              {currentMonthSummary.transactionCount} transactions in this period
            </p>
          </div>
          <button
            id="dashboard-view-all-tx-btn"
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentMonthTransactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No transactions for this month yet.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Tap &quot;Record Transaction&quot; to log an expense or income.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentMonthTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const isIncome = tx.type === 'income' || tx.type === 'loan_received';
              const isSavings = tx.type === 'savings';

              return (
                <div
                  key={tx.id}
                  id={`recent-tx-row-${tx.id}`}
                  onClick={() => openEditTx(tx)}
                  className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: cat?.color ? `${cat.color}20` : '#F1F5F9',
                        color: cat?.color || '#334155',
                      }}
                    >
                      <CategoryIcon name={cat?.icon} size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {cat?.name || 'General'}
                        </span>
                        <span>•</span>
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    {tx.receiptUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openReceipt(tx.receiptUrl!);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-emerald-600"
                        title="View Receipt"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div>
                      <span
                        className={`text-xs sm:text-sm font-black ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isSavings
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount, profile.defaultCurrency)}
                      </span>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">
                        {tx.type}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
