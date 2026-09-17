import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'Utensils',
    color: '#F97316', // Orange
    isDefault: true,
    subcategories: ['Groceries', 'Restaurants', 'Fast Food', 'Tea/Coffee', 'Other Food'],
  },
  {
    id: 'transport',
    name: 'Transportation',
    icon: 'Car',
    color: '#3B82F6', // Blue
    isDefault: true,
    subcategories: ['Fuel', 'Public Transport', 'Taxi/Ride', 'Vehicle Maintenance', 'Parking'],
  },
  {
    id: 'health',
    name: 'Health & Medical',
    icon: 'HeartPulse',
    color: '#EF4444', // Red
    isDefault: true,
    subcategories: ['Doctor', 'Medicine', 'Hospital', 'Medical Tests', 'Health Insurance'],
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#8B5CF6', // Purple
    isDefault: true,
    subcategories: ['School/College', 'University', 'Courses', 'Books', 'Stationery'],
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'Zap',
    color: '#EAB308', // Yellow
    isDefault: true,
    subcategories: ['Electricity', 'Gas', 'Water', 'Internet', 'Mobile', 'Other Utilities'],
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: 'Home',
    color: '#06B6D4', // Cyan
    isDefault: true,
    subcategories: ['Rent', 'Maintenance', 'Furniture', 'Home Supplies'],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Film',
    color: '#EC4899', // Pink
    isDefault: true,
    subcategories: ['Movies', 'Games', 'Streaming', 'Events', 'Other Entertainment'],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#10B981', // Emerald
    isDefault: true,
    subcategories: ['Clothing', 'Electronics', 'Personal Items', 'General Shopping'],
  },
  {
    id: 'family',
    name: 'Family & Care',
    icon: 'Users',
    color: '#F43F5E', // Rose
    isDefault: true,
    subcategories: ['Children', 'Parents', 'Family Support', 'Gifts'],
  },
  {
    id: 'financial',
    name: 'Financial Expenses',
    icon: 'Receipt',
    color: '#6366F1', // Indigo
    isDefault: true,
    subcategories: ['Loan Repayment', 'Bank Fees', 'Credit Card Charges', 'Investments', 'Savings'],
  },
  {
    id: 'income_general',
    name: 'Salary & Income',
    icon: 'Wallet',
    color: '#10B981', // Green
    isDefault: true,
    subcategories: ['Salary', 'Freelance', 'Business', 'Investment Return', 'Gift Received', 'Other Income'],
  },
  {
    id: 'other',
    name: 'Other / Misc',
    icon: 'CircleDot',
    color: '#64748B', // Slate
    isDefault: true,
    subcategories: ['General', 'Uncategorized'],
  },
];
