import { Budget, Category, CreditDebit, Loan, SavingsGoal, Transaction, UserProfile } from '../types';
import { DEFAULT_CATEGORIES } from '../data/defaultCategories';

const STORAGE_KEYS = {
  PROFILE: 'smart_expense_user_profile',
  TRANSACTIONS: 'smart_expense_transactions',
  CATEGORIES: 'smart_expense_categories',
  BUDGETS: 'smart_expense_budgets',
  SAVINGS: 'smart_expense_savings',
  CREDIT_DEBIT: 'smart_expense_credit_debit',
  LOANS: 'smart_expense_loans',
};

// Realistic initial seed data for September 2026 (Current) and August 2026 (Previous)
export function getInitialSeedData(): {
  profile: UserProfile;
  categories: Category[];
  budgets: Budget[];
  transactions: Transaction[];
  savings: SavingsGoal[];
  creditDebit: CreditDebit[];
  loans: Loan[];
} {
  const profile: UserProfile = {
    id: 'usr_default',
    name: 'Arshad Beer',
    email: 'arshadlaidbeer@gmail.com',
    defaultCurrency: 'PKR',
    defaultMonthlyBudget: 100000,
    theme: 'light',
    onboardingCompleted: true,
    budgetAlert75: true,
    budgetAlert90: true,
    budgetAlert100: true,
    createdAt: '2026-08-01T09:00:00Z',
  };

  const budgets: Budget[] = [
    {
      id: 'bgt_2026_9',
      month: 9,
      year: 2026,
      totalBudget: 100000,
      warningThreshold1: 75,
      warningThreshold2: 90,
      categoryBudgets: {
        food: 20000,
        transport: 10000,
        health: 8000,
        education: 15000,
        utilities: 12000,
        housing: 25000,
        entertainment: 5000,
        shopping: 10000,
      },
    },
    {
      id: 'bgt_2026_8',
      month: 8,
      year: 2026,
      totalBudget: 95000,
      warningThreshold1: 75,
      warningThreshold2: 90,
      categoryBudgets: {
        food: 18000,
        transport: 9000,
        health: 7000,
        education: 15000,
        utilities: 11000,
        housing: 25000,
      },
    },
  ];

  const savings: SavingsGoal[] = [
    {
      id: 'sav_1',
      name: 'New Laptop',
      targetAmount: 150000,
      currentAmount: 65000,
      targetDate: '2026-12-31',
      notes: 'MacBook Air or ThinkPad for remote development work',
      icon: 'Laptop',
      color: '#3B82F6',
      createdAt: '2026-07-15T10:00:00Z',
    },
    {
      id: 'sav_2',
      name: 'Emergency Fund',
      targetAmount: 300000,
      currentAmount: 140000,
      targetDate: '2027-03-31',
      notes: '3 months of essential living expenses reserve',
      icon: 'Shield',
      color: '#10B981',
      createdAt: '2026-06-01T10:00:00Z',
    },
    {
      id: 'sav_3',
      name: 'Family Vacation',
      targetAmount: 80000,
      currentAmount: 35000,
      targetDate: '2026-11-15',
      notes: 'Northern trip with family',
      icon: 'Plane',
      color: '#F59E0B',
      createdAt: '2026-08-10T12:00:00Z',
    },
  ];

  const creditDebit: CreditDebit[] = [
    {
      id: 'cd_1',
      person: 'Kamran Ali (Design Client)',
      amount: 45000,
      paidAmount: 20000,
      type: 'credit', // Kamran owes us
      date: '2026-09-05',
      dueDate: '2026-09-25',
      description: 'UI/UX Mobile redesign milestone 2',
      status: 'partially_paid',
      notes: 'Second installment expected next Friday',
    },
    {
      id: 'cd_2',
      person: 'Usman Farooq',
      amount: 12000,
      paidAmount: 0,
      type: 'debit', // We owe Usman
      date: '2026-09-12',
      dueDate: '2026-09-30',
      description: 'Shared group trip resort booking',
      status: 'pending',
      notes: 'To be settled via Bank Transfer',
    },
  ];

  const loans: Loan[] = [
    {
      id: 'loan_1',
      name: 'Car Financing Loan',
      lender: 'Standard Chartered Bank',
      principalAmount: 500000,
      paidAmount: 150000,
      interestRate: 12.5,
      installmentAmount: 22000,
      frequency: 'monthly',
      startDate: '2025-10-01',
      dueDate: '2027-10-01',
      status: 'active',
      notes: 'Monthly auto-debit on 5th of each month',
    },
  ];

  const transactions: Transaction[] = [
    // September 2026 Transactions
    {
      id: 'tx_sep_01',
      type: 'income',
      amount: 180000,
      currency: 'PKR',
      categoryId: 'income_general',
      subcategoryId: 'Salary',
      description: 'September Monthly Salary credited',
      merchant: 'Techcorp Global',
      paymentMethod: 'Bank Transfer',
      date: '2026-09-01',
      time: '09:15',
      notes: 'Direct deposit',
      createdAt: '2026-09-01T09:15:00Z',
      updatedAt: '2026-09-01T09:15:00Z',
    },
    {
      id: 'tx_sep_02',
      type: 'expense',
      amount: 25000,
      currency: 'PKR',
      categoryId: 'housing',
      subcategoryId: 'Rent',
      description: 'Apartment monthly rent payment',
      merchant: 'Landlord Property',
      paymentMethod: 'Bank Transfer',
      date: '2026-09-02',
      time: '11:30',
      notes: 'September residential lease',
      createdAt: '2026-09-02T11:30:00Z',
      updatedAt: '2026-09-02T11:30:00Z',
    },
    {
      id: 'tx_sep_03',
      type: 'expense',
      amount: 22000,
      currency: 'PKR',
      categoryId: 'financial',
      subcategoryId: 'Loan Repayment',
      description: 'Car financing monthly installment',
      merchant: 'Standard Chartered',
      paymentMethod: 'Bank',
      date: '2026-09-05',
      time: '10:00',
      notes: 'September installment for loan #loan_1',
      createdAt: '2026-09-05T10:00:00Z',
      updatedAt: '2026-09-05T10:00:00Z',
    },
    {
      id: 'tx_sep_04',
      type: 'expense',
      amount: 6800,
      currency: 'PKR',
      categoryId: 'food',
      subcategoryId: 'Groceries',
      description: 'Supermarket weekly groceries and dairy',
      merchant: 'Carrefour Hypermarket',
      paymentMethod: 'Debit Card',
      date: '2026-09-06',
      time: '18:45',
      notes: 'Rice, cooking oil, spices, fruits',
      createdAt: '2026-09-06T18:45:00Z',
      updatedAt: '2026-09-06T18:45:00Z',
    },
    {
      id: 'tx_sep_05',
      type: 'expense',
      amount: 4500,
      currency: 'PKR',
      categoryId: 'transport',
      subcategoryId: 'Fuel',
      description: 'Petrol refuel full tank',
      merchant: 'Total Parco Petrol Station',
      paymentMethod: 'Credit Card',
      date: '2026-09-08',
      time: '08:20',
      notes: 'V-Power petrol',
      createdAt: '2026-09-08T08:20:00Z',
      updatedAt: '2026-09-08T08:20:00Z',
    },
    {
      id: 'tx_sep_06',
      type: 'expense',
      amount: 8200,
      currency: 'PKR',
      categoryId: 'utilities',
      subcategoryId: 'Electricity',
      description: 'Electricity bill payment for August',
      merchant: 'IESCO Power',
      paymentMethod: 'Easypaisa',
      date: '2026-09-10',
      time: '14:10',
      notes: 'Consumer ID: 142859103',
      createdAt: '2026-09-10T14:10:00Z',
      updatedAt: '2026-09-10T14:10:00Z',
    },
    {
      id: 'tx_sep_07',
      type: 'expense',
      amount: 3200,
      currency: 'PKR',
      categoryId: 'utilities',
      subcategoryId: 'Internet',
      description: 'High-speed fiber broadband bill',
      merchant: 'Nayatel Fiber',
      paymentMethod: 'JazzCash',
      date: '2026-09-11',
      time: '16:05',
      notes: '50 Mbps unlimited',
      createdAt: '2026-09-11T16:05:00Z',
      updatedAt: '2026-09-11T16:05:00Z',
    },
    {
      id: 'tx_sep_08',
      type: 'savings',
      amount: 15000,
      currency: 'PKR',
      categoryId: 'financial',
      subcategoryId: 'Savings',
      description: 'Deposit towards New Laptop goal',
      merchant: 'Savings Account',
      paymentMethod: 'Bank Transfer',
      date: '2026-09-12',
      time: '12:00',
      notes: 'Automated goal contribution',
      createdAt: '2026-09-12T12:00:00Z',
      updatedAt: '2026-09-12T12:00:00Z',
    },
    {
      id: 'tx_sep_09',
      type: 'expense',
      amount: 2800,
      currency: 'PKR',
      categoryId: 'health',
      subcategoryId: 'Medicine',
      description: 'Prescription multivitamins and allergy pills',
      merchant: 'D-Watson Chemist',
      paymentMethod: 'Cash',
      date: '2026-09-14',
      time: '19:30',
      notes: 'Allergy relief tablets',
      createdAt: '2026-09-14T19:30:00Z',
      updatedAt: '2026-09-14T19:30:00Z',
    },
    {
      id: 'tx_sep_10',
      type: 'expense',
      amount: 2100,
      currency: 'PKR',
      categoryId: 'food',
      subcategoryId: 'Restaurants',
      description: 'Team lunch at Italian Bistro',
      merchant: 'Cafe Aylanto',
      paymentMethod: 'Debit Card',
      date: '2026-09-16',
      time: '13:40',
      notes: 'Woodfire pasta & cappuccino',
      createdAt: '2026-09-16T13:40:00Z',
      updatedAt: '2026-09-16T13:40:00Z',
    },
    {
      id: 'tx_sep_11',
      type: 'expense',
      amount: 1500,
      currency: 'PKR',
      categoryId: 'entertainment',
      subcategoryId: 'Streaming',
      description: 'Netflix 4K Premium monthly subscription',
      merchant: 'Netflix Inc',
      paymentMethod: 'Credit Card',
      date: '2026-09-17',
      time: '08:42',
      notes: 'Family profile subscription',
      createdAt: '2026-09-17T08:42:00Z',
      updatedAt: '2026-09-17T08:42:00Z',
    },

    // August 2026 Historical Transactions (for accurate comparison!)
    {
      id: 'tx_aug_01',
      type: 'income',
      amount: 175000,
      currency: 'PKR',
      categoryId: 'income_general',
      subcategoryId: 'Salary',
      description: 'August Monthly Salary',
      merchant: 'Techcorp Global',
      paymentMethod: 'Bank Transfer',
      date: '2026-08-01',
      time: '09:00',
      createdAt: '2026-08-01T09:00:00Z',
      updatedAt: '2026-08-01T09:00:00Z',
    },
    {
      id: 'tx_aug_02',
      type: 'expense',
      amount: 25000,
      currency: 'PKR',
      categoryId: 'housing',
      subcategoryId: 'Rent',
      description: 'August rent',
      merchant: 'Landlord Property',
      paymentMethod: 'Bank Transfer',
      date: '2026-08-02',
      time: '10:00',
      createdAt: '2026-08-02T10:00:00Z',
      updatedAt: '2026-08-02T10:00:00Z',
    },
    {
      id: 'tx_aug_03',
      type: 'expense',
      amount: 16500,
      currency: 'PKR',
      categoryId: 'food',
      subcategoryId: 'Groceries',
      description: 'August monthly food & grocery supply',
      merchant: 'Carrefour Hypermarket',
      paymentMethod: 'Debit Card',
      date: '2026-08-05',
      time: '17:00',
      createdAt: '2026-08-05T17:00:00Z',
      updatedAt: '2026-08-05T17:00:00Z',
    },
    {
      id: 'tx_aug_04',
      type: 'expense',
      amount: 8500,
      currency: 'PKR',
      categoryId: 'transport',
      subcategoryId: 'Fuel',
      description: 'August petrol refills',
      merchant: 'Total Parco',
      paymentMethod: 'Credit Card',
      date: '2026-08-14',
      time: '11:00',
      createdAt: '2026-08-14T11:00:00Z',
      updatedAt: '2026-08-14T11:00:00Z',
    },
    {
      id: 'tx_aug_05',
      type: 'expense',
      amount: 11000,
      currency: 'PKR',
      categoryId: 'utilities',
      subcategoryId: 'Electricity',
      description: 'July electricity bill',
      merchant: 'IESCO Power',
      paymentMethod: 'Easypaisa',
      date: '2026-08-10',
      time: '12:00',
      createdAt: '2026-08-10T12:00:00Z',
      updatedAt: '2026-08-10T12:00:00Z',
    },
    {
      id: 'tx_aug_06',
      type: 'savings',
      amount: 20000,
      currency: 'PKR',
      categoryId: 'financial',
      subcategoryId: 'Savings',
      description: 'August savings contribution',
      merchant: 'Bank Account',
      paymentMethod: 'Bank Transfer',
      date: '2026-08-15',
      time: '10:00',
      createdAt: '2026-08-15T10:00:00Z',
      updatedAt: '2026-08-15T10:00:00Z',
    },
  ];

  return {
    profile,
    categories: DEFAULT_CATEGORIES,
    budgets,
    transactions,
    savings,
    creditDebit,
    loans,
  };
}

export class StorageService {
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read profile', e);
    }
    const seed = getInitialSeedData();
    this.saveProfile(seed.profile);
    return seed.profile;
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }

  static getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read transactions', e);
    }
    const seed = getInitialSeedData();
    this.saveTransactions(seed.transactions);
    return seed.transactions;
  }

  static saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions', e);
    }
  }

  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read categories', e);
    }
    const seed = getInitialSeedData();
    this.saveCategories(seed.categories);
    return seed.categories;
  }

  static saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }

  static getBudgets(): Budget[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read budgets', e);
    }
    const seed = getInitialSeedData();
    this.saveBudgets(seed.budgets);
    return seed.budgets;
  }

  static saveBudgets(budgets: Budget[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed to save budgets', e);
    }
  }

  static getSavings(): SavingsGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read savings', e);
    }
    const seed = getInitialSeedData();
    this.saveSavings(seed.savings);
    return seed.savings;
  }

  static saveSavings(savings: SavingsGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(savings));
    } catch (e) {
      console.error('Failed to save savings', e);
    }
  }

  static getCreditDebit(): CreditDebit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CREDIT_DEBIT);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read credit/debit', e);
    }
    const seed = getInitialSeedData();
    this.saveCreditDebit(seed.creditDebit);
    return seed.creditDebit;
  }

  static saveCreditDebit(entries: CreditDebit[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CREDIT_DEBIT, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save credit/debit', e);
    }
  }

  static getLoans(): Loan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOANS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read loans', e);
    }
    const seed = getInitialSeedData();
    this.saveLoans(seed.loans);
    return seed.loans;
  }

  static saveLoans(loans: Loan[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
    } catch (e) {
      console.error('Failed to save loans', e);
    }
  }

  static exportFullBackupJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      categories: this.getCategories(),
      budgets: this.getBudgets(),
      transactions: this.getTransactions(),
      savings: this.getSavings(),
      creditDebit: this.getCreditDebit(),
      loans: this.getLoans(),
    };
    return JSON.stringify(backup, null, 2);
  }

  static importFullBackupJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.transactions && Array.isArray(data.transactions)) {
        this.saveTransactions(data.transactions);
      }
      if (data.categories && Array.isArray(data.categories)) {
        this.saveCategories(data.categories);
      }
      if (data.budgets && Array.isArray(data.budgets)) {
        this.saveBudgets(data.budgets);
      }
      if (data.savings && Array.isArray(data.savings)) {
        this.saveSavings(data.savings);
      }
      if (data.creditDebit && Array.isArray(data.creditDebit)) {
        this.saveCreditDebit(data.creditDebit);
      }
      if (data.loans && Array.isArray(data.loans)) {
        this.saveLoans(data.loans);
      }
      if (data.profile) {
        this.saveProfile(data.profile);
      }
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  }

  static resetToDemoData(): void {
    const seed = getInitialSeedData();
    this.saveProfile(seed.profile);
    this.saveCategories(seed.categories);
    this.saveBudgets(seed.budgets);
    this.saveTransactions(seed.transactions);
    this.saveSavings(seed.savings);
    this.saveCreditDebit(seed.creditDebit);
    this.saveLoans(seed.loans);
  }

  static clearAll(): void {
    localStorage.clear();
  }
}
