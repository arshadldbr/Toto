import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { CategoryIcon } from '../utils/categoryIcons';
import {
  PieChart,
  Edit3,
  Check,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Percent,
} from 'lucide-react';

export const BudgetView: React.FC = () => {
  const {
    currentBudget,
    selectedYear,
    selectedMonth,
    currentMonthSummary,
    categories,
    profile,
    updateBudget,
  } = useFinance();

  const [isEditingOverall, setIsEditingOverall] = useState(false);
  const [overallInput, setOverallInput] = useState(
    (currentBudget?.totalBudget || profile.defaultMonthlyBudget || 100000).toString()
  );

  const [editingCategoryBudgets, setEditingCategoryBudgets] = useState<Record<string, string>>({});
  const [isEditingCategories, setIsEditingCategories] = useState(false);

  // Overall calculations
  const totalBudget = currentBudget?.totalBudget || 0;
  const totalSpent = currentMonthSummary.totalExpense;
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const percentRemaining = Math.max(0, 100 - percentUsed);

  const handleSaveOverallBudget = () => {
    const val = parseFloat(overallInput);
    if (!isNaN(val) && val >= 0) {
      updateBudget({
        year: selectedYear,
        month: selectedMonth,
        totalBudget: val,
      });
      setIsEditingOverall(false);
    }
  };

  const handleStartEditingCategories = () => {
    const currentMap: Record<string, string> = {};
    categories.forEach((cat) => {
      const bgt = currentBudget?.categoryBudgets?.[cat.id] || 0;
      currentMap[cat.id] = bgt > 0 ? bgt.toString() : '';
    });
    setEditingCategoryBudgets(currentMap);
    setIsEditingCategories(true);
  };

  const handleSaveCategoryBudgets = () => {
    const newCategoryBudgets: Record<string, number> = {};
    Object.entries(editingCategoryBudgets).forEach(([catId, valStr]) => {
      const num = parseFloat(valStr);
      if (!isNaN(num) && num > 0) {
        newCategoryBudgets[catId] = num;
      }
    });

    updateBudget({
      year: selectedYear,
      month: selectedMonth,
      totalBudget: totalBudget,
      categoryBudgets: newCategoryBudgets,
    });
    setIsEditingCategories(false);
  };

  // Warning color for overall progress
  let progressColor = 'bg-emerald-500';
  if (percentUsed >= 100) progressColor = 'bg-rose-500';
  else if (percentUsed >= 90) progressColor = 'bg-amber-500';
  else if (percentUsed >= 75) progressColor = 'bg-yellow-500';

  return (
    <div className="space-y-6 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Monthly Budget Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Target and category limits for {selectedMonth}/{selectedYear}
          </p>
        </div>

        <button
          id="budget-edit-overall-toggle-btn"
          onClick={() => {
            if (isEditingOverall) handleSaveOverallBudget();
            else {
              setOverallInput(totalBudget.toString());
              setIsEditingOverall(true);
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
        >
          {isEditingOverall ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Budget</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Edit Monthly Target</span>
            </>
          )}
        </button>
      </div>

      {/* Main Budget Card */}
      <div
        id="budget-main-overview-card"
        className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Monthly Budget Limit
            </span>
            {isEditingOverall ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="budget-total-input"
                  type="number"
                  step="any"
                  value={overallInput}
                  onChange={(e) => setOverallInput(e.target.value)}
                  className="text-2xl sm:text-3xl font-black px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-emerald-500 rounded-xl text-slate-900 dark:text-white w-48"
                  autoFocus
                />
                <span className="text-sm font-bold text-slate-500">{profile.defaultCurrency}</span>
              </div>
            ) : (
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {formatCurrency(totalBudget, profile.defaultCurrency)}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Consumed</span>
              <p
                className={`text-2xl font-black ${
                  percentUsed >= 100
                    ? 'text-rose-600 dark:text-rose-400'
                    : percentUsed >= 90
                    ? 'text-amber-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {percentUsed}%
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Remaining</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {percentRemaining}%
              </p>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full ${progressColor} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(2, percentUsed))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>0%</span>
            <span>75% Warning</span>
            <span>90% Danger</span>
            <span>100% Target</span>
          </div>
        </div>

        {/* Breakdown Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400">Amount Spent</span>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(totalSpent, profile.defaultCurrency)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400">Amount Remaining</span>
            <p
              className={`text-base font-bold mt-0.5 ${
                remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {formatCurrency(remaining, profile.defaultCurrency)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400">Daily Average Spent</span>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(totalSpent / 17, profile.defaultCurrency, { compact: true })}/day
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400">Budget Status</span>
            <p
              className={`text-base font-bold mt-0.5 ${
                percentUsed >= 100
                  ? 'text-rose-600'
                  : percentUsed >= 90
                  ? 'text-amber-500'
                  : 'text-emerald-600'
              }`}
            >
              {percentUsed >= 100 ? 'Exceeded' : percentUsed >= 90 ? 'Critical' : 'On Track'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Budgets Section (PRD Section 8) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Category Budgets
            </h3>
            <p className="text-xs text-slate-400">
              Set individual limits for specific spending areas
            </p>
          </div>

          <button
            id="budget-edit-categories-toggle-btn"
            onClick={() => {
              if (isEditingCategories) handleSaveCategoryBudgets();
              else handleStartEditingCategories();
            }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            {isEditingCategories ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Save Categories</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Configure Limits</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {categories
            .filter((c) => c.id !== 'income_general')
            .map((cat) => {
              const catBudget = currentBudget?.categoryBudgets?.[cat.id] || 0;
              const catSpent = currentMonthSummary.categorySpending[cat.id] || 0;
              const catRemaining = catBudget > 0 ? catBudget - catSpent : 0;
              const catPercent = catBudget > 0 ? Math.round((catSpent / catBudget) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  id={`category-budget-card-${cat.id}`}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{
                          backgroundColor: cat.color ? `${cat.color}20` : '#F1F5F9',
                          color: cat.color || '#334155',
                        }}
                      >
                        <CategoryIcon name={cat.icon} size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {cat.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Spent: {formatCurrency(catSpent, profile.defaultCurrency)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {isEditingCategories ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="0"
                            value={editingCategoryBudgets[cat.id] ?? ''}
                            onChange={(e) =>
                              setEditingCategoryBudgets({
                                ...editingCategoryBudgets,
                                [cat.id]: e.target.value,
                              })
                            }
                            className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-right"
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {catBudget > 0
                              ? formatCurrency(catBudget, profile.defaultCurrency)
                              : 'No limit set'}
                          </span>
                          {catBudget > 0 && (
                            <p
                              className={`text-[10px] font-bold ${
                                catPercent >= 100
                                  ? 'text-rose-600'
                                  : catPercent >= 90
                                  ? 'text-amber-500'
                                  : 'text-slate-400'
                              }`}
                            >
                              {catPercent}% used
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {catBudget > 0 && (
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            catPercent >= 100
                              ? 'bg-rose-500'
                              : catPercent >= 90
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(3, catPercent))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>
                          {catRemaining >= 0
                            ? `${formatCurrency(catRemaining, profile.defaultCurrency)} left`
                            : `${formatCurrency(Math.abs(catRemaining), profile.defaultCurrency)} over limit`}
                        </span>
                        <span>{catPercent}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
