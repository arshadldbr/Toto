import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PaymentMethod, Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/currency';
import { CategoryIcon } from '../utils/categoryIcons';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit2,
  Receipt,
  Clock,
  Calendar,
  X,
  Building,
  CreditCard,
  ChevronDown,
} from 'lucide-react';

export const TransactionsList: React.FC = () => {
  const {
    transactions,
    categories,
    profile,
    selectedYear,
    selectedMonth,
    openAddTx,
    openEditTx,
    deleteTransaction,
    openReceipt,
  } = useFinance();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'selected_month' | 'today' | 'all' | 'custom'>('selected_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [showFilters, setShowFilters] = useState(false);

  // Delete confirmation modal state
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search Query (description, category, merchant, notes, amount)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const cat = categories.find((c) => c.id === tx.categoryId);
        const matchDesc = tx.description.toLowerCase().includes(query);
        const matchCat = cat?.name.toLowerCase().includes(query);
        const matchMerchant = tx.merchant?.toLowerCase().includes(query);
        const matchNotes = tx.notes?.toLowerCase().includes(query);
        const matchAmount = tx.amount.toString().includes(query);
        if (!matchDesc && !matchCat && !matchMerchant && !matchNotes && !matchAmount) {
          return false;
        }
      }

      // 2. Date Filter
      if (dateFilter === 'selected_month') {
        const [y, m] = tx.date.split('-').map(Number);
        if (y !== selectedYear || m !== selectedMonth) return false;
      } else if (dateFilter === 'today') {
        const todayStr = '2026-09-17'; // Reference current date
        if (tx.date !== todayStr) return false;
      } else if (dateFilter === 'custom') {
        if (customStartDate && tx.date < customStartDate) return false;
        if (customEndDate && tx.date > customEndDate) return false;
      }

      // 3. Type Filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      // 4. Category Filter
      if (categoryFilter !== 'all' && tx.categoryId !== categoryFilter) {
        return false;
      }

      // 5. Payment Method Filter
      if (paymentMethodFilter !== 'all' && tx.paymentMethod !== paymentMethodFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      }
      if (sortBy === 'amount_desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount_asc') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [
    transactions,
    searchQuery,
    dateFilter,
    selectedYear,
    selectedMonth,
    customStartDate,
    customEndDate,
    typeFilter,
    categoryFilter,
    paymentMethodFilter,
    sortBy,
    categories,
  ]);

  const handleDeleteConfirm = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  return (
    <div className="space-y-4 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Top Title & Quick Add */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredTransactions.length} records matching filters
          </p>
        </div>

        <button
          id="transactions-add-btn"
          onClick={() => openAddTx('expense')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              id="transactions-search-input"
              type="text"
              placeholder="Search description, merchant, note, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            id="transactions-filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showFilters || typeFilter !== 'all' || categoryFilter !== 'all' || paymentMethodFilter !== 'all'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort Menu */}
          <div className="relative">
            <select
              id="transactions-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2.5 pl-3 pr-8 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
            {/* Period Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Timeframe
              </label>
              <select
                id="filter-timeframe-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              >
                <option value="selected_month">Selected Month ({selectedMonth}/{selectedYear})</option>
                <option value="today">Today (17 Sep 2026)</option>
                <option value="all">All Time Records</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Transaction Type
              </label>
              <select
                id="filter-type-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
                <option value="loan_repayment">Loan Repayment</option>
                <option value="loan_received">Loan Received</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                id="filter-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Payment Method
              </label>
              <select
                id="filter-payment-method-select"
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              >
                <option value="all">All Payment Methods</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Custom Dates (if selected) */}
            {dateFilter === 'custom' && (
              <div className="col-span-full grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              No transactions found
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try clearing your filters or search terms to see more records.'
                : 'Start tracking your expenses and income by clicking New Transaction.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const isIncome = tx.type === 'income' || tx.type === 'loan_received';
              const isSavings = tx.type === 'savings';

              return (
                <div
                  key={tx.id}
                  id={`transaction-row-${tx.id}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Left: Icon & Info */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        backgroundColor: cat?.color ? `${cat.color}20` : '#F1F5F9',
                        color: cat?.color || '#334155',
                      }}
                    >
                      <CategoryIcon name={cat?.icon} size={20} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {tx.description}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            tx.type === 'expense'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : tx.type === 'income'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : tx.type === 'savings'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : tx.type === 'credit'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : tx.type === 'debit'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          }`}
                        >
                          {tx.type.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Details row: Category, merchant, date, exact time, payment method */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {cat?.name || 'General'}
                          {tx.subcategoryId && ` / ${tx.subcategoryId}`}
                        </span>

                        {tx.merchant && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" />
                              {tx.merchant}
                            </span>
                          </>
                        )}

                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {tx.date}
                        </span>

                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {tx.time}
                        </span>

                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {tx.paymentMethod}
                        </span>
                      </div>

                      {tx.notes && (
                        <p className="text-[11px] text-slate-400 italic mt-1 truncate max-w-md">
                          Note: {tx.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left sm:text-right">
                      <span
                        className={`text-base sm:text-lg font-black tracking-tight ${
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
                    </div>

                    <div className="flex items-center gap-1">
                      {tx.receiptUrl && (
                        <button
                          id={`tx-view-receipt-${tx.id}`}
                          onClick={() => openReceipt(tx.receiptUrl!)}
                          className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          title="View Receipt Attachment"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        id={`tx-edit-btn-${tx.id}`}
                        onClick={() => openEditTx(tx)}
                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        title="Edit Transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        id={`tx-delete-btn-${tx.id}`}
                        onClick={() => setTxToDelete(tx)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {txToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete Transaction?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete &quot;{txToDelete.description}&quot; for{' '}
                {formatCurrency(txToDelete.amount, profile.defaultCurrency)}? All budget, chart,
                and balance calculations will be recalculated immediately.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                id="delete-tx-cancel-btn"
                onClick={() => setTxToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                id="delete-tx-confirm-btn"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
