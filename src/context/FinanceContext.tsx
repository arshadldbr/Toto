import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActiveTab,
  Budget,
  Category,
  CreditDebit,
  Loan,
  PaymentMethod,
  SavingsGoal,
  Transaction,
  TransactionType,
  UserProfile,
} from '../types';
import { StorageService } from '../services/storageService';
import {
  calculateMonthSummary,
  calculateOverallBalances,
  compareMonths,
  generateDashboardInsights,
  MonthComparison,
  MonthSummary,
  OverallBalances,
  FinancialInsight,
} from '../utils/calculations';

interface FinanceContextType {
  profile: UserProfile;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  savings: SavingsGoal[];
  creditDebit: CreditDebit[];
  loans: Loan[];
  selectedYear: number;
  selectedMonth: number;
  activeTab: ActiveTab;
  isAddTxOpen: boolean;
  editingTx: Transaction | null;
  defaultTxType: TransactionType;
  selectedReceiptUrl: string | null;

  // Derived state
  currentMonthSummary: MonthSummary;
  previousMonthSummary: MonthSummary | null;
  overallBalances: OverallBalances;
  monthComparison: MonthComparison | null;
  dashboardInsights: FinancialInsight[];
  currentBudget: Budget | undefined;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedPeriod: (year: number, month: number) => void;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  prevMonth: () => void;
  nextMonth: () => void;
  goToCurrentMonth: () => void;
  openAddTx: (type?: TransactionType) => void;
  openEditTx: (tx: Transaction) => void;
  closeTxModal: () => void;
  openReceipt: (url: string) => void;
  closeReceipt: () => void;
  receiptModalUrl: string | null;

  // CRUD
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  updateBudget: (budget: { month: number; year: number; totalBudget: number; categoryBudgets?: Record<string, number> }) => void;

  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string, reassignToId?: string) => boolean;

  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  depositToSavings: (goalId: string, amount: number, paymentMethod?: PaymentMethod, notes?: string) => void;
  withdrawFromSavings: (goalId: string, amount: number, paymentMethod?: PaymentMethod, notes?: string) => boolean;
  deleteSavingsGoal: (id: string) => void;

  addCreditDebit: (entry: Omit<CreditDebit, 'id'>) => void;
  recordCreditDebitPayment: (id: string, amount: number) => void;
  deleteCreditDebit: (id: string) => void;

  addLoan: (loan: Omit<Loan, 'id'>) => void;
  recordLoanRepayment: (loanId: string, amount: number, paymentMethod?: PaymentMethod, notes?: string) => void;
  deleteLoan: (id: string) => void;

  updateProfile: (updates: Partial<UserProfile>) => void;
  resetAllData: () => void;
  resetData: () => void;
  importBackupData: (json: string) => boolean;
  importAllData: (json: string) => boolean;
  exportAllData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Reference date: September 17, 2026
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [budgets, setBudgets] = useState<Budget[]>(() => StorageService.getBudgets());
  const [savings, setSavings] = useState<SavingsGoal[]>(() => StorageService.getSavings());
  const [creditDebit, setCreditDebit] = useState<CreditDebit[]>(() => StorageService.getCreditDebit());
  const [loans, setLoans] = useState<Loan[]>(() => StorageService.getLoans());

  // Modal states
  const [isAddTxOpen, setIsAddTxOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [defaultTxType, setDefaultTxType] = useState<TransactionType>('expense');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  // Sync dark theme class on documentElement
  useEffect(() => {
    const isDark =
      profile.theme === 'dark' ||
      (profile.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.theme]);

  // Find or create current budget
  const currentBudget = useMemo(() => {
    return budgets.find((b) => b.year === selectedYear && b.month === selectedMonth);
  }, [budgets, selectedYear, selectedMonth]);

  // Current month summary
  const currentMonthSummary = useMemo(() => {
    return calculateMonthSummary(transactions, selectedYear, selectedMonth, currentBudget, categories);
  }, [transactions, selectedYear, selectedMonth, currentBudget, categories]);

  // Previous month summary
  const previousMonthSummary = useMemo(() => {
    const prevM = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevY = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    const prevBgt = budgets.find((b) => b.year === prevY && b.month === prevM);
    return calculateMonthSummary(transactions, prevY, prevM, prevBgt, categories);
  }, [transactions, selectedYear, selectedMonth, budgets, categories]);

  // Overall balances
  const overallBalances = useMemo(() => {
    return calculateOverallBalances(savings, creditDebit, loans);
  }, [savings, creditDebit, loans]);

  // Month-to-month comparison
  const monthComparison = useMemo(() => {
    if (!previousMonthSummary) return null;
    return compareMonths(currentMonthSummary, previousMonthSummary, categories);
  }, [currentMonthSummary, previousMonthSummary, categories]);

  // Dashboard Insights
  const dashboardInsights = useMemo(() => {
    return generateDashboardInsights(
      currentMonthSummary,
      previousMonthSummary,
      savings,
      profile.defaultCurrency
    );
  }, [currentMonthSummary, previousMonthSummary, savings, profile.defaultCurrency]);

  // Month navigation
  const prevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const goToCurrentMonth = () => {
    setSelectedYear(2026);
    setSelectedMonth(9);
  };

  const setSelectedPeriod = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  // Transaction modals
  const openAddTx = (type: TransactionType = 'expense') => {
    setDefaultTxType(type);
    setEditingTx(null);
    setIsAddTxOpen(true);
  };

  const openEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setDefaultTxType(tx.type);
    setIsAddTxOpen(true);
  };

  const closeTxModal = () => {
    setIsAddTxOpen(false);
    setEditingTx(null);
  };

  const openReceipt = (url: string) => setSelectedReceiptUrl(url);
  const closeReceipt = () => setSelectedReceiptUrl(null);

  // CRUD for Transactions
  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    StorageService.saveTransactions(updated);
    return newTx;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map((tx) =>
      tx.id === id ? { ...tx, ...updates, updatedAt: new Date().toISOString() } : tx
    );
    setTransactions(updated);
    StorageService.saveTransactions(updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((tx) => tx.id !== id);
    setTransactions(updated);
    StorageService.saveTransactions(updated);
  };

  // Budget
  const updateBudget = (data: {
    month: number;
    year: number;
    totalBudget: number;
    categoryBudgets?: Record<string, number>;
  }) => {
    const existingIndex = budgets.findIndex((b) => b.month === data.month && b.year === data.year);
    let updated: Budget[];

    if (existingIndex >= 0) {
      updated = [...budgets];
      updated[existingIndex] = {
        ...updated[existingIndex],
        totalBudget: data.totalBudget,
        categoryBudgets: data.categoryBudgets || updated[existingIndex].categoryBudgets,
      };
    } else {
      const newBudget: Budget = {
        id: `bgt_${data.year}_${data.month}`,
        month: data.month,
        year: data.year,
        totalBudget: data.totalBudget,
        warningThreshold1: 75,
        warningThreshold2: 90,
        categoryBudgets: data.categoryBudgets || {},
      };
      updated = [...budgets, newBudget];
    }

    setBudgets(updated);
    StorageService.saveBudgets(updated);
  };

  // Categories
  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...categoryData,
      id: `cat_${Date.now()}`,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    StorageService.saveCategories(updated);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCategories(updated);
    StorageService.saveCategories(updated);
  };

  const deleteCategory = (id: string, reassignToId?: string): boolean => {
    // Check if transactions use this category
    const usedInTxs = transactions.some((tx) => tx.categoryId === id);
    if (usedInTxs) {
      if (!reassignToId) {
        return false; // must reassign
      }
      // Reassign transactions
      const reassignedTxs = transactions.map((tx) =>
        tx.categoryId === id ? { ...tx, categoryId: reassignToId, updatedAt: new Date().toISOString() } : tx
      );
      setTransactions(reassignedTxs);
      StorageService.saveTransactions(reassignedTxs);
    }

    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    StorageService.saveCategories(updated);
    return true;
  };

  // Savings
  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `sav_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...savings, newGoal];
    setSavings(updated);
    StorageService.saveSavings(updated);
  };

  const depositToSavings = (
    goalId: string,
    amount: number,
    paymentMethod: PaymentMethod = 'Bank Transfer',
    notes?: string
  ) => {
    const targetGoal = savings.find((g) => g.id === goalId);
    if (!targetGoal) return;

    const updatedGoals = savings.map((g) =>
      g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
    );
    setSavings(updatedGoals);
    StorageService.saveSavings(updatedGoals);

    // Record as savings transaction
    addTransaction({
      type: 'savings',
      amount,
      currency: profile.defaultCurrency,
      categoryId: 'financial',
      subcategoryId: 'Savings',
      description: `Deposit towards "${targetGoal.name}"`,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: notes || `Goal: ${targetGoal.name}`,
    });
  };

  const withdrawFromSavings = (
    goalId: string,
    amount: number,
    paymentMethod: PaymentMethod = 'Bank Transfer',
    notes?: string
  ): boolean => {
    const targetGoal = savings.find((g) => g.id === goalId);
    if (!targetGoal || targetGoal.currentAmount < amount) return false;

    const updatedGoals = savings.map((g) =>
      g.id === goalId ? { ...g, currentAmount: g.currentAmount - amount } : g
    );
    setSavings(updatedGoals);
    StorageService.saveSavings(updatedGoals);

    // Record as income/withdrawal transaction
    addTransaction({
      type: 'income',
      amount,
      currency: profile.defaultCurrency,
      categoryId: 'financial',
      subcategoryId: 'Savings Withdrawal',
      description: `Withdrawal from "${targetGoal.name}"`,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: notes || `Withdrawn from ${targetGoal.name}`,
    });

    return true;
  };

  const deleteSavingsGoal = (id: string) => {
    const updated = savings.filter((g) => g.id !== id);
    setSavings(updated);
    StorageService.saveSavings(updated);
  };

  // Credit / Debit
  const addCreditDebit = (entryData: Omit<CreditDebit, 'id'>) => {
    const newEntry: CreditDebit = {
      ...entryData,
      id: `cd_${Date.now()}`,
    };
    const updated = [newEntry, ...creditDebit];
    setCreditDebit(updated);
    StorageService.saveCreditDebit(updated);

    // Also record transaction entry for financial tracking
    addTransaction({
      type: entryData.type === 'credit' ? 'credit' : 'debit',
      amount: entryData.amount,
      currency: profile.defaultCurrency,
      categoryId: 'financial',
      description: `${entryData.type === 'credit' ? 'Credit to' : 'Debit from'} ${entryData.person}: ${entryData.description || ''}`,
      paymentMethod: 'Other',
      date: entryData.date || new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: entryData.notes,
    });
  };

  const recordCreditDebitPayment = (id: string, amount: number) => {
    const entry = creditDebit.find((cd) => cd.id === id);
    if (!entry) return;

    const newPaidAmount = entry.paidAmount + amount;
    const isCompleted = newPaidAmount >= entry.amount;
    const newStatus: CreditDebit['status'] = isCompleted ? 'paid' : 'partially_paid';

    const updated = creditDebit.map((cd) =>
      cd.id === id ? { ...cd, paidAmount: newPaidAmount, status: newStatus } : cd
    );
    setCreditDebit(updated);
    StorageService.saveCreditDebit(updated);

    // If it's a credit (they owed us and paid us back), that is incoming cash!
    // If it's a debit (we owed them and paid them), that is an expense outflow!
    addTransaction({
      type: entry.type === 'credit' ? 'income' : 'expense',
      amount,
      currency: profile.defaultCurrency,
      categoryId: 'financial',
      subcategoryId: entry.type === 'credit' ? 'Credit Repayment Received' : 'Debit Settled',
      description: `Payment for ${entry.type === 'credit' ? 'credit' : 'debt'} with ${entry.person}`,
      paymentMethod: 'Bank Transfer',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: `Settlement for: ${entry.description || entry.person}`,
    });
  };

  const deleteCreditDebit = (id: string) => {
    const updated = creditDebit.filter((cd) => cd.id !== id);
    setCreditDebit(updated);
    StorageService.saveCreditDebit(updated);
  };

  // Loans
  const addLoan = (loanData: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: `loan_${Date.now()}`,
    };
    const updated = [newLoan, ...loans];
    setLoans(updated);
    StorageService.saveLoans(updated);

    // Record loan received inflow transaction
    addTransaction({
      type: 'loan_received',
      amount: loanData.principalAmount,
      currency: profile.defaultCurrency,
      categoryId: 'financial',
      description: `Loan received: ${loanData.name} from ${loanData.lender}`,
      paymentMethod: 'Bank Transfer',
      date: loanData.startDate || new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: loanData.notes,
    });
  };

  const recordLoanRepayment = (
    loanId: string,
    amount: number,
    paymentMethod: PaymentMethod = 'Bank Transfer',
    notes?: string
  ) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    const newPaid = targetLoan.paidAmount + amount;
    const isCompleted = newPaid >= targetLoan.principalAmount;

    const updated: Loan[] = loans.map((l) =>
      l.id === loanId
        ? {
            ...l,
            paidAmount: newPaid,
            status: (isCompleted ? 'completed' : 'active') as 'completed' | 'active',
          }
        : l
    );
    setLoans(updated);
    StorageService.saveLoans(updated);

    // Record loan repayment transaction (affects expenses & cashflow)
    addTransaction({
      type: 'loan_repayment',
      amount,
      currency: profile.defaultCurrency,
      categoryId: 'financial',
      subcategoryId: 'Loan Repayment',
      description: `Repayment for ${targetLoan.name}`,
      merchant: targetLoan.lender,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: notes || `Lender: ${targetLoan.lender}`,
    });
  };

  const deleteLoan = (id: string) => {
    const updated = loans.filter((l) => l.id !== id);
    setLoans(updated);
    StorageService.saveLoans(updated);
  };

  // Profile & System
  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const resetAllData = () => {
    StorageService.resetToDemoData();
    setProfile(StorageService.getProfile());
    setCategories(StorageService.getCategories());
    setTransactions(StorageService.getTransactions());
    setBudgets(StorageService.getBudgets());
    setSavings(StorageService.getSavings());
    setCreditDebit(StorageService.getCreditDebit());
    setLoans(StorageService.getLoans());
  };

  const importBackupData = (json: string): boolean => {
    const success = StorageService.importFullBackupJSON(json);
    if (success) {
      setProfile(StorageService.getProfile());
      setCategories(StorageService.getCategories());
      setTransactions(StorageService.getTransactions());
      setBudgets(StorageService.getBudgets());
      setSavings(StorageService.getSavings());
      setCreditDebit(StorageService.getCreditDebit());
      setLoans(StorageService.getLoans());
    }
    return success;
  };

  const exportAllData = () => {
    const json = StorageService.exportFullBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_expense_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <FinanceContext.Provider
      value={{
        profile,
        categories,
        transactions,
        budgets,
        savings,
        creditDebit,
        loans,
        selectedYear,
        selectedMonth,
        setSelectedYear,
        setSelectedMonth,
        activeTab,
        isAddTxOpen,
        editingTx,
        defaultTxType,
        selectedReceiptUrl,
        receiptModalUrl: selectedReceiptUrl,
        currentMonthSummary,
        previousMonthSummary,
        overallBalances,
        monthComparison,
        dashboardInsights,
        currentBudget,
        setActiveTab,
        setSelectedPeriod,
        prevMonth,
        nextMonth,
        goToCurrentMonth,
        openAddTx,
        openEditTx,
        closeTxModal,
        openReceipt,
        closeReceipt,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        addCategory,
        updateCategory,
        deleteCategory,
        addSavingsGoal,
        depositToSavings,
        withdrawFromSavings,
        deleteSavingsGoal,
        addCreditDebit,
        recordCreditDebitPayment,
        deleteCreditDebit,
        addLoan,
        recordLoanRepayment,
        deleteLoan,
        updateProfile,
        resetAllData,
        resetData: resetAllData,
        importBackupData,
        importAllData: importBackupData,
        exportAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
