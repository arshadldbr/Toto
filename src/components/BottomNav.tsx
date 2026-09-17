import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ActiveTab } from '../types';
import {
  Home,
  ArrowLeftRight,
  Plus,
  PieChart,
  MoreHorizontal,
  PiggyBank,
  CreditCard,
  Building,
  BarChart3,
  Calendar,
  Layers,
  Settings,
  X,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openAddTx, overallBalances } = useFinance();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMoreOpen]);

  const navItems: Array<{ tab: ActiveTab; label: string; icon: React.ReactElement }> = [
    { tab: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { tab: 'transactions', label: 'Transactions', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { tab: 'budget', label: 'Budget', icon: <PieChart className="w-5 h-5" /> },
  ];

  const moreItems: Array<{ tab: ActiveTab; label: string; icon: React.ReactElement; countBadge?: string }> = [
    {
      tab: 'savings',
      label: 'Savings Goals',
      icon: <PiggyBank className="w-5 h-5 text-emerald-500" />,
    },
    {
      tab: 'credit_debit',
      label: 'Credit & Debit',
      icon: <CreditCard className="w-5 h-5 text-blue-500" />,
      countBadge: overallBalances.outstandingCredit + overallBalances.outstandingDebit > 0 ? 'Active' : undefined,
    },
    {
      tab: 'loans',
      label: 'Loan Tracker',
      icon: <Building className="w-5 h-5 text-purple-500" />,
      countBadge: overallBalances.outstandingLoans > 0 ? 'Active' : undefined,
    },
    {
      tab: 'reports',
      label: 'Analytics & Reports',
      icon: <BarChart3 className="w-5 h-5 text-amber-500" />,
    },
    {
      tab: 'calendar',
      label: 'Financial Calendar',
      icon: <Calendar className="w-5 h-5 text-teal-500" />,
    },
    {
      tab: 'categories',
      label: 'Manage Categories',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
    },
    {
      tab: 'settings',
      label: 'App Settings',
      icon: <Settings className="w-5 h-5 text-slate-500" />,
    },
  ];

  const handleSelectMoreItem = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  const isMoreActive = [
    'savings',
    'credit_debit',
    'loans',
    'reports',
    'calendar',
    'categories',
    'settings',
  ].includes(activeTab);

  return (
    <>
      {/* Desktop Top/Side Navigation Ribbon (hidden on mobile, visible on lg screens) */}
      <nav className="hidden lg:block bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 py-2 overflow-x-auto">
            <button
              id="desktop-nav-home"
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'home'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              id="desktop-nav-transactions"
              onClick={() => setActiveTab('transactions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Transactions</span>
            </button>

            <button
              id="desktop-nav-budget"
              onClick={() => setActiveTab('budget')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'budget'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Budget</span>
            </button>

            <button
              id="desktop-nav-savings"
              onClick={() => setActiveTab('savings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'savings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              <span>Savings</span>
            </button>

            <button
              id="desktop-nav-credit-debit"
              onClick={() => setActiveTab('credit_debit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'credit_debit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Credit & Debit</span>
            </button>

            <button
              id="desktop-nav-loans"
              onClick={() => setActiveTab('loans')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'loans'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Loans</span>
            </button>

            <button
              id="desktop-nav-reports"
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'reports'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            <button
              id="desktop-nav-calendar"
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>

            <button
              id="desktop-nav-categories"
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'categories'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              id="desktop-nav-settings"
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="flex-1" />

            {/* Quick Add Button on Desktop */}
            <button
              id="desktop-quick-add-btn"
              onClick={() => openAddTx('expense')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2 relative">
          {/* Home */}
          <button
            id="mobile-nav-home"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1">Home</span>
          </button>

          {/* Transactions */}
          <button
            id="mobile-nav-transactions"
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'transactions'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] mt-1">History</span>
          </button>

          {/* Central Add (+) Action Button */}
          <div className="relative -top-5 flex-1 flex justify-center">
            <button
              id="mobile-nav-add-btn"
              onClick={() => openAddTx('expense')}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-transform"
              title="Add Transaction"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>

          {/* Budget */}
          <button
            id="mobile-nav-budget"
            onClick={() => setActiveTab('budget')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'budget'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] mt-1">Budget</span>
          </button>

          {/* More Menu Toggle */}
          <button
            id="mobile-nav-more"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
              isMoreActive
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-1">More</span>
            {isMoreActive && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>
      </div>

      {/* "More" Bottom Sheet Drawer for Mobile */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end">
          <div
            ref={moreRef}
            className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-base text-slate-900 dark:text-white">
                All Modules
              </span>
              <button
                id="more-menu-close-btn"
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-2">
              {moreItems.map((item) => (
                <button
                  key={item.tab}
                  id={`more-menu-item-${item.tab}`}
                  onClick={() => handleSelectMoreItem(item.tab)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all ${
                    activeTab === item.tab
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate leading-tight">{item.label}</p>
                    {item.countBadge && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                        {item.countBadge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
