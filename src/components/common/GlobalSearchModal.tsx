import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  CheckSquare,
  FileText,
  Target,
  Calendar,
  FolderArchive,
  Inbox,
  Wallet,
  ArrowRight
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    tasks,
    notes,
    goals,
    scheduleEvents,
    vaultDocuments,
    universalInbox,
    transactions,
    setActiveTab,
    user
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'notes' | 'goals' | 'docs' | 'links'>('all');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: {
      id: string;
      title: string;
      subtitle: string;
      type: 'task' | 'note' | 'goal' | 'event' | 'doc' | 'inbox' | 'expense';
      tab: any;
      icon: React.ElementType;
      color: string;
    }[] = [];

    // Tasks
    if (filterType === 'all' || filterType === 'tasks') {
      tasks.forEach(t => {
        if (t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))) {
          results.push({
            id: t.id,
            title: t.title,
            subtitle: `${t.category} · Due ${t.dueDate} · ${t.completed ? 'Completed' : 'Pending'}`,
            type: 'task',
            tab: 'My Tasks',
            icon: CheckSquare,
            color: 'text-blue-500'
          });
        }
      });
    }

    // Notes
    if (filterType === 'all' || filterType === 'notes') {
      notes.forEach(n => {
        if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
          results.push({
            id: n.id,
            title: n.title,
            subtitle: `Folder: ${n.folder} · ${n.tags.join(', ')}`,
            type: 'note',
            tab: 'Notes',
            icon: FileText,
            color: 'text-indigo-500'
          });
        }
      });
    }

    // Goals
    if (filterType === 'all' || filterType === 'goals') {
      goals.forEach(g => {
        if (g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)) {
          results.push({
            id: g.id,
            title: g.title,
            subtitle: `${g.category} · ${g.currentValue}${g.unit} / ${g.targetValue}${g.unit}`,
            type: 'goal',
            tab: 'Goals',
            icon: Target,
            color: 'text-purple-500'
          });
        }
      });
    }

    // Documents
    if (filterType === 'all' || filterType === 'docs') {
      vaultDocuments.forEach(d => {
        if (d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) {
          results.push({
            id: d.id,
            title: d.title,
            subtitle: `${d.category} · ${(d.sizeBytes / 1024 / 1024).toFixed(1)} MB`,
            type: 'doc',
            tab: 'Smart Vault',
            icon: FolderArchive,
            color: 'text-teal-500'
          });
        }
      });
    }

    // Universal Inbox / Links
    if (filterType === 'all' || filterType === 'links') {
      universalInbox.forEach(u => {
        if (u.title.toLowerCase().includes(q) || u.description.toLowerCase().includes(q)) {
          results.push({
            id: u.id,
            title: u.title,
            subtitle: `Source: ${u.source} · ${u.category}`,
            type: 'inbox',
            tab: 'Universal Inbox',
            icon: Inbox,
            color: 'text-amber-500'
          });
        }
      });
    }

    // Calendar
    if (filterType === 'all') {
      scheduleEvents.forEach(e => {
        if (e.title.toLowerCase().includes(q)) {
          results.push({
            id: e.id,
            title: e.title,
            subtitle: `${e.date} at ${e.startTime} - ${e.endTime}`,
            type: 'event',
            tab: 'Calendar',
            icon: Calendar,
            color: 'text-cyan-500'
          });
        }
      });
    }

    return results.slice(0, 8);
  }, [query, filterType, tasks, notes, goals, vaultDocuments, universalInbox, scheduleEvents]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks, notes, goals, files, events..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 ml-1"
          >
            Cancel
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto text-xs">
          {(['all', 'tasks', 'notes', 'goals', 'docs', 'links'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap font-medium transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {type === 'all' ? 'All Results' : type}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">Universal Search</p>
              <p>Type keywords to search across your whole workspace instantly.</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400">
                <span>Try:</span>
                <button onClick={() => setQuery('DSA')} className="underline hover:text-blue-500">DSA</button>
                <span>·</span>
                <button onClick={() => setQuery('Proposal')} className="underline hover:text-blue-500">Proposal</button>
                <span>·</span>
                <button onClick={() => setQuery('Savings')} className="underline hover:text-blue-500">Savings</button>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching results found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-xs font-medium shrink-0 ml-3">
                      <span>Jump</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
