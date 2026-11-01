import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Plus,
  Trash2,
  Calendar,
  Check,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

export const HabitsView: React.FC = () => {
  const { habits, toggleHabitDay, addHabit, deleteHabit } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Health');
  const [showAddForm, setShowAddForm] = useState(false);

  // Generate last 28 days for monthly heatmap based on current date
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (27 - i));
    return d.toISOString().split('T')[0];
  });

  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Mon=0, Sun=6
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);

  const daysLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDays = daysLabels.map((label, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    return { label, date: d.toISOString().split('T')[0] };
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addHabit({
      title: newTitle.trim(),
      category: newCategory,
      frequency: 'daily',
      color: '#10B981'
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;
  const completedToday = habits.filter(h => !!h.history[todayStr]).length;
  const consistencyRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Habit & Routine Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build compounding consistency through daily check-ins and visual streak heatmaps.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Current Best Streak</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {maxStreak} Days Active
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Today's Consistency</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {consistencyRate}% {habits.length > 0 ? `(${completedToday}/${habits.length})` : 'Maintained'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Active Habits Tracked</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {habits.length} Daily Routines
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-3"
        >
          <input
            type="text"
            required
            placeholder="Habit title (e.g. Read 20 mins, Cold shower, Meditate)"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="flex-1 min-w-[240px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
          />

          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
          >
            <option value="Health">Health</option>
            <option value="Mindset">Mindset</option>
            <option value="Focus">Focus</option>
            <option value="Fitness">Fitness</option>
            <option value="Productivity">Productivity</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Create Routine
          </button>
        </form>
      )}

      {/* Weekly Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          Weekly Check-In Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <th className="text-left font-semibold pb-3 w-56">Habit & Category</th>
                <th className="text-center font-semibold pb-3 w-24">Current Streak</th>
                {weekDays.map(d => (
                  <th key={d.label} className="text-center font-semibold pb-3 px-2">
                    <div>{d.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">
                      {d.date.slice(8)}
                    </div>
                  </th>
                ))}
                <th className="text-right font-semibold pb-3 pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {habits.length === 0 ? (
                <tr>
                  <td colSpan={weekDays.length + 3} className="py-10 text-center">
                    <Flame className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      No habits tracked yet. Create your first daily routine.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                      Start building compounding habits with streak tracking.
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Habit</span>
                    </button>
                  </td>
                </tr>
              ) : (
                habits.map(habit => (
                  <tr key={habit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        {habit.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {habit.category} · Best: {habit.bestStreak}d
                      </div>
                    </td>

                    <td className="py-3.5 text-center font-mono font-bold text-amber-500">
                      🔥 {habit.streak}d
                    </td>

                    {weekDays.map(d => {
                      const isDone = !!habit.history[d.date];
                      return (
                        <td key={d.date} className="py-3.5 text-center px-2">
                          <button
                            onClick={() => toggleHabitDay(habit.id, d.date)}
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500 text-white shadow-xs scale-105 ring-2 ring-emerald-200 dark:ring-emerald-950'
                                : 'bg-slate-100 dark:bg-slate-800 text-transparent hover:bg-slate-200'
                            }`}
                            title={`Toggle ${habit.title} for ${d.label}`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Delete Habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 28-Day Consistency Heatmap Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            28-Day Habit Heatmap Matrix
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-200" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5">
          {heatmapDays.map((dateStr, idx) => {
            // Count completed across all habits on this date
            const count = habits.filter(h => !!h.history[dateStr]).length;
            const intensity = count === 0 ? 'bg-slate-100 dark:bg-slate-800' : count <= 2 ? 'bg-emerald-300' : count <= 4 ? 'bg-emerald-500' : 'bg-emerald-600';

            return (
              <div
                key={dateStr}
                className={`h-7 rounded-md flex items-center justify-center text-[10px] font-mono font-medium transition-transform hover:scale-110 cursor-pointer ${intensity} ${
                  count > 0 ? 'text-white' : 'text-slate-400'
                }`}
                title={`${dateStr}: ${count} habits completed`}
              >
                {dateStr.slice(8)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
