import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Filter,
  Check,
  Pin
} from 'lucide-react';
import { TaskCategory, TaskPriority } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    toggleSubtask,
    updateTask,
    goals,
    openQuickAdd,
    pinItemToHome,
    unpinItemFromHome,
    isItemPinnedToHome
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'high'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<Record<string, string>>({});

  // Quick inline add state
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineCategory, setInlineCategory] = useState<TaskCategory>('Work');
  const [inlinePriority, setInlinePriority] = useState<TaskPriority>('medium');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (activeFilter === 'today' && task.dueDate !== todayStr) return false;
    if (activeFilter === 'upcoming' && (task.dueDate <= todayStr || task.completed)) return false;
    if (activeFilter === 'completed' && !task.completed) return false;
    if (activeFilter === 'high' && task.priority !== 'high') return false;

    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedTaskIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInlineAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return;
    addTask({
      title: inlineTitle.trim(),
      completed: false,
      priority: inlinePriority,
      category: inlineCategory,
      dueDate: todayStr,
      dueTime: '11:00 AM',
      subtasks: []
    });
    setInlineTitle('');
  };

  const handleAddSubtask = (taskId: string) => {
    const title = newSubtaskTitle[taskId];
    if (!title || !title.trim()) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubtask = {
      id: `st-${Date.now()}`,
      title: title.trim(),
      completed: false
    };

    updateTask(taskId, {
      subtasks: [...task.subtasks, newSubtask]
    });

    setNewSubtaskTitle(prev => ({ ...prev, [taskId]: '' }));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Daily Task Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize priorities, manage subtasks, and track daily execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <span className="text-blue-600 font-bold">{pendingCount}</span> pending
            <span className="text-slate-300">·</span>
            <span className="text-emerald-600 font-bold">{completedCount}</span> completed
          </div>
          <button
            onClick={() => openQuickAdd('task')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Inline Quick Creator */}
      <form
        onSubmit={handleInlineAdd}
        className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center gap-2"
      >
        <input
          type="text"
          placeholder="What do you want to accomplish today? (Press Enter to add)"
          value={inlineTitle}
          onChange={e => setInlineTitle(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
        />

        <div className="flex items-center gap-2">
          <select
            value={inlineCategory}
            onChange={e => setInlineCategory(e.target.value as TaskCategory)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Health">Health</option>
            <option value="Personal">Personal</option>
            <option value="Finance">Finance</option>
          </select>

          <select
            value={inlinePriority}
            onChange={e => setInlinePriority(e.target.value as TaskPriority)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium</option>
            <option value="high">High Priority</option>
          </select>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'today', label: 'Today' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'high', label: 'High Priority' },
            { id: 'completed', label: 'Completed' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Category:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Health">Health</option>
            <option value="Personal">Personal</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No tasks found in this view
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You are all caught up! Create a new task or adjust your filters above.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isExpanded = !!expandedTaskIds[task.id];
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubCount = task.subtasks?.filter(st => st.completed).length || 0;
            const linkedGoal = goals.find(g => g.id === task.linkedGoalId);

            const priorityBadge = {
              low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
              medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
              high: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
            }[task.priority];

            return (
              <div
                key={task.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all ${
                  task.completed
                    ? 'border-slate-200/60 dark:border-slate-800/60 opacity-80'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-200 shadow-2xs'
                }`}
              >
                {/* Main Task Row */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 text-blue-600 focus:outline-hidden shrink-0 transition-transform active:scale-90"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </span>

                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${priorityBadge}`}>
                          {task.priority}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                          {task.category}
                        </span>

                        {linkedGoal && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                            🎯 {linkedGoal.title}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{task.dueDate}</span>
                        </div>
                        {task.dueTime && (
                          <div className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.dueTime}</span>
                          </div>
                        )}
                        {hasSubtasks && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>Subtasks ({completedSubCount}/{task.subtasks.length})</span>
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>
                        )}
                        {!hasSubtasks && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="hover:text-blue-600 text-[11px]"
                          >
                            + Add subtasks
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() =>
                        isItemPinnedToHome(task.id)
                          ? unpinItemFromHome(task.id)
                          : pinItemToHome(task.id, 'task', `Task: ${task.title}`)
                      }
                      className={`px-2 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                        isItemPinnedToHome(task.id)
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                          : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                      title={isItemPinnedToHome(task.id) ? 'Remove from Home Page' : 'Add to Home Page'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${isItemPinnedToHome(task.id) ? 'fill-blue-600 text-blue-600' : 'text-slate-400'}`} />
                      <span className="hidden sm:inline">
                        {isItemPinnedToHome(task.id) ? 'Remove from Home' : 'Add to Home'}
                      </span>
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtasks Accordion */}
                {isExpanded && (
                  <div className="px-5 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-2xl space-y-2">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Subtasks checklist:
                    </div>

                    {task.subtasks.map(st => (
                      <div
                        key={st.id}
                        onClick={() => toggleSubtask(task.id, st.id)}
                        className="flex items-center gap-2 py-1 cursor-pointer group text-xs"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                            st.completed
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-500'
                          }`}
                        >
                          {st.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`${
                            st.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {st.title}
                        </span>
                      </div>
                    ))}

                    {/* Add subtask input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add a new subtask..."
                        value={newSubtaskTitle[task.id] || ''}
                        onChange={e =>
                          setNewSubtaskTitle(prev => ({ ...prev, [task.id]: e.target.value }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubtask(task.id);
                          }
                        }}
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleAddSubtask(task.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
