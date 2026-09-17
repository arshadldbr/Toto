import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Loan } from '../types';
import { formatCurrency } from '../utils/currency';
import {
  Building,
  Plus,
  ArrowDownLeft,
  CheckCircle2,
  Calendar,
  Percent,
  Trash2,
  X,
  CreditCard,
} from 'lucide-react';

export const LoansView: React.FC = () => {
  const {
    loans,
    profile,
    overallBalances,
    addLoan,
    recordLoanRepayment,
    deleteLoan,
  } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [repayLoan, setRepayLoan] = useState<Loan | null>(null);
  const [repayAmount, setRepayAmount] = useState('');
  const [repayNotes, setRepayNotes] = useState('');

  // Form states for new loan
  const [name, setName] = useState('');
  const [lender, setLender] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'one-time'>('monthly');
  const [notes, setNotes] = useState('');

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const principal = parseFloat(principalAmount);
    if (isNaN(principal) || principal <= 0 || !name.trim() || !lender.trim()) return;

    addLoan({
      name: name.trim(),
      lender: lender.trim(),
      principalAmount: principal,
      paidAmount: 0,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      installmentAmount: installmentAmount ? parseFloat(installmentAmount) : undefined,
      frequency,
      startDate,
      dueDate: dueDate || undefined,
      status: 'active',
      notes: notes.trim() || undefined,
    });

    setIsAddOpen(false);
    setName('');
    setLender('');
    setPrincipalAmount('');
    setInterestRate('');
    setInstallmentAmount('');
    setDueDate('');
    setNotes('');
  };

  const handleRepaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayLoan) return;
    const amt = parseFloat(repayAmount);
    if (isNaN(amt) || amt <= 0) return;

    recordLoanRepayment(repayLoan.id, amt, 'Bank Transfer', repayNotes);
    setRepayLoan(null);
    setRepayAmount('');
    setRepayNotes('');
  };

  const totalPrincipalAll = loans.reduce((sum, l) => sum + l.principalAmount, 0);
  const totalPaidAll = loans.reduce((sum, l) => sum + l.paidAmount, 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Loan & Debt Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage long-term borrowings, bank financing, and repayment schedules
          </p>
        </div>

        <button
          id="loans-new-btn"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Loan</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white shadow-lg shadow-purple-700/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
              Total Outstanding Loan Balance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
              {formatCurrency(overallBalances.outstandingLoans, profile.defaultCurrency)}
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-purple-200">Total Borrowed</span>
            <p className="text-xl font-bold">
              {formatCurrency(totalPrincipalAll, profile.defaultCurrency)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-purple-600/40 text-xs">
          <div>
            <span className="text-purple-200">Total Repaid</span>
            <p className="text-sm font-bold">{formatCurrency(totalPaidAll, profile.defaultCurrency)}</p>
          </div>
          <div>
            <span className="text-purple-200">Active Facilities</span>
            <p className="text-sm font-bold">{loans.filter((l) => l.status === 'active').length} Loans</p>
          </div>
          <div>
            <span className="text-purple-200">Repayment Progress</span>
            <p className="text-sm font-bold">
              {totalPrincipalAll > 0 ? Math.round((totalPaidAll / totalPrincipalAll) * 100) : 0}% Cleared
            </p>
          </div>
        </div>
      </div>

      {/* Loans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loans.map((loan) => {
          const remaining = Math.max(0, loan.principalAmount - loan.paidAmount);
          const progress = Math.min(100, Math.round((loan.paidAmount / loan.principalAmount) * 100));
          const isCompleted = remaining === 0 || loan.status === 'completed';

          return (
            <div
              key={loan.id}
              id={`loan-card-${loan.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                        {loan.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Lender: {loan.lender}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteLoan(loan.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar & Balances */}
                <div className="space-y-2 my-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400">Remaining</span>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {formatCurrency(remaining, profile.defaultCurrency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">Original Loan</span>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                        {formatCurrency(loan.principalAmount, profile.defaultCurrency)}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, progress)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Paid: {formatCurrency(loan.paidAmount, profile.defaultCurrency)}</span>
                    <span>{progress}% Repaid</span>
                  </div>
                </div>

                {/* Installment & Interest Info */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <div>
                    <span className="text-slate-400">Installment:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {loan.installmentAmount
                        ? `${formatCurrency(loan.installmentAmount, profile.defaultCurrency)}/${loan.frequency || 'mo'}`
                        : 'Custom'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Interest Rate:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {loan.interestRate ? `${loan.interestRate}%` : 'None / 0%'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {isCompleted ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Loan Fully Settled
                  </span>
                ) : (
                  <button
                    id={`loan-repay-btn-${loan.id}`}
                    onClick={() => {
                      setRepayLoan(loan);
                      setRepayAmount(loan.installmentAmount ? loan.installmentAmount.toString() : '');
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Make Repayment</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Loan Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Add Loan Facility
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLoan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Loan Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Car Financing, Personal Loan, Home Mortgage"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lender / Bank *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standard Chartered, Habib Bank, Friend"
                  value={lender}
                  onChange={(e) => setLender(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Principal Amount ({profile.defaultCurrency}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="500000"
                    value={principalAmount}
                    onChange={(e) => setPrincipalAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Interest Rate % (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="12.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Installment Amount
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="22000"
                    value={installmentAmount}
                    onChange={(e) => setInstallmentAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Terms, account number, collateral..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Save Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repay Modal */}
      {repayLoan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Record Repayment for {repayLoan.name}
              </h3>
              <button
                onClick={() => setRepayLoan(null)}
                className="p-1 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Lender: <strong>{repayLoan.lender}</strong>. Remaining principal is{' '}
              {formatCurrency(repayLoan.principalAmount - repayLoan.paidAmount, profile.defaultCurrency)}.
            </p>

            <form onSubmit={handleRepaySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Repayment Amount ({profile.defaultCurrency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  required
                  autoFocus
                  className="w-full text-xl font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Remarks / Reference
                </label>
                <input
                  type="text"
                  placeholder="Installment # or bank transfer receipt"
                  value={repayNotes}
                  onChange={(e) => setRepayNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRepayLoan(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
