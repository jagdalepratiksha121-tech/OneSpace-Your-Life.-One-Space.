import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { scheduleEvents, addScheduleEvent, deleteScheduleEvent, tasks } = useApp();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('15:00');
  const [newCategory, setNewCategory] = useState<'Work' | 'Study' | 'Meeting' | 'Health' | 'Personal'>('Work');
  const [showAddForm, setShowAddForm] = useState(false);

  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ];

  const categoryColors: Record<string, string> = {
    Work: '#3B82F6',
    Study: '#8B5CF6',
    Meeting: '#EC4899',
    Health: '#10B981',
    Personal: '#F59E0B'
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    addScheduleEvent({
      title: newEventTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      startTime: newStartTime,
      endTime: newEndTime,
      category: newCategory,
      color: categoryColors[newCategory] || '#3B82F6'
    });

    setNewEventTitle('');
    setShowAddForm(false);
  };

  // Conflict detection
  const hasConflict = (evtA: typeof scheduleEvents[0], evtB: typeof scheduleEvents[0]) => {
    if (evtA.id === evtB.id || evtA.date !== evtB.date) return false;
    return evtA.startTime < evtB.endTime && evtB.startTime < evtA.endTime;
  };

  const conflictingEventIds = new Set<string>();
  for (let i = 0; i < scheduleEvents.length; i++) {
    for (let j = i + 1; j < scheduleEvents.length; j++) {
      if (hasConflict(scheduleEvents[i], scheduleEvents[j])) {
        conflictingEventIds.add(scheduleEvents[i].id);
        conflictingEventIds.add(scheduleEvents[j].id);
      }
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Daily Schedule & Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Time-block your deep work hours, meetings, and habits without overlap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            {(['day', 'week', 'month'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Conflict banner if any */}
      {conflictingEventIds.size > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Schedule Conflict Detected:</strong> Two or more events overlap in your timetable. Please adjust start or end times.
          </span>
        </div>
      )}

      {/* Add Event Drawer / Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddEvent}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 animate-in fade-in duration-150"
        >
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Sprint Planning or DSA Lecture"
              value={newEventTitle}
              onChange={e => setNewEventTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Time (Start - End)
            </label>
            <div className="flex items-center gap-1">
              <input
                type="time"
                value={newStartTime}
                onChange={e => setNewStartTime(e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden font-mono"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="time"
                value={newEndTime}
                onChange={e => setNewEndTime(e.target.value)}
                className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
              >
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Meeting">Meeting</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Main Schedule Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            <button className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Timezone: Asia/Kolkata (IST)
          </div>
        </div>

        {scheduleEvents.length === 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
            <Clock className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No upcoming schedule. Plan your day in Calendar.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 mb-2">
              Time-block your deep work hours, classes, or meetings.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>
        )}

        {/* Time block timeline view */}
        <div className="space-y-4">
          {hours.map(hour => {
            const currentEvents = scheduleEvents.filter(
              e => e.startTime.startsWith(hour.slice(0, 2))
            );

            return (
              <div key={hour} className="flex items-start gap-4 group">
                {/* Time label */}
                <div className="w-14 text-right font-mono text-xs text-slate-400 pt-1 shrink-0">
                  {hour}
                </div>

                {/* Timeline slot */}
                <div className="flex-1 min-h-[50px] border-t border-slate-100 dark:border-slate-800/80 pt-1">
                  {currentEvents.length > 0 ? (
                    <div className="space-y-2">
                      {currentEvents.map(evt => {
                        const isConflict = conflictingEventIds.has(evt.id);
                        return (
                          <div
                            key={evt.id}
                            className={`p-3 rounded-2xl flex items-center justify-between gap-3 text-xs transition-all shadow-2xs ${
                              isConflict
                                ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800'
                                : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: evt.color }}
                              />
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white block truncate">
                                  {evt.title}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {evt.startTime} - {evt.endTime} · {evt.category}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => deleteScheduleEvent(evt.id)}
                              className="text-slate-400 hover:text-rose-500 p-1"
                              title="Delete event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setNewStartTime(hour);
                          const nextH = String(Number(hour.slice(0, 2)) + 1).padStart(2, '0') + ':00';
                          setNewEndTime(nextH);
                          setShowAddForm(true);
                        }}
                        className="text-[11px] text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Schedule at {hour}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
