import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SUPPORTED_CURRENCIES, formatCurrency } from '../utils/currency';
import {
  Settings,
  DollarSign,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Shield,
  User,
  Bell,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    exportAllData,
    importAllData,
    resetData,
  } = useFinance();

  const [savedMessage, setSavedMessage] = useState('');
  const [currency, setCurrency] = useState(profile.defaultCurrency);
  const [monthlyBudget, setMonthlyBudget] = useState(profile.defaultMonthlyBudget.toString());
  const [userName, setUserName] = useState(profile.name);
  const [userEmail, setUserEmail] = useState(profile.email);
  const [budgetAlert75, setBudgetAlert75] = useState(profile.budgetAlert75);
  const [budgetAlert90, setBudgetAlert90] = useState(profile.budgetAlert90);
  const [budgetAlert100, setBudgetAlert100] = useState(profile.budgetAlert100);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(monthlyBudget);

    updateProfile({
      name: userName.trim(),
      email: userEmail ? userEmail.trim() : undefined,
      defaultCurrency: currency,
      defaultMonthlyBudget: !isNaN(budgetNum) && budgetNum > 0 ? budgetNum : 100000,
      budgetAlert75,
      budgetAlert90,
      budgetAlert100,
    });

    setSavedMessage('Preferences updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = importAllData(content);
      if (success) {
        setSavedMessage('Data imported and restored successfully!');
        setTimeout(() => setSavedMessage(''), 3000);
      } else {
        alert('Invalid backup JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReloadDemoData = () => {
    StorageService.clearAll();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Currencies, budget limits, user profile, and data backups
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-5">
        {/* User Account Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Profile & Account</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Configuration */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Currency & Budget Defaults</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Currency
              </label>
              <select
                id="settings-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
              >
                {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Preview: {formatCurrency(125000, currency)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Monthly Budget ({currency})
              </label>
              <input
                id="settings-default-budget-input"
                type="number"
                step="any"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Standard monthly ceiling used for new budget periods
              </p>
            </div>
          </div>
        </div>

        {/* Smart Alerts & Notification Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Budget Alert Thresholds</span>
          </h3>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={budgetAlert75}
                onChange={(e) => setBudgetAlert75(e.target.checked)}
                className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  75% Budget Warning
                </span>
                <p className="text-slate-400">
                  Show pacing notices when total monthly spending crosses 75%
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={budgetAlert90}
                onChange={(e) => setBudgetAlert90(e.target.checked)}
                className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  90% Critical Alert
                </span>
                <p className="text-slate-400">
                  Show prominent amber alerts when only 10% budget remains
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={budgetAlert100}
                onChange={(e) => setBudgetAlert100(e.target.checked)}
                className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  100% Exceeded Alert
                </span>
                <p className="text-slate-400">
                  Highlight overspending immediately in red across all views
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Preferences Button */}
        <div className="flex justify-end">
          <button
            id="settings-save-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-98"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Data Management & Backup */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>Data Backup & Management</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All records are securely stored locally on your device. You can download a full backup
          or reload realistic demo data at any time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export JSON */}
          <button
            id="settings-export-json-btn"
            onClick={exportAllData}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Export Backup</h4>
              <p className="text-[10px] text-slate-400">Download JSON snapshot</p>
            </div>
          </button>

          {/* Import JSON */}
          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 text-left cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Restore Backup</h4>
              <p className="text-[10px] text-slate-400">Upload JSON file</p>
            </div>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          {/* Reload Demo Data */}
          <button
            id="settings-reload-demo-btn"
            onClick={handleReloadDemoData}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Reload Seed Data</h4>
              <p className="text-[10px] text-slate-400">Reset to full demo</p>
            </div>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-600">Clear All Transactions</h4>
            <p className="text-[11px] text-slate-400">Permanently erase all transaction data</p>
          </div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
          >
            Clear Data
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Clear All Data?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                This will erase all recorded transactions, credit/debit items, and loans.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetData();
                  setIsResetConfirmOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
