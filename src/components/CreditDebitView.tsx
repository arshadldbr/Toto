import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CreditDebit } from '../types';
import { formatCurrency } from '../utils/currency';
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Trash2,
  Calendar,
  X,
} from 'lucide-react';

export const CreditDebitView: React.FC = () => {
  const {
    creditDebit,
    profile,
    overallBalances,
    addCreditDebit,
    recordCreditDebitPayment,
    deleteCreditDebit,
  } = useFinance();

  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [settlementItem, setSettlementItem] = useState<CreditDebit | null>(null);
  const [settlementAmount, setSettlementAmount] = useState('');

  // Form states
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const filteredEntries = creditDebit.filter((cd) => {
    if (filterType === 'credit') return cd.type === 'credit';
    if (filterType === 'debit') return cd.type === 'debit';
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !person.trim()) return;

    addCreditDebit({
      person: person.trim(),
      amount: num,
      paidAmount: 0,
      type,
      date,
      dueDate: dueDate || undefined,
      description: description.trim() || undefined,
      status: 'pending',
      notes: notes.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setPerson('');
    setAmount('');
    setDescription('');
    setNotes('');
    setDueDate('');
  };

  const handleSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlementItem) return;
    const payment = parseFloat(settlementAmount);
    if (isNaN(payment) || payment <= 0) return;

    recordCreditDebitPayment(settlementItem.id, payment);
    setSettlementItem(null);
    setSettlementAmount('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Credit & Debit Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track receivables (money owed to you) and payables (money you owe)
          </p>
        </div>

        <button
          id="credit-debit-new-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credit / Debit</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Outstanding Credit (Receivables) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Outstanding Credit (Receivables)
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(overallBalances.outstandingCredit, profile.defaultCurrency)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Money to receive from others</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Outstanding Debit (Payables) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Outstanding Debit (Payables)
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(overallBalances.outstandingDebit, profile.defaultCurrency)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Money you must pay to others</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filterType === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          All ({creditDebit.length})
        </button>
        <button
          onClick={() => setFilterType('credit')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filterType === 'credit'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Receivables (Credit)
        </button>
        <button
          onClick={() => setFilterType('debit')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filterType === 'debit'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Payables (Debit)
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="py-12 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No credit or debit entries found.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add debts or loans with friends, clients, or colleagues to keep track.
            </p>
          </div>
        ) : (
          filteredEntries.map((item) => {
            const remaining = Math.max(0, item.amount - item.paidAmount);
            const isSettled = item.status === 'paid' || remaining === 0;

            return (
              <div
                key={item.id}
                id={`credit-debit-card-${item.id}`}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'credit'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {item.type === 'credit' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {item.person}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          item.type === 'credit'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {item.type === 'credit' ? 'They Owe You' : 'You Owe Them'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSettled
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.paidAmount > 0
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isSettled ? 'Paid / Settled' : item.paidAmount > 0 ? 'Partially Paid' : 'Pending'}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span>Date: {item.date}</span>
                      {item.dueDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <Clock className="w-3 h-3" /> Due: {item.dueDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {formatCurrency(remaining, profile.defaultCurrency)}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Total: {formatCurrency(item.amount, profile.defaultCurrency)} (Paid:{' '}
                      {formatCurrency(item.paidAmount, profile.defaultCurrency)})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isSettled && (
                      <button
                        onClick={() => {
                          setSettlementItem(item);
                          setSettlementAmount(remaining.toString());
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                      >
                        Record Payment
                      </button>
                    )}
                    <button
                      onClick={() => deleteCreditDebit(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Record Credit / Debit
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('credit')}
                  className={`py-2 rounded-xl text-xs font-bold ${
                    type === 'credit'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Credit (They Owe Me)
                </button>
                <button
                  type="button"
                  onClick={() => setType('debit')}
                  className={`py-2 rounded-xl text-xs font-bold ${
                    type === 'debit'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Debit (I Owe Them)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Person / Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kamran Ali, Design Client..."
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount ({profile.defaultCurrency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full text-lg font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shared restaurant bill, freelance deposit"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settlement Payment Modal */}
      {settlementItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Record Payment / Settlement
              </h3>
              <button
                onClick={() => setSettlementItem(null)}
                className="p-1 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              For <strong>{settlementItem.person}</strong> ({settlementItem.type === 'credit' ? 'Receivable' : 'Payable'}).
              Remaining balance is {formatCurrency(settlementItem.amount - settlementItem.paidAmount, profile.defaultCurrency)}.
            </p>

            <form onSubmit={handleSettlementSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Settlement Amount ({profile.defaultCurrency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(e.target.value)}
                  required
                  autoFocus
                  className="w-full text-xl font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSettlementItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
