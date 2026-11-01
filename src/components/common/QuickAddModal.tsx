import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckSquare,
  FileText,
  Target,
  Wallet,
  UploadCloud,
  Plus
} from 'lucide-react';
import { TaskCategory, TaskPriority, ExpenseCategory } from '../../types';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddInitialTab,
    addTask,
    addNote,
    addGoal,
    addTransaction,
    addVaultDocument,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'task' | 'note' | 'goal' | 'expense' | 'document'>(quickAddInitialTab);

  useEffect(() => {
    if (isQuickAddOpen) {
      setActiveTab(quickAddInitialTab);
    }
  }, [isQuickAddOpen, quickAddInitialTab]);

  // Form states
  // Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('Work');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskDueTime, setTaskDueTime] = useState('10:00 AM');

  // Note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteFolder, setNoteFolder] = useState('General');

  // Goal
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState(100);
  const [goalUnit, setGoalUnit] = useState('%');
  const [goalCategory, setGoalCategory] = useState<'Career' | 'Study' | 'Financial' | 'Fitness' | 'Personal'>('Career');

  // Expense
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('Food & Dining');
  const [isIncome, setIsIncome] = useState(false);

  // Document / Vault
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'Work' | 'Academic' | 'Identity' | 'Finance' | 'Receipts' | 'Other'>('Work');
  const [docType, setDocType] = useState<'pdf' | 'docx' | 'xlsx' | 'image'>('pdf');

  if (!isQuickAddOpen) return null;

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      completed: false,
      priority: taskPriority,
      category: taskCategory,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: taskDueTime,
      subtasks: []
    });
    setTaskTitle('');
    setIsQuickAddOpen(false);
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      folder: noteFolder,
      tags: ['QuickAdd'],
      pinned: false,
      favorite: false
    });
    setNoteTitle('');
    setNoteContent('');
    setIsQuickAddOpen(false);
  };

  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({
      title: goalTitle.trim(),
      description: 'Goal added via Quick Add.',
      category: goalCategory,
      targetValue: Number(goalTarget) || 100,
      currentValue: 0,
      unit: goalUnit,
      timeframe: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '2026-12-31',
      color: '#8B5CF6',
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Define foundation roadmap', completed: false },
        { id: `m-${Date.now()}-2`, title: 'Midway checkpoint review', completed: false }
      ]
    });
    setGoalTitle('');
    setIsQuickAddOpen(false);
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;
    addTransaction({
      title: expenseTitle.trim(),
      amount: Math.abs(parseFloat(expenseAmount)) || 0,
      type: isIncome ? 'income' : 'expense',
      category: expenseCategory,
      date: new Date().toISOString().split('T')[0]
    });
    setExpenseTitle('');
    setExpenseAmount('');
    setIsQuickAddOpen(false);
  };

  const handleSubmitDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    const ext = docType === 'pdf' ? '.pdf' : docType === 'docx' ? '.docx' : docType === 'xlsx' ? '.xlsx' : '.png';
    addVaultDocument({
      title: docTitle.endsWith(ext) ? docTitle : `${docTitle}${ext}`,
      originalFileName: docTitle.endsWith(ext) ? docTitle : `${docTitle}${ext}`,
      fileType: docType,
      sizeBytes: 1250000,
      category: docCategory,
      tags: ['Uploaded', docCategory],
      pinned: false,
      favorite: false,
      fileContentPreview: `Document content stored securely in OneSpace Vault.`
    });
    setDocTitle('');
    setIsQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-base text-slate-900 dark:text-white">Quick Add</span>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'task', label: 'Task', icon: CheckSquare },
            { id: 'note', label: 'Note', icon: FileText },
            { id: 'goal', label: 'Goal', icon: Target },
            { id: 'expense', label: 'Expense', icon: Wallet },
            { id: 'document', label: 'Vault File', icon: UploadCloud }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content forms */}
        <div className="p-6">
          {/* TASK FORM */}
          {activeTab === 'task' && (
            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g., Review project proposal"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                  >
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={taskDueTime}
                  onChange={e => setTaskDueTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Add Task
                </button>
              </div>
            </form>
          )}

          {/* NOTE FORM */}
          {activeTab === 'note' && (
            <form onSubmit={handleSubmitNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ideas for Q4 roadmap"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Folder
                </label>
                <input
                  type="text"
                  placeholder="e.g., Work, Study, Ideas"
                  value={noteFolder}
                  onChange={e => setNoteFolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your note here..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}

          {/* GOAL FORM */}
          {activeTab === 'goal' && (
            <form onSubmit={handleSubmitGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Master Full Stack Architecture"
                  value={goalTitle}
                  onChange={e => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={goalCategory}
                    onChange={e => setGoalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                  >
                    <option value="Career">Career</option>
                    <option value="Study">Study</option>
                    <option value="Financial">Financial</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Unit
                  </label>
                  <input
                    type="text"
                    value={goalUnit}
                    onChange={e => setGoalUnit(e.target.value)}
                    placeholder="%, books, ₹"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={e => setGoalTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Create Goal
                </button>
              </div>
            </form>
          )}

          {/* EXPENSE FORM */}
          {activeTab === 'expense' && (
            <form onSubmit={handleSubmitExpense} className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
                <button
                  type="button"
                  onClick={() => setIsIncome(false)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    !isIncome ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setIsIncome(true)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isIncome ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isIncome ? 'e.g., Freelance Project Payment' : 'e.g., Organic Groceries'}
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount ({user.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g., 1500"
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={e => setExpenseCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm ${
                    isIncome ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-500 hover:bg-rose-600'
                  }`}
                >
                  Record {isIncome ? 'Income' : 'Expense'}
                </button>
              </div>
            </form>
          )}

          {/* VAULT DOCUMENT FORM */}
          {activeTab === 'document' && (
            <form onSubmit={handleSubmitDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Annual_Performance_Review"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    File Type
                  </label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="docx">Word Document (.docx)</option>
                    <option value="xlsx">Excel Sheet (.xlsx)</option>
                    <option value="image">Screenshot / Image (.png)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                  >
                    <option value="Work">Work</option>
                    <option value="Academic">Academic</option>
                    <option value="Identity">Identity</option>
                    <option value="Finance">Finance</option>
                    <option value="Receipts">Receipts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800/40">
                <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ready to store in Smart Vault
                </p>
                <p className="text-[11px] text-slate-400">
                  Encrypted local & secure browser-backed repository
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
