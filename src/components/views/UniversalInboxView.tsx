import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Inbox,
  Plus,
  Share2,
  ExternalLink,
  CheckCircle2,
  CheckSquare,
  FileText,
  Trash2,
  Tag,
  Link,
  MessageCircle,
  Mail,
  Send,
  Video,
  Globe,
  Pin
} from 'lucide-react';
import { UniversalInboxItem, UniversalSource } from '../../types';

export const UniversalInboxView: React.FC = () => {
  const {
    universalInbox,
    addUniversalItem,
    deleteUniversalItem,
    toggleUniversalProcessed,
    convertUniversalToTask,
    convertUniversalToNote,
    pinItemToHome,
    unpinItemFromHome,
    isItemPinnedToHome
  } = useApp();

  const [activeSourceFilter, setActiveSourceFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState<UniversalSource>('WhatsApp');
  const [category, setCategory] = useState('Productivity');

  const sources: { id: UniversalSource; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'Gmail', label: 'Gmail', icon: Mail, color: 'text-rose-500 bg-rose-50' },
    { id: 'Telegram', label: 'Telegram', icon: Send, color: 'text-blue-400 bg-blue-50' },
    { id: 'YouTube', label: 'YouTube', icon: Video, color: 'text-red-500 bg-red-50' },
    { id: 'Web Link', label: 'Web Link', icon: Globe, color: 'text-cyan-500 bg-cyan-50' },
    { id: 'Quick Note', label: 'Quick Note', icon: FileText, color: 'text-amber-500 bg-amber-50' }
  ];

  const filteredItems = universalInbox.filter(item => {
    if (activeSourceFilter !== 'all' && item.source !== activeSourceFilter) return false;
    return true;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addUniversalItem({
      title: title.trim(),
      source,
      type: url.trim() ? 'link' : 'snippet',
      url: url.trim() || undefined,
      description: description.trim(),
      category,
      tags: [source, category]
    });

    setTitle('');
    setUrl('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Universal Save & Inbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            One centralized digital drop-zone for WhatsApp messages, Gmail attachments, articles, and YouTube links.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Save Information</span>
        </button>
      </div>

      {/* How it works info banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/50 border border-blue-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600 text-white shrink-0 mt-0.5">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Signature Feature: Share into OneSpace
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Whenever you receive an important file or link in WhatsApp, Telegram, or Gmail, drop it into OneSpace with a single click. Convert it directly into an actionable task or permanent note whenever you are ready.
            </p>
          </div>
        </div>
      </div>

      {/* Save Input Form */}
      {showAddForm && (
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Save New Content to Universal Inbox
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Content Title / Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Q4 Tax Deductions or System Design Tutorial"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Original Source App
              </label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
              >
                {sources.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Link URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Productivity, Finance, Code"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Extracted Text
            </label>
            <textarea
              rows={3}
              placeholder="Paste important snippet, meeting transcript, or summary..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Save to Inbox
            </button>
          </div>
        </form>
      )}

      {/* Sources Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <button
          onClick={() => setActiveSourceFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSourceFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Sources ({universalInbox.length})
        </button>

        {sources.map(s => {
          const Icon = s.icon;
          const count = universalInbox.filter(u => u.source === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSourceFilter(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSourceFilter === s.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Inbox Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Universal Inbox is Clean
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Save links, WhatsApp notes, or Telegram clips to keep them in your unified life backlog.
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const sourceConfig = sources.find(s => s.id === item.source) || sources[0];
            const Icon = sourceConfig.icon;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  item.processed
                    ? 'border-slate-200/60 dark:border-slate-800/60 opacity-75'
                    : 'border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${sourceConfig.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.source}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-2 font-mono truncate max-w-md"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.url}</span>
                      </a>
                    )}

                    <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
                      <span>Saved: {new Date(item.savedAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{item.processed ? 'Processed' : 'Unprocessed'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Convert Buttons */}
                <div className="flex items-center sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                  <button
                    onClick={() =>
                      isItemPinnedToHome(item.id)
                        ? unpinItemFromHome(item.id)
                        : pinItemToHome(item.id, 'information', `Info: ${item.title}`)
                    }
                    className={`flex-1 sm:w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                      isItemPinnedToHome(item.id)
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                    title={isItemPinnedToHome(item.id) ? 'Remove from Home Page' : 'Add to Home Page'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${isItemPinnedToHome(item.id) ? 'fill-blue-600 text-blue-600' : 'text-slate-400'}`} />
                    <span>{isItemPinnedToHome(item.id) ? 'Remove from Home' : 'Add to Home'}</span>
                  </button>

                  <button
                    onClick={() => convertUniversalToTask(item.id)}
                    className="flex-1 sm:w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors"
                    title="Convert to Task"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>To Task</span>
                  </button>

                  <button
                    onClick={() => convertUniversalToNote(item.id)}
                    className="flex-1 sm:w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                    title="Save to Notes"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>To Note</span>
                  </button>

                  <div className="flex items-center gap-1 justify-end w-full">
                    <button
                      onClick={() => toggleUniversalProcessed(item.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        item.processed
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                      title={item.processed ? 'Mark as Unread' : 'Mark as Processed'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUniversalItem(item.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
