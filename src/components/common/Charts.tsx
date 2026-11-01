import React, { useState } from 'react';

// 1. Clean Circular Progress Ring
interface CircularProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  centerText?: string;
  subText?: string;
  showPercent?: boolean;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  progress,
  size = 64,
  strokeWidth = 6,
  color = '#8B5CF6',
  trackColor = '#F3F4F6',
  centerText,
  subText,
  showPercent = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="dark:stroke-gray-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {centerText ? (
          <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 font-mono tabular-nums leading-none">
            {centerText}
          </span>
        ) : showPercent ? (
          <span className="text-xs font-bold text-gray-900 dark:text-gray-100 font-mono tabular-nums leading-none">
            {Math.round(clamped)}%
          </span>
        ) : null}
        {subText && (
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-none">
            {subText}
          </span>
        )}
      </div>
    </div>
  );
};

import { useApp } from '../../context/AppContext';

// 2. Simple, Beautiful Weekly Progress Graph
// Blue for tasks, Purple for goals, Green for completed focus/activities
export const WeeklyProductivityChart: React.FC = () => {
  const { tasks, goals, focusSessions } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Generate current week days Mon-Sun
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Mon=0, Sun=6
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);

  const daysLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weekData = daysLabels.map((label, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateStr = d.toISOString().split('T')[0];

    const tasksCount = tasks.filter(t => t.completed && (t.dueDate === dateStr || t.createdAt?.startsWith(dateStr))).length;
    const goalsCount = goals.filter(g => g.milestones.some(m => m.completed)).length;
    const focusMinutes = focusSessions
      .filter(s => s.completedAt?.startsWith(dateStr))
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    const focusHours = Math.round((focusMinutes / 60) * 10) / 10;

    return {
      day: label,
      date: dateStr,
      tasks: tasksCount,
      goals: goalsCount,
      focus: focusHours
    };
  });

  const totalActivity = weekData.reduce((sum, item) => sum + item.tasks + item.goals + item.focus, 0);
  const maxVal = Math.max(5, ...weekData.map(d => Math.max(d.tasks, d.goals, d.focus)));
  const chartHeight = 140;

  return (
    <div className="w-full">
      <div className="relative flex items-end justify-between gap-2 pt-6 pb-2" style={{ height: chartHeight }}>
        {/* Subtle horizontal baseline & mid-line */}
        <div className="absolute inset-x-0 top-6 border-b border-gray-100 dark:border-gray-800" />
        <div className="absolute inset-x-0 top-1/2 border-b border-gray-100 dark:border-gray-800" />
        <div className="absolute inset-x-0 bottom-6 border-b border-gray-200 dark:border-gray-700" />

        {totalActivity === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none bg-white/75 dark:bg-gray-900/75 rounded-lg px-4 text-center">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Your progress will appear here as you start using OneSpace.
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">
              Complete tasks or track focus sessions to populate your weekly chart.
            </span>
          </div>
        )}

        {weekData.map((item, idx) => {
          const tasksH = maxVal > 0 ? (item.tasks / maxVal) * 95 : 0;
          const goalsH = maxVal > 0 ? (item.goals / maxVal) * 95 : 0;
          const focusH = maxVal > 0 ? (item.focus / maxVal) * 95 : 0;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.day}
              className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer z-10"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && totalActivity > 0 && (
                <div className="absolute -top-10 bg-gray-900 text-white text-[11px] py-1 px-2.5 rounded-md shadow-lg z-30 whitespace-nowrap pointer-events-none">
                  <span className="font-semibold">{item.day}: </span>
                  <span className="text-blue-300">Tasks {item.tasks}</span> ·{' '}
                  <span className="text-purple-300">Goals {item.goals}</span> ·{' '}
                  <span className="text-emerald-300">Focus {item.focus}h</span>
                </div>
              )}

              {/* 3 Simple Minimal Bars: Tasks (Blue), Goals (Purple), Completed Focus (Green) */}
              <div className="flex items-end gap-1 mb-2">
                <div
                  style={{ height: `${Math.max(item.tasks > 0 ? tasksH : 3, 3)}px` }}
                  className={`w-2 sm:w-2.5 rounded-t-xs transition-all duration-200 ${
                    item.tasks > 0 ? 'bg-blue-500 group-hover:brightness-110' : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                />
                <div
                  style={{ height: `${Math.max(item.goals > 0 ? goalsH : 3, 3)}px` }}
                  className={`w-2 sm:w-2.5 rounded-t-xs transition-all duration-200 ${
                    item.goals > 0 ? 'bg-purple-500 group-hover:brightness-110' : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                />
                <div
                  style={{ height: `${Math.max(item.focus > 0 ? focusH : 3, 3)}px` }}
                  className={`w-2 sm:w-2.5 rounded-t-xs transition-all duration-200 ${
                    item.focus > 0 ? 'bg-emerald-500 group-hover:brightness-110' : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                />
              </div>

              {/* Day label */}
              <span className={`text-[11px] font-medium transition-colors ${
                isHovered ? 'text-gray-900 dark:text-gray-100 font-semibold' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-blue-500" />
          <span>Tasks (Blue)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-purple-500" />
          <span>Goals (Purple)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-emerald-500" />
          <span>Completed Focus (Green)</span>
        </div>
      </div>
    </div>
  );
};

// 3. Simple Expense Donut Chart (Orange & Accent Colors)
interface ExpenseCategoryData {
  category: string;
  amount: number;
  percent: number;
  color: string;
}

interface ExpenseDonutChartProps {
  totalAmount: number;
  currencySymbol: string;
  categories: ExpenseCategoryData[];
}

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({
  totalAmount,
  currencySymbol,
  categories
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (totalAmount === 0 || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center mb-2">
          <span className="text-xs font-mono text-gray-400">{currencySymbol}0</span>
        </div>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          No expenses recorded. Add your first transaction.
        </p>
        <span className="text-[11px] text-gray-400 mt-0.5">
          Your spending breakdown will appear here.
        </span>
      </div>
    );
  }

  const size = 140;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const slices = categories.map(cat => {
    const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += cat.percent;
    return { ...cat, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {slices.map(slice => {
            const isHovered = activeCategory === slice.category;
            return (
              <circle
                key={slice.category}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                fill="transparent"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setActiveCategory(slice.category)}
                onMouseLeave={() => setActiveCategory(null)}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono tabular-nums leading-tight">
            {currencySymbol}{totalAmount.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
            Total Spent
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-1.5 text-xs">
        {categories.map(cat => (
          <div
            key={cat.category}
            className={`flex items-center justify-between p-1 rounded-md transition-colors cursor-pointer ${
              activeCategory === cat.category ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
            }`}
            onMouseEnter={() => setActiveCategory(cat.category)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-gray-700 dark:text-gray-300 truncate">{cat.category}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums">
              <span className="text-gray-400 text-[11px]">{cat.percent}%</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {currencySymbol}{cat.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Clean Income vs Expense Trend (Dynamically calculated from real transactions)
export const IncomeVsExpenseChart: React.FC<{ currencySymbol: string }> = ({ currencySymbol }) => {
  const { transactions } = useApp();

  // Group by past 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const past6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      monthKey: mKey,
      label: monthNames[d.getMonth()],
      income: 0,
      expense: 0
    };
  });

  transactions.forEach(t => {
    const tMonthKey = t.date?.slice(0, 7);
    const found = past6Months.find(m => m.monthKey === tMonthKey);
    if (found) {
      if (t.type === 'income') found.income += t.amount;
      else if (t.type === 'expense') found.expense += t.amount;
    }
  });

  const totalTransacted = past6Months.reduce((sum, m) => sum + m.income + m.expense, 0);

  if (totalTransacted === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          No financial transactions recorded yet.
        </p>
        <span className="text-[11px] text-gray-400 mt-0.5">
          Add income or expense transactions to visualize your cash flow trends.
        </span>
      </div>
    );
  }

  const maxVal = Math.max(1000, ...past6Months.map(d => Math.max(d.income, d.expense)));
  const width = 360;
  const height = 90;
  const paddingX = 20;
  const paddingY = 15;

  const pointsIncome = past6Months.map((d, i) => {
    const x = paddingX + (i / (past6Months.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.income / maxVal) * (height - 2 * paddingY);
    return `${x},${y}`;
  }).join(' ');

  const pointsExpense = past6Months.map((d, i) => {
    const x = paddingX + (i / (past6Months.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.expense / maxVal) * (height - 2 * paddingY);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      <div className="relative w-full h-[90px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <line x1="10" y1="20" x2={width - 10} y2="20" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="10" y1="50" x2={width - 10} y2="50" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />

          {/* Income line (Green) */}
          <polyline fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pointsIncome} />

          {/* Expense line (Orange) */}
          <polyline fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pointsExpense} />

          {past6Months.map((d, i) => {
            const x = paddingX + (i / (past6Months.length - 1)) * (width - 2 * paddingX);
            const yInc = height - paddingY - (d.income / maxVal) * (height - 2 * paddingY);
            const yExp = height - paddingY - (d.expense / maxVal) * (height - 2 * paddingY);
            return (
              <g key={d.label}>
                <circle cx={x} cy={yInc} r="2.5" fill="#10B981" />
                <circle cx={x} cy={yExp} r="2.5" fill="#F97316" />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between px-2 mt-1 text-[10px] text-gray-400 font-medium">
        {past6Months.map(d => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Income (Green)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span>Expenses (Orange)</span>
        </div>
      </div>
    </div>
  );
};
