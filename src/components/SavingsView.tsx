import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types';
import { formatCurrency } from '../utils/currency';
import { CategoryIcon } from '../utils/categoryIcons';
import {
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Trash2,
  Laptop,
  Plane,
  Shield,
  Home,
  Car,
  X,
  Target,
} from 'lucide-react';

export const SavingsView: React.FC = () => {
  const {
    savings,
    profile,
    overallBalances,
    addSavingsGoal,
    depositToSavings,
    withdrawFromSavings,
    deleteSavingsGoal,
  } = useFinance();

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [goalForAction, setGoalForAction] = useState<{
    goal: SavingsGoal;
    type: 'deposit' | 'withdraw';
  } | null>(null);

  // Form states for creating goal
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('PiggyBank');

  // Form state for deposit/withdraw
  const [actionAmount, setActionAmount] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [actionError, setActionError] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initial = parseFloat(currentAmount) || 0;

    if (isNaN(target) || target <= 0) return;

    addSavingsGoal({
      name: name.trim() || 'Savings Goal',
      targetAmount: target,
      currentAmount: initial,
      targetDate: targetDate || undefined,
      notes: notes.trim() || undefined,
      icon: selectedIcon,
      color: '#3B82F6',
    });

    setIsCreateOpen(false);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
    setNotes('');
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!goalForAction) return;

    const amt = parseFloat(actionAmount);
    if (isNaN(amt) || amt <= 0) {
      setActionError('Enter a valid amount');
      return;
    }

    if (goalForAction.type === 'deposit') {
      depositToSavings(goalForAction.goal.id, amt, 'Bank Transfer', actionNotes);
      setGoalForAction(null);
      setActionAmount('');
      setActionNotes('');
    } else {
      const ok = withdrawFromSavings(goalForAction.goal.id, amt, 'Bank Transfer', actionNotes);
      if (!ok) {
        setActionError('Cannot withdraw more than current saved amount');
        return;
      }
      setGoalForAction(null);
      setActionAmount('');
      setActionNotes('');
    }
  };

  const totalSavedAll = overallBalances.totalSavingsPool;
  const totalTargetAll = savings.reduce((s, g) => s + g.targetAmount, 0);
  const overallProgress = totalTargetAll > 0 ? Math.min(100, Math.round((totalSavedAll / totalTargetAll) * 100)) : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Savings Goals & Reserves
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track future targets, emergency funds, and personal milestones
          </p>
        </div>

        <button
          id="savings-new-goal-btn"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Overall Savings Overview Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Total Accumulated Savings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
              {formatCurrency(totalSavedAll, profile.defaultCurrency)}
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-emerald-100">Cumulative Target</span>
            <p className="text-xl font-bold">
              {formatCurrency(totalTargetAll, profile.defaultCurrency)}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, overallProgress)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-emerald-100 font-medium">
            <span>{savings.length} Active Goals</span>
            <span>{overallProgress}% of all targets reached</span>
          </div>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savings.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const isCompleted = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              id={`savings-goal-card-${goal.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <CategoryIcon name={goal.icon || 'PiggyBank'} size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                        {goal.name}
                      </h3>
                      {goal.targetDate && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Target: {goal.targetDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSavingsGoal(goal.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amount Progress */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {formatCurrency(goal.currentAmount, profile.defaultCurrency)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      of {formatCurrency(goal.targetAmount, profile.defaultCurrency)}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-teal-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(3, progress)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                    <span className="font-semibold">
                      {isCompleted ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Goal Reached!
                        </span>
                      ) : (
                        `Remaining: ${formatCurrency(remaining, profile.defaultCurrency)}`
                      )}
                    </span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                </div>

                {goal.notes && (
                  <p className="text-xs text-slate-400 italic mt-2 line-clamp-2">
                    {goal.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons: Add Money / Withdraw */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  id={`goal-deposit-btn-${goal.id}`}
                  onClick={() => setGoalForAction({ goal, type: 'deposit' })}
                  className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Deposit</span>
                </button>

                <button
                  id={`goal-withdraw-btn-${goal.id}`}
                  onClick={() => setGoalForAction({ goal, type: 'withdraw' })}
                  disabled={goal.currentAmount <= 0}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Savings Goal Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Create Savings Goal
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Laptop, Emergency Fund..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Amount *
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="150000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Amount
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Choose Icon
                </label>
                <div className="flex gap-2">
                  {['PiggyBank', 'Laptop', 'Shield', 'Plane', 'Home', 'Car'].map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      className={`p-2 rounded-xl border ${
                        selectedIcon === iconName
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <CategoryIcon name={iconName} size={18} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Motivation
                </label>
                <input
                  type="text"
                  placeholder="e.g. For remote freelance projects"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit / Withdraw Action Modal */}
      {goalForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {goalForAction.type === 'deposit' ? 'Add Funds to' : 'Withdraw Funds from'}{' '}
                {goalForAction.goal.name}
              </h3>
              <button
                onClick={() => setGoalForAction(null)}
                className="p-1 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <p className="text-xs text-rose-600 font-semibold">{actionError}</p>
            )}

            <form onSubmit={handleActionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount ({profile.defaultCurrency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="0.00"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  autoFocus
                  required
                  className="w-full text-xl font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note / Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly contribution or emergency expense"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setGoalForAction(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Confirm {goalForAction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
