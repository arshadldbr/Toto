import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Category } from '../types';
import { CategoryIcon } from '../utils/categoryIcons';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  FolderPlus,
  Layers,
  Sparkles,
} from 'lucide-react';

export const CategoriesManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState('#10B981');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubInput, setNewSubInput] = useState('');

  const availableIcons = [
    'Utensils', 'Car', 'Home', 'Zap', 'HeartPulse', 'GraduationCap',
    'Tv', 'ShoppingBag', 'Smile', 'CreditCard', 'PiggyBank', 'DollarSign',
    'Briefcase', 'TrendingUp', 'Laptop', 'Receipt', 'Coffee', 'Plane', 'Folder'
  ];

  const availableColors = [
    '#F97316', '#3B82F6', '#6366F1', '#EAB308', '#EC4899', '#8B5CF6',
    '#F43F5E', '#14B8A6', '#10B981', '#64748B', '#0EA5E9', '#84CC16',
  ];

  const openNewCategory = () => {
    setName('');
    setType(activeTab);
    setIcon('Tag');
    setColor('#10B981');
    setSubcategories([]);
    setNewSubInput('');
    setEditingCategory(null);
    setIsNewCategoryOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type || (cat.id.startsWith('income') ? 'income' : 'expense'));
    setIcon(cat.icon);
    setColor(cat.color || '#10B981');
    setSubcategories(cat.subcategories || []);
    setNewSubInput('');
    setIsNewCategoryOpen(true);
  };

  const handleAddSubcategory = () => {
    if (newSubInput.trim() && !subcategories.includes(newSubInput.trim())) {
      setSubcategories([...subcategories, newSubInput.trim()]);
      setNewSubInput('');
    }
  };

  const handleRemoveSubcategory = (sub: string) => {
    setSubcategories(subcategories.filter((s) => s !== sub));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        type,
        icon,
        color,
        subcategories,
      });
    } else {
      addCategory({
        name: name.trim(),
        type,
        icon,
        color,
        subcategories,
      });
    }

    setIsNewCategoryOpen(false);
  };

  const isCatIncome = (c: Category) => c.type === 'income' || c.id.startsWith('income');
  const filteredCategories = categories.filter((c) =>
    activeTab === 'income' ? isCatIncome(c) : !isCatIncome(c)
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Customize icons, colors, and subcategories for accurate classification
          </p>
        </div>

        <button
          id="categories-new-btn"
          onClick={openNewCategory}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Tabs (Expense / Income) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('expense')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'expense'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Expense Categories ({categories.filter((c) => !isCatIncome(c)).length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'income'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Income Sources ({categories.filter((c) => isCatIncome(c)).length})
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            id={`category-card-${cat.id}`}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                    }}
                  >
                    <CategoryIcon name={cat.icon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      {cat.subcategories?.length || 0} subcategories
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories list */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {cat.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isNewCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button
                onClick={() => setIsNewCategoryOpen(false)}
                className="p-1 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gym & Fitness, Groceries, Client Fees"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      type === 'expense'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      type === 'income'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl max-h-36 overflow-y-auto">
                  {availableIcons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                        icon === ic
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <CategoryIcon name={ic} size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subcategories
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add subcategory (e.g. Fuel, Dining)"
                    value={newSubInput}
                    onChange={(e) => setNewSubInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcategory(sub)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
