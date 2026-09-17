import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Calendar,
  Wallet,
  Coins,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Header: React.FC = () => {
  const {
    profile,
    selectedYear,
    selectedMonth,
    prevMonth,
    nextMonth,
    goToCurrentMonth,
    updateProfile,
    setActiveTab,
  } = useFinance();

  const isCurrentMonth = selectedYear === 2026 && selectedMonth === 9;

  const toggleTheme = () => {
    const nextTheme = profile.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Title */}
          <div
            id="header-brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                  Smart Expense
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block leading-tight">
                Finance & Budget Manager
              </p>
            </div>
          </div>

          {/* Month Switcher (Core PRD requirement) */}
          <div
            id="header-month-switcher"
            className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200 dark:border-slate-700/60"
          >
            <button
              id="header-prev-month-btn"
              onClick={prevMonth}
              title="Previous Month"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="header-current-month-display"
              onClick={goToCurrentMonth}
              title="Click to reset to current month (Sep 2026)"
              className="px-2.5 py-1 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</span>
              {!isCurrentMonth && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Not current month" />
              )}
            </button>

            <button
              id="header-next-month-btn"
              onClick={nextMonth}
              title="Next Month"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Currency Pill */}
            <button
              id="header-currency-pill"
              onClick={() => setActiveTab('settings')}
              title="Change Currency in Settings"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{profile.defaultCurrency}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="header-theme-toggle-btn"
              onClick={toggleTheme}
              title={profile.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              {profile.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Profile Avatar / Settings */}
            <button
              id="header-profile-avatar-btn"
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="User Settings"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden md:block max-w-[90px] truncate">
                {profile.name || 'User'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
