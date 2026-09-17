import React, { useState } from 'react';
import { Category } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { CategoryIcon } from '../../utils/categoryIcons';

interface CategoryDonutChartProps {
  categorySpending: Record<string, number>;
  categories: Category[];
  currency: string;
  totalExpense: number;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categorySpending,
  categories,
  currency,
  totalExpense,
}) => {
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);

  const entries = Object.entries(categorySpending)
    .filter(([_, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);

  if (totalExpense <= 0 || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
          📊
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No expense data available
        </p>
        <p className="text-xs text-slate-400 max-w-xs mt-0.5">
          Record your first expense to see your category spending breakdown.
        </p>
      </div>
    );
  }

  // Calculate SVG donut paths
  const radius = 60;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const slices = entries.map(([catId, amount]) => {
    const percentage = amount / totalExpense;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += percentage * circumference;

    const cat = categories.find((c) => c.id === catId) || {
      id: catId,
      name: catId,
      color: '#64748B',
      icon: 'CircleDot',
    };

    return {
      catId,
      category: cat,
      amount,
      percentage: Math.round(percentage * 100),
      strokeDasharray,
      strokeDashoffset,
      color: cat.color || '#3B82F6',
    };
  });

  const activeSlice = hoveredCatId
    ? slices.find((s) => s.catId === hoveredCatId)
    : slices[0];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />

          {/* Slices */}
          {slices.map((slice) => {
            const isHovered = hoveredCatId === slice.catId;
            return (
              <circle
                key={slice.catId}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredCatId(slice.catId)}
                onMouseLeave={() => setHoveredCatId(null)}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
            {activeSlice ? activeSlice.category.name : 'Total'}
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {activeSlice
              ? `${activeSlice.percentage}%`
              : formatCurrency(totalExpense, currency, { compact: true })}
          </span>
          {activeSlice && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {formatCurrency(activeSlice.amount, currency, { compact: true })}
            </span>
          )}
        </div>
      </div>

      {/* Legend / Category list */}
      <div className="flex-1 w-full space-y-2 max-h-48 overflow-y-auto pr-1">
        {slices.map((slice) => {
          const isSelected = hoveredCatId === slice.catId;
          return (
            <div
              key={slice.catId}
              id={`cat-donut-legend-${slice.catId}`}
              onMouseEnter={() => setHoveredCatId(slice.catId)}
              onMouseLeave={() => setHoveredCatId(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <div className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <CategoryIcon name={slice.category.icon} size={14} />
                </div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {slice.category.name}
                </span>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatCurrency(slice.amount, currency, { compact: true })}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">
                  ({slice.percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
