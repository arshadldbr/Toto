export type TransactionType =
  | 'expense'
  | 'income'
  | 'savings'
  | 'credit'
  | 'debit'
  | 'loan_received'
  | 'loan_repayment';

export type PaymentMethod =
  | 'Cash'
  | 'Bank'
  | 'Debit Card'
  | 'Credit Card'
  | 'Easypaisa'
  | 'JazzCash'
  | 'Bank Transfer'
  | 'Other';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  type?: 'expense' | 'income';
  isDefault?: boolean;
  subcategories?: string[];
}

export interface Transaction {
  id: string;
  userId?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  merchant?: string;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h or formatted)
  notes?: string;
  receiptUrl?: string; // base64 or URL
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId?: string;
  month: number; // 1-12
  year: number;
  totalBudget: number;
  warningThreshold1: number; // default 75
  warningThreshold2: number; // default 90
  categoryBudgets: Record<string, number>; // categoryId -> budget amount
}

export interface SavingsGoal {
  id: string;
  userId?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  notes?: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface CreditDebit {
  id: string;
  userId?: string;
  person: string;
  amount: number;
  paidAmount: number;
  type: 'credit' | 'debit'; // credit = others owe you, debit = you owe others
  date: string;
  dueDate?: string;
  description?: string;
  status: 'pending' | 'partially_paid' | 'paid' | 'overdue';
  notes?: string;
}

export interface Loan {
  id: string;
  userId?: string;
  name: string;
  lender: string;
  principalAmount: number;
  paidAmount: number;
  interestRate?: number;
  installmentAmount?: number;
  frequency?: 'monthly' | 'weekly' | 'one-time';
  startDate: string;
  dueDate?: string;
  status: 'active' | 'completed';
  notes?: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  symbolPosition: 'before' | 'after';
  decimals: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  profileImage?: string;
  defaultCurrency: string;
  defaultMonthlyBudget: number;
  theme: 'light' | 'dark' | 'system';
  onboardingCompleted: boolean;
  budgetAlert75: boolean;
  budgetAlert90: boolean;
  budgetAlert100: boolean;
  createdAt: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'home'
  | 'transactions'
  | 'budget'
  | 'savings'
  | 'credit_debit'
  | 'loans'
  | 'reports'
  | 'calendar'
  | 'categories'
  | 'settings';
