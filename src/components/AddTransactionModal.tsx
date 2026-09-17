import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PaymentMethod, TransactionType } from '../types';
import { suggestCategory } from '../utils/categorizer';
import { CategoryIcon } from '../utils/categoryIcons';
import {
  X,
  Sparkles,
  Camera,
  Trash2,
  Calendar,
  Clock,
  Building,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react';

const TRANSACTION_TYPES: Array<{ type: TransactionType; label: string; color: string }> = [
  { type: 'expense', label: 'Expense', color: 'bg-rose-500 text-white' },
  { type: 'income', label: 'Income', color: 'bg-emerald-500 text-white' },
  { type: 'savings', label: 'Savings', color: 'bg-blue-500 text-white' },
  { type: 'credit', label: 'Credit', color: 'bg-amber-500 text-white' },
  { type: 'debit', label: 'Debit', color: 'bg-indigo-500 text-white' },
  { type: 'loan_repayment', label: 'Loan Repay', color: 'bg-purple-500 text-white' },
  { type: 'loan_received', label: 'Loan In', color: 'bg-cyan-500 text-white' },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Bank',
  'Debit Card',
  'Credit Card',
  'Easypaisa',
  'JazzCash',
  'Bank Transfer',
  'Other',
];

export const AddTransactionModal: React.FC = () => {
  const {
    isAddTxOpen,
    closeTxModal,
    editingTx,
    defaultTxType,
    categories,
    transactions,
    profile,
    addTransaction,
    updateTransaction,
  } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('food');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [suggestion, setSuggestion] = useState<{
    categoryId: string;
    subcategoryId?: string;
    confidence: string;
    reason: string;
  } | null>(null);

  // Initialize or reset form state on open
  useEffect(() => {
    if (!isAddTxOpen) return;

    if (editingTx) {
      setType(editingTx.type);
      setAmount(editingTx.amount.toString());
      setCategoryId(editingTx.categoryId || 'food');
      setSubcategoryId(editingTx.subcategoryId || '');
      setDescription(editingTx.description || '');
      setMerchant(editingTx.merchant || '');
      setPaymentMethod(editingTx.paymentMethod || 'Cash');
      setDate(editingTx.date || new Date().toISOString().split('T')[0]);
      setTime(editingTx.time || new Date().toTimeString().slice(0, 5));
      setNotes(editingTx.notes || '');
      setReceiptUrl(editingTx.receiptUrl || '');
    } else {
      setType(defaultTxType);
      setAmount('');
      // Default to appropriate category
      if (defaultTxType === 'income') {
        setCategoryId('income_general');
        setSubcategoryId('Salary');
      } else if (defaultTxType === 'savings' || defaultTxType === 'loan_repayment') {
        setCategoryId('financial');
        setSubcategoryId(defaultTxType === 'savings' ? 'Savings' : 'Loan Repayment');
      } else {
        setCategoryId('food');
        setSubcategoryId('Groceries');
      }
      setDescription('');
      setMerchant('');
      setPaymentMethod('Cash');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().slice(0, 5));
      setNotes('');
      setReceiptUrl('');
    }
    setValidationError('');
    setSuggestion(null);
  }, [isAddTxOpen, editingTx, defaultTxType]);

  // Run Smart Categorization Engine dynamically as user types
  useEffect(() => {
    if (type !== 'expense' && type !== 'income') {
      setSuggestion(null);
      return;
    }
    if (!description && !merchant) {
      setSuggestion(null);
      return;
    }
    const result = suggestCategory(description, merchant, categories, transactions);
    if (result && result.categoryId !== categoryId) {
      setSuggestion(result);
    } else {
      setSuggestion(null);
    }
  }, [description, merchant, type, categories, transactions, categoryId]);

  if (!isAddTxOpen) return null;

  const currentCategory = categories.find((c) => c.id === categoryId);

  const handleApplySuggestion = () => {
    if (suggestion) {
      setCategoryId(suggestion.categoryId);
      if (suggestion.subcategoryId) {
        setSubcategoryId(suggestion.subcategoryId);
      }
      setSuggestion(null);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setValidationError('Receipt image must be under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReceiptUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setValidationError('Please enter a valid amount greater than 0');
      return;
    }

    if (!date) {
      setValidationError('Please select a valid date');
      return;
    }

    const finalDescription = description.trim() || `${type.toUpperCase()} transaction`;

    if (editingTx) {
      updateTransaction(editingTx.id, {
        type,
        amount: numericAmount,
        currency: profile.defaultCurrency,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        description: finalDescription,
        merchant: merchant.trim() || undefined,
        paymentMethod,
        date,
        time: time || '12:00',
        notes: notes.trim() || undefined,
        receiptUrl: receiptUrl || undefined,
      });
    } else {
      addTransaction({
        type,
        amount: numericAmount,
        currency: profile.defaultCurrency,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        description: finalDescription,
        merchant: merchant.trim() || undefined,
        paymentMethod,
        date,
        time: time || '12:00',
        notes: notes.trim() || undefined,
        receiptUrl: receiptUrl || undefined,
      });
    }

    closeTxModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="add-transaction-dialog"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {editingTx ? 'Edit Transaction' : 'Record Transaction'}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {profile.defaultCurrency}
            </span>
          </div>
          <button
            id="add-tx-close-btn"
            onClick={closeTxModal}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Validation Banner */}
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Transaction Type Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {TRANSACTION_TYPES.map((t) => {
                const isSelected = type === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    id={`tx-type-pill-${t.type}`}
                    onClick={() => {
                      setType(t.type);
                      if (t.type === 'income') setCategoryId('income_general');
                      else if (t.type === 'savings' || t.type === 'loan_repayment') setCategoryId('financial');
                    }}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center truncate ${
                      isSelected
                        ? `${t.color} shadow-sm scale-102`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input (Prominent) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount ({profile.defaultCurrency}) *
            </label>
            <div className="relative">
              <input
                id="add-tx-amount-input"
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                required
                className="w-full text-2xl sm:text-3xl font-bold px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Description & Smart Categorization */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Details
            </label>
            <input
              id="add-tx-description-input"
              type="text"
              placeholder="e.g. Bought groceries, Petrol, Netflix bill..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />

            {/* Smart Category Engine Suggestion Banner (Core PRD Section 12) */}
            {suggestion && (
              <div
                id="add-tx-suggestion-chip"
                className="mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-emerald-600 text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                      Suggested Category:{' '}
                      <span className="underline">
                        {categories.find((c) => c.id === suggestion.categoryId)?.name || suggestion.categoryId}
                      </span>
                      {suggestion.subcategoryId && ` (${suggestion.subcategoryId})`}
                    </span>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      {suggestion.reason}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  id="add-tx-accept-suggestion-btn"
                  onClick={handleApplySuggestion}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors"
                >
                  Accept
                </button>
              </div>
            )}
          </div>

          {/* Category & Subcategory Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <div className="relative">
                <select
                  id="add-tx-category-select"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubcategoryId('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subcategory (Optional)
              </label>
              <select
                id="add-tx-subcategory-select"
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">General / None</option>
                {currentCategory?.subcategories?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Merchant / Payee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Merchant / Payee / Person (Optional)
            </label>
            <div className="relative">
              <input
                id="add-tx-merchant-input"
                type="text"
                placeholder="e.g. Carrefour, Shell, Kamran Ali..."
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Payment Method Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Payment Method
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm}
                  type="button"
                  id={`payment-method-${pm.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setPaymentMethod(pm)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    paymentMethod === pm
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time (Default to current, editable) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  id="add-tx-date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exact Time
              </label>
              <div className="relative">
                <input
                  id="add-tx-time-input"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes (Optional)
            </label>
            <div className="relative">
              <input
                id="add-tx-notes-input"
                type="text"
                placeholder="Additional details, tax, warranty..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Receipt Attachment (PRD Section 51) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Receipt / Bill Photo (Optional)
            </label>
            {receiptUrl ? (
              <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
                <img
                  src={receiptUrl}
                  alt="Attached Receipt"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    Receipt attached
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Ready to save</p>
                </div>
                <button
                  type="button"
                  id="add-tx-remove-receipt-btn"
                  onClick={() => setReceiptUrl('')}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  title="Remove Receipt"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                id="add-tx-upload-receipt-btn"
                className="cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="text-xs font-semibold">Attach Receipt Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              id="add-tx-cancel-btn"
              onClick={closeTxModal}
              className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="add-tx-save-submit-btn"
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingTx ? 'Update Transaction' : 'Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
