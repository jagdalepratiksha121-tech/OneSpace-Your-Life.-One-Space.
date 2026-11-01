import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Trophy,
  Sparkles,
  Pin
} from 'lucide-react';
import { CircularProgressRing } from '../common/Charts';

export const GoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    deleteGoal,
    toggleMilestone,
    openQuickAdd,
    pinItemToHome,
    unpinItemFromHome,
    isItemPinnedToHome
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [timeframeFilter, setTimeframeFilter] = useState<string>('all');

  const filteredGoals = goals.filter(g => {
    if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;
    if (timeframeFilter !== 'all' && g.timeframe !== timeframeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Goal & Target Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Turn ambitious aspirations into measurable milestones and track real progress.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('goal')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold px-1">Category:</span>
          {['all', 'Career', 'Study', 'Financial', 'Fitness', 'Personal'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Goals' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Timeframe:</span>
          <select
            value={timeframeFilter}
            onChange={e => setTimeframeFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Timeframes</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="Long-term">Long-term</option>
          </select>
        </div>
      </div>

      {/* Goal Cards Grid or Empty State */}
      {filteredGoals.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <Target className="w-10 h-10 text-purple-400 dark:text-purple-600 mx-auto mb-2 opacity-80" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            You haven't set any goals yet. Create your first goal.
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Set ambitious targets, break them into milestones, and track your progress in one unified view.
          </p>
          <button
            onClick={() => openQuickAdd('goal')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map(goal => {
            const completedMilestones = goal.milestones.filter(m => m.completed).length;
            const totalMilestones = goal.milestones.length;

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-purple-200 dark:hover:border-purple-900/40 transition-all"
              >
                <div>
                  {/* Header row with progress ring */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <CircularProgressRing
                        progress={goal.currentValue}
                        size={64}
                        strokeWidth={6}
                        color={goal.color}
                        showPercent={true}
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                            {goal.category}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {goal.timeframe}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
                          {goal.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {goal.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          isItemPinnedToHome(goal.id)
                            ? unpinItemFromHome(goal.id)
                            : pinItemToHome(goal.id, 'goal', `Goal: ${goal.title}`)
                        }
                        className={`px-2 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                          isItemPinnedToHome(goal.id)
                            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
                            : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                        title={isItemPinnedToHome(goal.id) ? 'Remove from Home Page' : 'Add to Home Page'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${isItemPinnedToHome(goal.id) ? 'fill-purple-600 text-purple-600' : 'text-slate-400'}`} />
                        <span className="hidden sm:inline">
                          {isItemPinnedToHome(goal.id) ? 'Remove from Home' : 'Add to Home'}
                        </span>
                      </button>

                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Milestones list */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                      <span>Milestones</span>
                      <span className="font-mono tabular-nums">
                        {completedMilestones}/{totalMilestones} done
                      </span>
                    </div>

                    {goal.milestones.map(m => (
                      <div
                        key={m.id}
                        onClick={() => toggleMilestone(goal.id, m.id)}
                        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group text-xs transition-colors"
                      >
                        <button type="button" className="focus:outline-hidden shrink-0">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 group-hover:text-purple-500" />
                          )}
                        </button>
                        <span
                          className={`truncate flex-1 ${
                            m.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-700 dark:text-slate-200 font-medium'
                          }`}
                        >
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deadline & Target bottom stats */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Deadline: {goal.deadline || 'Flexible'}</span>
                  </div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    Target: {goal.targetValue}{goal.unit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
