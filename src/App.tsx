/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { TransactionsList } from './components/TransactionsList';
import { BudgetView } from './components/BudgetView';
import { SavingsView } from './components/SavingsView';
import { CreditDebitView } from './components/CreditDebitView';
import { LoansView } from './components/LoansView';
import { ReportsAnalyticsView } from './components/ReportsAnalyticsView';
import { CalendarView } from './components/CalendarView';
import { CategoriesManager } from './components/CategoriesManager';
import { SettingsView } from './components/SettingsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { ReceiptViewerModal } from './components/ReceiptViewerModal';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  PiggyBank,
  CreditCard,
  Building,
  BarChart3,
  Calendar,
  Layers,
  Settings,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useFinance();

  const desktopNavTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'savings', label: 'Savings', icon: PiggyBank },
    { id: 'credit_debit', label: 'Credit/Debit', icon: CreditCard },
    { id: 'loans', label: 'Loans', icon: Building },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header />

      {/* Desktop Navigation Ribbon */}
      <div className="hidden lg:block border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
          {desktopNavTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`desktop-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && <TransactionsList />}
        {activeTab === 'budget' && <BudgetView />}
        {activeTab === 'savings' && <SavingsView />}
        {activeTab === 'credit_debit' && <CreditDebitView />}
        {activeTab === 'loans' && <LoansView />}
        {activeTab === 'reports' && <ReportsAnalyticsView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'categories' && <CategoriesManager />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Modals */}
      <AddTransactionModal />
      <ReceiptViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
