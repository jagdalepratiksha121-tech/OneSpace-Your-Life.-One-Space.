import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Pin,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Target,
  FileText,
  Inbox,
  FolderArchive,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Check,
  AlertCircle,
  Handshake,
  DollarSign
} from 'lucide-react';
import { PinnedItemType } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    user,
    pinnedHomeItems,
    pinItemToHome,
    unpinItemFromHome,
    movePinnedItem,
    moneyToReceive,
    tasks,
    toggleTask,
    goals,
    notes,
    universalInbox,
    vaultDocuments,
    markAsFullyReceived,
    setActiveTab,
    openQuickAdd
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'money' | 'task' | 'goal' | 'note' | 'information'>('all');
  const [isPinSelectorOpen, setIsPinSelectorOpen] = useState(false);
  const [pinSelectorTab, setPinSelectorTab] = useState<'money' | 'task' | 'goal' | 'note' | 'information'>('money');
  const [searchFilter, setSearchFilter] = useState('');

  // Sorted pinned items by order
  const sortedPins = [...pinnedHomeItems].sort((a, b) => a.order - b.order);

  // Filter pinned items
  const filteredPins = sortedPins.filter(pin => {
    if (activeFilter !== 'all' && pin.type !== activeFilter) return false;
    return true;
  });

  // Calculate live counts
  const moneyPinsCount = sortedPins.filter(p => p.type === 'money').length;
  const taskPinsCount = sortedPins.filter(p => p.type === 'task').length;
  const goalPinsCount = sortedPins.filter(p => p.type === 'goal').length;
  const notePinsCount = sortedPins.filter(p => p.type === 'note').length;
  const infoPinsCount = sortedPins.filter(p => p.type === 'information' || p.type === 'document').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* 1. Header with Personalized Greeting & Pin Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <span>Good morning, {user.name}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} · Your Personal Home Reminder Board
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPinSelectorOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Pin className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
            <span>Customize Home Page</span>
          </button>

          <button
            onClick={() => openQuickAdd('task')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All Pinned ({sortedPins.length})
          </button>

          {moneyPinsCount > 0 && (
            <button
              onClick={() => setActiveFilter('money')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'money'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Money to Collect ({moneyPinsCount})
            </button>
          )}

          {taskPinsCount > 0 && (
            <button
              onClick={() => setActiveFilter('task')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'task'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Tasks ({taskPinsCount})
            </button>
          )}

          {goalPinsCount > 0 && (
            <button
              onClick={() => setActiveFilter('goal')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'goal'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Goals ({goalPinsCount})
            </button>
          )}

          {notePinsCount > 0 && (
            <button
              onClick={() => setActiveFilter('note')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'note'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Notes ({notePinsCount})
            </button>
          )}

          {infoPinsCount > 0 && (
            <button
              onClick={() => setActiveFilter('information')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'information'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Information ({infoPinsCount})
            </button>
          )}
        </div>

        <div className="text-[11px] text-gray-400">
          Tip: Pin any record using the pin icon across OneSpace to keep it here.
        </div>
      </div>

      {/* 3. Pinned Items List or Empty State */}
      {sortedPins.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center mb-3">
            <Pin className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Your Personal Reminder Board is Empty
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto leading-relaxed">
            Choose exactly what appears on your Home Page. Pin a friend's pending payment you need to collect, priority tasks, active goals, or important notes to keep them front and center.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 max-w-xl mx-auto">
            <button
              onClick={() => {
                setPinSelectorTab('money');
                setIsPinSelectorOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              + Pin Money to Collect
            </button>

            <button
              onClick={() => {
                setPinSelectorTab('task');
                setIsPinSelectorOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              + Pin Important Tasks
            </button>

            <button
              onClick={() => {
                setPinSelectorTab('goal');
                setIsPinSelectorOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
            >
              + Pin Goals
            </button>

            <button
              onClick={() => {
                setPinSelectorTab('note');
                setIsPinSelectorOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            >
              + Pin Notes
            </button>
          </div>
        </div>
      ) : filteredPins.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs text-gray-400">
          No pinned items matching this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPins.map((pin, index) => {
            // 1. MONEY TO RECEIVE PINNED ITEM
            if (pin.type === 'money') {
              const item = moneyToReceive.find(m => m.id === pin.itemId);
              if (!item) {
                return (
                  <div key={pin.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span>(Original lent money record was deleted)</span>
                    <button onClick={() => unpinItemFromHome(pin.itemId)} className="text-rose-500 hover:underline">
                      Remove Pin
                    </button>
                  </div>
                );
              }

              const isSettled = item.status === 'received';
              const isPartial = item.status === 'partially_received' || (item.remainingAmount < item.originalAmount && item.remainingAmount > 0);

              return (
                <div
                  key={pin.id}
                  className={`p-4 rounded-xl bg-white dark:bg-gray-900 border transition-all flex flex-col justify-between ${
                    isSettled
                      ? 'border-gray-200/60 dark:border-gray-800/60 opacity-80'
                      : 'border-blue-200 dark:border-blue-900/60 shadow-2xs hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Type Tag, Person Name & Reorder / Unpin */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.personName.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                              {item.personName}
                            </h4>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60">
                              Money to Collect
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            Given on {item.dateGiven}
                          </span>
                        </div>
                      </div>

                      {/* Controls: Reorder & Unpin */}
                      <div className="flex items-center gap-0.5 shrink-0 text-gray-400">
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'down')}
                          disabled={index === filteredPins.length - 1}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => unpinItemFromHome(pin.itemId)}
                          className="p-1 text-gray-400 hover:text-rose-500 rounded cursor-pointer"
                          title="Remove from Home Page (keeps original record)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Amount & Status Info */}
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                          {isSettled ? 'Settled' : 'Pending Amount'}
                        </div>
                        <div
                          className={`text-lg font-bold font-mono tabular-nums ${
                            isSettled ? 'line-through text-gray-400' : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {user.currencySymbol}
                          {item.remainingAmount.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        {isSettled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Received</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/60">
                            <AlertCircle className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reminder details and Note */}
                    {item.reminderDateTime && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Reminder: {new Date(item.reminderDateTime).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Bottom Action: Mark as Received */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('My Money')}
                      className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in Money</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {!isSettled ? (
                      <button
                        onClick={() => markAsFullyReceived(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Click when Rahul has returned the money"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Mark as Received</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        Payment Fully Received
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            // 2. TASK PINNED ITEM
            if (pin.type === 'task') {
              const task = tasks.find(t => t.id === pin.itemId);
              if (!task) {
                return (
                  <div key={pin.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span>(Original task was deleted)</span>
                    <button onClick={() => unpinItemFromHome(pin.itemId)} className="text-rose-500 hover:underline">
                      Remove Pin
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={pin.id}
                  className={`p-4 rounded-xl bg-white dark:bg-gray-900 border transition-all flex flex-col justify-between ${
                    task.completed
                      ? 'border-gray-200/60 dark:border-gray-800/60 opacity-80'
                      : 'border-blue-200 dark:border-blue-900/60 shadow-2xs hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="mt-0.5 text-blue-600 focus:outline-hidden shrink-0 cursor-pointer"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 hover:text-blue-500 transition-colors" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <h4
                            className={`font-semibold text-sm truncate ${
                              task.completed
                                ? 'line-through text-gray-400 dark:text-gray-500'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                              Task · {task.category}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase">
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controls: Reorder & Unpin */}
                      <div className="flex items-center gap-0.5 shrink-0 text-gray-400">
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'down')}
                          disabled={index === filteredPins.length - 1}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => unpinItemFromHome(pin.itemId)}
                          className="p-1 text-gray-400 hover:text-rose-500 rounded cursor-pointer"
                          title="Remove from Home Page (keeps original task)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due {task.dueDate}</span>
                      </span>
                      {task.dueTime && (
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.dueTime}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveTab('My Tasks')}
                      className="text-gray-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in Tasks</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <span
                      className={`font-semibold ${
                        task.completed ? 'text-emerald-600' : 'text-blue-600'
                      }`}
                    >
                      {task.completed ? 'Completed' : 'Action Required'}
                    </span>
                  </div>
                </div>
              );
            }

            // 3. GOAL PINNED ITEM
            if (pin.type === 'goal') {
              const goal = goals.find(g => g.id === pin.itemId);
              if (!goal) {
                return (
                  <div key={pin.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span>(Original goal was deleted)</span>
                    <button onClick={() => unpinItemFromHome(pin.itemId)} className="text-rose-500 hover:underline">
                      Remove Pin
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={pin.id}
                  className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-900/60 shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
                          <Target className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                            {goal.title}
                          </h4>
                          <span className="text-[10px] font-semibold text-purple-600 uppercase">
                            Goal · {goal.category}
                          </span>
                        </div>
                      </div>

                      {/* Controls: Reorder & Unpin */}
                      <div className="flex items-center gap-0.5 shrink-0 text-gray-400">
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'down')}
                          disabled={index === filteredPins.length - 1}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => unpinItemFromHome(pin.itemId)}
                          className="p-1 text-gray-400 hover:text-rose-500 rounded cursor-pointer"
                          title="Remove from Home Page (keeps original goal)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-mono text-purple-600 font-bold">
                          {goal.currentValue}{goal.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, goal.currentValue)}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 flex items-center justify-between">
                      <span>Target: {goal.targetValue}{goal.unit}</span>
                      <span>Deadline: {goal.deadline || 'No deadline'}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveTab('Goals')}
                      className="text-gray-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in Goals</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <span className="text-purple-600 font-semibold font-mono">
                      {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones done
                    </span>
                  </div>
                </div>
              );
            }

            // 4. NOTE PINNED ITEM
            if (pin.type === 'note') {
              const note = notes.find(n => n.id === pin.itemId);
              if (!note) {
                return (
                  <div key={pin.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    <span>(Original note was deleted)</span>
                    <button onClick={() => unpinItemFromHome(pin.itemId)} className="text-rose-500 hover:underline">
                      Remove Pin
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={pin.id}
                  className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/60 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                            {note.title || 'Untitled Note'}
                          </h4>
                          <span className="text-[10px] font-semibold text-amber-600 font-mono">
                            Note · 📁 {note.folder}
                          </span>
                        </div>
                      </div>

                      {/* Controls: Reorder & Unpin */}
                      <div className="flex items-center gap-0.5 shrink-0 text-gray-400">
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'down')}
                          disabled={index === filteredPins.length - 1}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => unpinItemFromHome(pin.itemId)}
                          className="p-1 text-gray-400 hover:text-rose-500 rounded cursor-pointer"
                          title="Remove from Home Page (keeps original note)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed whitespace-pre-line">
                      {note.content || '(Empty note)'}
                    </p>

                    <div className="text-[10px] text-gray-400">
                      Updated on {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveTab('Notes')}
                      className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open in Notes</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            }

            // 5. INFORMATION / UNIVERSAL INBOX / SMART VAULT PINNED ITEM
            if (pin.type === 'information' || pin.type === 'document') {
              const inboxItem = universalInbox.find(u => u.id === pin.itemId);
              const docItem = vaultDocuments.find(d => d.id === pin.itemId);
              const title = inboxItem?.title || docItem?.title || 'Saved Information';
              const source = inboxItem?.source || docItem?.fileType?.toUpperCase() || 'Information';
              const detail = inboxItem?.description || inboxItem?.url || docItem?.originalFileName || '';

              return (
                <div
                  key={pin.id}
                  className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-cyan-200 dark:border-cyan-900/60 shadow-2xs hover:border-cyan-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 flex items-center justify-center shrink-0">
                          {docItem ? <FolderArchive className="w-4 h-4" /> : <Inbox className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                            {title}
                          </h4>
                          <span className="text-[10px] font-semibold text-cyan-600">
                            Information · {source}
                          </span>
                        </div>
                      </div>

                      {/* Controls: Reorder & Unpin */}
                      <div className="flex items-center gap-0.5 shrink-0 text-gray-400">
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => movePinnedItem(pin.itemId, 'down')}
                          disabled={index === filteredPins.length - 1}
                          className="p-1 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => unpinItemFromHome(pin.itemId)}
                          className="p-1 text-gray-400 hover:text-rose-500 rounded cursor-pointer"
                          title="Remove from Home Page (keeps original)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {detail && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {detail}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveTab(docItem ? 'Smart Vault' : 'Universal Inbox')}
                      className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>{docItem ? 'View in Smart Vault' : 'View in Inbox'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* 4. Quick Pin Selector Modal */}
      {isPinSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Customize Home Page — Choose What to Pin
                </h3>
              </div>
              <button
                onClick={() => setIsPinSelectorOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1.5 px-5 pt-3 border-b border-gray-100 dark:border-gray-800 overflow-x-auto text-xs shrink-0">
              {[
                { id: 'money', label: `Money to Collect (${moneyToReceive.length})` },
                { id: 'task', label: `Tasks (${tasks.length})` },
                { id: 'goal', label: `Goals (${goals.length})` },
                { id: 'note', label: `Notes (${notes.length})` },
                { id: 'information', label: `Info (${universalInbox.length + vaultDocuments.length})` }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setPinSelectorTab(t.id as any)}
                  className={`px-3 py-1.5 border-b-2 font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    pinSelectorTab === t.id
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal List Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-2.5 text-xs">
              {/* MONEY TAB */}
              {pinSelectorTab === 'money' && (
                <>
                  {moneyToReceive.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      No lent money recorded yet.{' '}
                      <button
                        onClick={() => {
                          setIsPinSelectorOpen(false);
                          setActiveTab('My Money');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Record Money Given
                      </button>
                    </div>
                  ) : (
                    moneyToReceive.map(item => {
                      const isPinned = pinnedHomeItems.some(p => p.itemId === item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-900 dark:text-white truncate">
                              {item.personName}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono">
                              Owes {user.currencySymbol}{item.remainingAmount.toLocaleString()} · Status: {item.status}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              isPinned
                                ? unpinItemFromHome(item.id)
                                : pinItemToHome(
                                    item.id,
                                    'money',
                                    `${item.personName} owes ${user.currencySymbol}${item.remainingAmount.toLocaleString()}`
                                  )
                            }
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                              isPinned
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-white' : ''}`} />
                            <span>{isPinned ? 'Pinned' : 'Pin to Home'}</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* TASKS TAB */}
              {pinSelectorTab === 'task' && (
                <>
                  {tasks.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      No tasks created yet.{' '}
                      <button
                        onClick={() => {
                          setIsPinSelectorOpen(false);
                          setActiveTab('My Tasks');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Go to Tasks
                      </button>
                    </div>
                  ) : (
                    tasks.map(task => {
                      const isPinned = pinnedHomeItems.some(p => p.itemId === task.id);
                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <div className={`font-semibold text-gray-900 dark:text-white truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>
                              {task.title}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {task.category} · Due {task.dueDate} {task.dueTime || ''}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              isPinned
                                ? unpinItemFromHome(task.id)
                                : pinItemToHome(task.id, 'task', `Task: ${task.title}`)
                            }
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                              isPinned
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-white' : ''}`} />
                            <span>{isPinned ? 'Pinned' : 'Pin to Home'}</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* GOALS TAB */}
              {pinSelectorTab === 'goal' && (
                <>
                  {goals.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      No goals set yet.{' '}
                      <button
                        onClick={() => {
                          setIsPinSelectorOpen(false);
                          setActiveTab('Goals');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Create Goal
                      </button>
                    </div>
                  ) : (
                    goals.map(goal => {
                      const isPinned = pinnedHomeItems.some(p => p.itemId === goal.id);
                      return (
                        <div
                          key={goal.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <div className="font-semibold text-gray-900 dark:text-white truncate">
                              {goal.title}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {goal.category} · {goal.currentValue}{goal.unit} of {goal.targetValue}{goal.unit}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              isPinned
                                ? unpinItemFromHome(goal.id)
                                : pinItemToHome(goal.id, 'goal', `Goal: ${goal.title}`)
                            }
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                              isPinned
                                ? 'bg-purple-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-white' : ''}`} />
                            <span>{isPinned ? 'Pinned' : 'Pin to Home'}</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* NOTES TAB */}
              {pinSelectorTab === 'note' && (
                <>
                  {notes.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      No notes created yet.{' '}
                      <button
                        onClick={() => {
                          setIsPinSelectorOpen(false);
                          setActiveTab('Notes');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Create Note
                      </button>
                    </div>
                  ) : (
                    notes.map(note => {
                      const isPinned = pinnedHomeItems.some(p => p.itemId === note.id);
                      return (
                        <div
                          key={note.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <div className="font-semibold text-gray-900 dark:text-white truncate">
                              {note.title || 'Untitled Note'}
                            </div>
                            <div className="text-[11px] text-gray-500 line-clamp-1">
                              {note.content || '(Empty)'}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              isPinned
                                ? unpinItemFromHome(note.id)
                                : pinItemToHome(note.id, 'note', `Note: ${note.title || 'Untitled'}`)
                            }
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                              isPinned
                                ? 'bg-amber-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-white' : ''}`} />
                            <span>{isPinned ? 'Pinned' : 'Pin to Home'}</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* INFORMATION TAB */}
              {pinSelectorTab === 'information' && (
                <>
                  {universalInbox.length === 0 && vaultDocuments.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      No inbox items or vault documents yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {universalInbox.map(item => {
                        const isPinned = pinnedHomeItems.some(p => p.itemId === item.id);
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="font-semibold text-gray-900 dark:text-white truncate">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                Source: {item.source}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                isPinned
                                  ? unpinItemFromHome(item.id)
                                  : pinItemToHome(item.id, 'information', `Info: ${item.title}`)
                              }
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                                isPinned
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-white' : ''}`} />
                              <span>{isPinned ? 'Pinned' : 'Pin to Home'}</span>
                            </button>
                          </div>
                        );
                      })}

                      {vaultDocuments.map(doc => {
                        const isPinned = pinnedHomeItems.some(p => p.itemId === doc.id);
                        return (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="font-semibold text-gray-900 dark:text-white truncate">
                                {doc.title}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                Document: {doc.category} ({doc.fileType.toUpperCase()})
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                isPinned
                                  ? unpinItemFromHome(doc.id)
                                  : pinItemToHome(doc.id, 'document', `Doc: ${doc.title}`)
                              }
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                                isPinned
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-white' : ''}`} />
                              <span>{isPinned ? 'Pinned' : 'Pin to Home'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0">
              <button
                onClick={() => setIsPinSelectorOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
              >
                Done Customizing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
