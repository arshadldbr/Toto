import { Budget, Category, CreditDebit, Loan, SavingsGoal, Transaction } from '../types';

export interface MonthSummary {
  year: number;
  month: number; // 1-12
  totalIncome: number;
  totalExpense: number;
  netSavingsFromTx: number;
  totalCreditTracked: number;
  totalDebitTracked: number;
  totalLoanRepayments: number;
  totalLoanReceived: number;
  monthlyBudget: number;
  remainingBudget: number;
  budgetUsagePercent: number;
  categorySpending: Record<string, number>;
  categoryPercentages: Record<string, number>;
  largestCategory: { category: Category; amount: number; percentage: number } | null;
  transactionCount: number;
}

export interface OverallBalances {
  totalSavingsPool: number;
  outstandingCredit: number; // money others owe you
  outstandingDebit: number; // money you owe others
  outstandingLoans: number; // remaining loan debt
}

export interface MonthComparison {
  incomeChange: number; // percentage
  incomeDiff: number;
  expenseChange: number; // percentage
  expenseDiff: number;
  savingsChange: number; // percentage
  savingsDiff: number;
  categoryChanges: Record<string, { current: number; previous: number; diff: number; percentChange: number }>;
}

export interface FinancialInsight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
}

/**
 * Filter transactions for a given month and year
 */
export function getTransactionsForMonth(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  return transactions.filter((tx) => {
    if (!tx.date) return false;
    const parts = tx.date.split('-');
    if (parts.length < 2) return false;
    const txYear = parseInt(parts[0], 10);
    const txMonth = parseInt(parts[1], 10);
    return txYear === year && txMonth === month;
  });
}

/**
 * Calculate full monthly summary
 */
export function calculateMonthSummary(
  transactions: Transaction[],
  year: number,
  month: number,
  budget: Budget | undefined,
  categories: Category[]
): MonthSummary {
  const monthTxs = getTransactionsForMonth(transactions, year, month);

  let totalIncome = 0;
  let totalExpense = 0;
  let netSavingsFromTx = 0;
  let totalCreditTracked = 0;
  let totalDebitTracked = 0;
  let totalLoanRepayments = 0;
  let totalLoanReceived = 0;

  const categorySpending: Record<string, number> = {};

  for (const tx of monthTxs) {
    const amt = Number(tx.amount) || 0;
    switch (tx.type) {
      case 'income':
        totalIncome += amt;
        break;
      case 'expense':
        totalExpense += amt;
        categorySpending[tx.categoryId] = (categorySpending[tx.categoryId] || 0) + amt;
        break;
      case 'savings':
        netSavingsFromTx += amt;
        break;
      case 'credit':
        totalCreditTracked += amt;
        break;
      case 'debit':
        totalDebitTracked += amt;
        break;
      case 'loan_repayment':
        totalLoanRepayments += amt;
        // loan repayment is also a cash outflow expense in financial records
        totalExpense += amt;
        categorySpending['financial'] = (categorySpending['financial'] || 0) + amt;
        break;
      case 'loan_received':
        totalLoanReceived += amt;
        // loan received is cash inflow
        totalIncome += amt;
        break;
      default:
        break;
    }
  }

  const monthlyBudget = budget?.totalBudget || 0;
  const remainingBudget = monthlyBudget > 0 ? monthlyBudget - totalExpense : 0;
  const budgetUsagePercent = monthlyBudget > 0 ? Math.round((totalExpense / monthlyBudget) * 100) : 0;

  // Calculate percentages for categories
  const categoryPercentages: Record<string, number> = {};
  let largestCategory: { category: Category; amount: number; percentage: number } | null = null;

  if (totalExpense > 0) {
    for (const [catId, amt] of Object.entries(categorySpending)) {
      const pct = Math.round((amt / totalExpense) * 100);
      categoryPercentages[catId] = pct;

      if (!largestCategory || amt > largestCategory.amount) {
        const foundCat = categories.find((c) => c.id === catId);
        if (foundCat) {
          largestCategory = { category: foundCat, amount: amt, percentage: pct };
        }
      }
    }
  }

  return {
    year,
    month,
    totalIncome,
    totalExpense,
    netSavingsFromTx,
    totalCreditTracked,
    totalDebitTracked,
    totalLoanRepayments,
    totalLoanReceived,
    monthlyBudget,
    remainingBudget,
    budgetUsagePercent,
    categorySpending,
    categoryPercentages,
    largestCategory,
    transactionCount: monthTxs.length,
  };
}

/**
 * Calculate overall accumulated balances for Savings, Credit/Debit, and Loans
 */
export function calculateOverallBalances(
  savingsGoals: SavingsGoal[],
  creditDebits: CreditDebit[],
  loans: Loan[]
): OverallBalances {
  const totalSavingsPool = savingsGoals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);

  // Credit = money people owe you that remains unpaid
  const outstandingCredit = creditDebits
    .filter((cd) => cd.type === 'credit' && cd.status !== 'paid')
    .reduce((sum, cd) => sum + Math.max(0, (Number(cd.amount) || 0) - (Number(cd.paidAmount) || 0)), 0);

  // Debit = money you owe people that remains unpaid
  const outstandingDebit = creditDebits
    .filter((cd) => cd.type === 'debit' && cd.status !== 'paid')
    .reduce((sum, cd) => sum + Math.max(0, (Number(cd.amount) || 0) - (Number(cd.paidAmount) || 0)), 0);

  // Outstanding loan principal remaining
  const outstandingLoans = loans
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + Math.max(0, (Number(l.principalAmount) || 0) - (Number(l.paidAmount) || 0)), 0);

  return {
    totalSavingsPool,
    outstandingCredit,
    outstandingDebit,
    outstandingLoans,
  };
}

/**
 * Calculate month-to-month comparison
 */
export function compareMonths(
  current: MonthSummary,
  previous: MonthSummary,
  categories: Category[]
): MonthComparison {
  const calcPercent = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const incomeDiff = current.totalIncome - previous.totalIncome;
  const incomeChange = calcPercent(current.totalIncome, previous.totalIncome);

  const expenseDiff = current.totalExpense - previous.totalExpense;
  const expenseChange = calcPercent(current.totalExpense, previous.totalExpense);

  const savingsDiff = current.netSavingsFromTx - previous.netSavingsFromTx;
  const savingsChange = calcPercent(current.netSavingsFromTx, previous.netSavingsFromTx);

  const categoryChanges: Record<string, { current: number; previous: number; diff: number; percentChange: number }> = {};

  // Combine category keys from both months
  const allCatIds = Array.from(
    new Set([...Object.keys(current.categorySpending), ...Object.keys(previous.categorySpending)])
  );

  for (const catId of allCatIds) {
    const currAmt = current.categorySpending[catId] || 0;
    const prevAmt = previous.categorySpending[catId] || 0;
    categoryChanges[catId] = {
      current: currAmt,
      previous: prevAmt,
      diff: currAmt - prevAmt,
      percentChange: calcPercent(currAmt, prevAmt),
    };
  }

  return {
    incomeChange,
    incomeDiff,
    expenseChange,
    expenseDiff,
    savingsChange,
    savingsDiff,
    categoryChanges,
  };
}

/**
 * Generate Smart Dashboard Insights strictly from real data
 */
export function generateDashboardInsights(
  currentSummary: MonthSummary,
  prevSummary: MonthSummary | null,
  savingsGoals: SavingsGoal[],
  currency: string
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];

  // 1. Budget insight
  if (currentSummary.monthlyBudget > 0) {
    if (currentSummary.budgetUsagePercent >= 100) {
      insights.push({
        id: 'budget-exceeded',
        type: 'alert',
        title: 'Budget Exceeded',
        message: `You have spent ${currentSummary.budgetUsagePercent}% of your monthly budget. Expenses exceed planned limit.`,
      });
    } else if (currentSummary.budgetUsagePercent >= 90) {
      insights.push({
        id: 'budget-90',
        type: 'warning',
        title: 'Critical Budget Alert',
        message: `You have used ${currentSummary.budgetUsagePercent}% of your budget with ${(100 - currentSummary.budgetUsagePercent)}% remaining.`,
      });
    } else if (currentSummary.budgetUsagePercent >= 75) {
      insights.push({
        id: 'budget-75',
        type: 'warning',
        title: 'Budget Alert (75%)',
        message: `You have consumed ${currentSummary.budgetUsagePercent}% of your monthly budget. Watch upcoming expenses.`,
      });
    } else {
      insights.push({
        id: 'budget-healthy',
        type: 'success',
        title: 'Budget on Track',
        message: `You have ${(100 - currentSummary.budgetUsagePercent)}% of your monthly budget remaining.`,
      });
    }
  }

  // 2. Spending category insight
  if (currentSummary.largestCategory && currentSummary.totalExpense > 0) {
    insights.push({
      id: 'largest-cat',
      type: 'info',
      title: 'Top Expense Category',
      message: `${currentSummary.largestCategory.category.name} is your largest expense category (${currentSummary.largestCategory.percentage}% of spending).`,
    });
  }

  // 3. Month trend comparison
  if (prevSummary && prevSummary.totalExpense > 0 && currentSummary.totalExpense > 0) {
    const diff = currentSummary.totalExpense - prevSummary.totalExpense;
    const pct = Math.round(Math.abs(diff / prevSummary.totalExpense) * 100);
    if (diff > 0) {
      insights.push({
        id: 'trend-increase',
        type: 'warning',
        title: 'Spending Trend',
        message: `Your spending increased by ${pct}% compared to the previous month.`,
      });
    } else if (diff < 0) {
      insights.push({
        id: 'trend-decrease',
        type: 'success',
        title: 'Spending Trend',
        message: `Your spending decreased by ${pct}% compared to the previous month. Great job!`,
      });
    }
  }

  // 4. Savings goal progress insight
  if (savingsGoals.length > 0) {
    // Find highest progress goal not completed
    const activeGoals = savingsGoals.filter((g) => g.currentAmount < g.targetAmount);
    if (activeGoals.length > 0) {
      const topGoal = activeGoals.reduce((prev, curr) =>
        curr.currentAmount / curr.targetAmount > prev.currentAmount / prev.targetAmount ? curr : prev
      );
      const pct = Math.min(100, Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100));
      insights.push({
        id: 'savings-goal-progress',
        type: 'info',
        title: 'Savings Milestone',
        message: `You are ${pct}% toward your "${topGoal.name}" goal.`,
      });
    }
  }

  return insights;
}
