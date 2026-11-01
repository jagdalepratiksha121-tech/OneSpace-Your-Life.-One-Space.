import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowUpRight,
  Sparkles,
  PieChart
} from 'lucide-react';
import {
  WeeklyProductivityChart,
  ExpenseDonutChart,
  IncomeVsExpenseChart,
  CircularProgressRing
} from '../common/Charts';

export const AnalyticsView: React.FC = () => {
  const {
    tasks,
    goals,
    habits,
    focusSessions,
    transactions,
    savings,
    user
  } = useApp();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Dynamic calculations from real user data
  const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  const completedTasks = tasks.filter(t => t.completed).length;
  const taskRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Dynamic expense categories
  const categoriesMap: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoriesMap[t.category] = (categoriesMap[t.category] || 0) + t.amount;
    });

  const categoryColors: Record<string, string> = {
    'Food & Dining': '#F97316',
    Transport: '#3B82F6',
    Shopping: '#8B5CF6',
    Bills: '#EA580C',
    Health: '#10B981',
    Education: '#0284C7',
    Entertainment: '#D97706',
    Others: '#64748B'
  };

  const expenseCategories = Object.keys(categoriesMap).map(cat => {
    const amount = categoriesMap[cat];
    const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
    return {
      category: cat,
      amount,
      percent,
      color: categoryColors[cat] || '#F97316'
    };
  });

  // Habit consistency calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const habitConsistency = habits.length > 0
    ? Math.round((habits.filter(h => !!h.history[todayStr]).length / habits.length) * 100)
    : 0;

  // Savings allocation rate
  const savingsAllocation = savings.targetAmount > 0
    ? Math.min(100, Math.round((savings.currentAmount / savings.targetAmount) * 100))
    : 0;

  const hasAnyActivity = tasks.length > 0 || goals.length > 0 || habits.length > 0 || focusSessions.length > 0 || transactions.length > 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Personal Analytics Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Grounded data-driven insights across tasks, focus hours, goals, and savings.
          </p>
        </div>

        {/* Date range filter */}
        <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold">
          {(['7d', '30d', '90d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateRange === range
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last Quarter'}
            </button>
          ))}
        </div>
      </div>

      {!hasAnyActivity && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 text-center">
          <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Your progress will appear here as you start using OneSpace.
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            As you check off tasks, log focus sessions, track habits, and record transactions, your personal analytics will automatically generate here.
          </p>
        </div>
      )}

      {/* Top 4 KPI metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Task Velocity (Blue) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Task Velocity</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {taskRate}%
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">
            {completedTasks} of {tasks.length} tasks executed
          </p>
        </div>

        {/* Deep Work Logged (Teal/Green) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Deep Work Logged</span>
            <Clock className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalFocusHours} hrs
          </div>
          <p className="text-[11px] text-teal-600 font-medium mt-1">
            Across {focusSessions.length} recorded Pomodoro sprints
          </p>
        </div>

        {/* Habit Adherence (Orange/Amber) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Habit Adherence</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {habitConsistency}%
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            {habits.length > 0 ? `${habits.filter(h => !!h.history[todayStr]).length} of ${habits.length} checked today` : 'No habits tracked'}
          </p>
        </div>

        {/* Savings Allocation (Green/Teal) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Savings Allocation</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {savingsAllocation}%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {user.currencySymbol}{savings.currentAmount.toLocaleString()} accumulated
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            Weekly Execution Distribution (Tasks vs Focus vs Goals)
          </h3>
          <WeeklyProductivityChart />
        </div>

        {/* Income vs Expenses Spline */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            6-Month Cash Flow & Spend Ratio
          </h3>
          <div className="py-2">
            <IncomeVsExpenseChart currencySymbol={user.currencySymbol} />
          </div>
        </div>
      </div>

      {/* Bottom Breakdown: Category Donut & Goal Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            Monthly Expense Distribution
          </h3>
          <ExpenseDonutChart
            totalAmount={totalExpense}
            currencySymbol={user.currencySymbol}
            categories={expenseCategories}
          />
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            Goal Milestone Completion Rates
          </h3>
          {goals.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No goals set. Add goals with milestones to see completion analytics.
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map(g => {
                const comp = g.milestones.filter(m => m.completed).length;
                const total = g.milestones.length || 1;
                const pct = Math.round((comp / total) * 100);

                return (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{g.title}</span>
                      <span className="font-mono text-slate-500 font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: g.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
