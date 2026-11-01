import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Handshake,
  Plus,
  Bell,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  DollarSign,
  AlertCircle,
  Check,
  History,
  X,
  Sparkles,
  Volume2,
  Pin
} from 'lucide-react';
import { MoneyToReceive } from '../../types';
import { sendSystemNotification } from '../../utils/notifications';

export const MoneyToReceiveSection: React.FC = () => {
  const {
    moneyToReceive,
    addMoneyToReceive,
    updateMoneyToReceive,
    deleteMoneyToReceive,
    recordPartialReceipt,
    markAsFullyReceived,
    hasNotificationPermission,
    requestNotificationPermission,
    pinItemToHome,
    unpinItemFromHome,
    isItemPinnedToHome,
    user
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'partially_received' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MoneyToReceive | null>(null);
  const [partialPaymentItem, setPartialPaymentItem] = useState<MoneyToReceive | null>(null);
  const [historyItem, setHistoryItem] = useState<MoneyToReceive | null>(null);

  // Form states for Add / Edit
  const [formPersonName, setFormPersonName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formRemaining, setFormRemaining] = useState('');
  const [formDateGiven, setFormDateGiven] = useState(new Date().toISOString().split('T')[0]);
  const [formReminderDateTime, setFormReminderDateTime] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Partial payment form state
  const [partialAmount, setPartialAmount] = useState('');
  const [partialNote, setPartialNote] = useState('');

  // Total calculations
  const pendingRecords = moneyToReceive.filter(m => m.status !== 'received');
  const totalWaitingToReceive = pendingRecords.reduce((sum, m) => sum + m.remainingAmount, 0);
  const totalOriginalLent = moneyToReceive.reduce((sum, m) => sum + m.originalAmount, 0);
  const totalReturnedSoFar = moneyToReceive.reduce((sum, m) => sum + (m.originalAmount - m.remainingAmount), 0);

  const filteredList = moneyToReceive.filter(item => {
    if (activeFilter !== 'all' && item.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.personName.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormPersonName('');
    setFormAmount('');
    setFormRemaining('');
    setFormDateGiven(new Date().toISOString().split('T')[0]);
    setFormReminderDateTime('');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: MoneyToReceive) => {
    setEditingItem(item);
    setFormPersonName(item.personName);
    setFormAmount(item.originalAmount.toString());
    setFormRemaining(item.remainingAmount.toString());
    setFormDateGiven(item.dateGiven);
    setFormReminderDateTime(item.reminderDateTime || '');
    setFormNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);
    if (!formPersonName.trim() || isNaN(amountVal) || amountVal <= 0) return;

    if (editingItem) {
      const remainingVal = formRemaining !== '' ? parseFloat(formRemaining) : editingItem.remainingAmount;
      updateMoneyToReceive(editingItem.id, {
        personName: formPersonName.trim(),
        originalAmount: amountVal,
        remainingAmount: isNaN(remainingVal) ? amountVal : remainingVal,
        dateGiven: formDateGiven,
        reminderDateTime: formReminderDateTime || undefined,
        notes: formNotes.trim() || undefined
      });
    } else {
      addMoneyToReceive({
        personName: formPersonName.trim(),
        originalAmount: amountVal,
        dateGiven: formDateGiven,
        reminderDateTime: formReminderDateTime || undefined,
        notes: formNotes.trim() || undefined
      });
    }

    setIsAddModalOpen(false);
  };

  const handleRecordPartialPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partialPaymentItem) return;
    const amountVal = parseFloat(partialAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    recordPartialReceipt(partialPaymentItem.id, amountVal, partialNote.trim() || undefined);
    setPartialPaymentItem(null);
    setPartialAmount('');
    setPartialNote('');
  };

  // Helper for quick reminder datetime presets
  const applyReminderPreset = (daysFromNow: number, hour: number = 10) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, 0, 0, 0);
    // Format YYYY-MM-DDTHH:mm
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    setFormReminderDateTime(localISOTime);
  };

  const handleTestNotification = () => {
    sendSystemNotification(
      'Payment Reminder Test',
      `Reminder: Ask Rahul to return ${user.currencySymbol}1,000. (Scheduled reminders will trigger like this)`,
      'test-notification'
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Handshake className="w-5 h-5 text-blue-600" />
              <span>Money to Receive (Lent Money)</span>
            </h2>
            {pendingRecords.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                {pendingRecords.length} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Record money you lent to people, track partial repayments, and receive reminders when it's time to collect.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Money Given</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total to Receive (Primary KPI) */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-blue-200/90 dark:border-blue-900/60 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Total Money to Receive</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono tabular-nums">
            {user.currencySymbol}{totalWaitingToReceive.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Across {pendingRecords.length} pending borrower{pendingRecords.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Total Returned */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">Repaid to Date</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600 font-mono tabular-nums">
            +{user.currencySymbol}{totalReturnedSoFar.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Collected back into your account
          </p>
        </div>

        {/* Total Original Lent */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">Total Amount Lent</span>
            <Handshake className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-gray-200 font-mono tabular-nums">
            {user.currencySymbol}{totalOriginalLent.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Cumulative across all {moneyToReceive.length} record{moneyToReceive.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* 3. System Notification Permission & Test Banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-gray-800 dark:text-gray-200">
              Desktop & System Reminder Notifications
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              {hasNotificationPermission
                ? 'Active: Reminders will trigger a system banner and audible chime at your scheduled time.'
                : 'Enable system notifications so you receive reminder alerts even when you are working in other tabs.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!hasNotificationPermission ? (
            <button
              onClick={() => requestNotificationPermission()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Desktop Reminders</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Notifications Permitted</span>
            </span>
          )}

          <button
            onClick={handleTestNotification}
            className="px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Send a sample reminder to verify system notification and sound"
          >
            <Volume2 className="w-3.5 h-3.5 text-gray-400" />
            <span>Test Alert</span>
          </button>
        </div>
      </div>

      {/* 4. Filter Strip & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {(['all', 'pending', 'partially_received', 'received'] as const).map(f => {
            const count =
              f === 'all'
                ? moneyToReceive.length
                : moneyToReceive.filter(m => m.status === f).length;
            const labels = {
              all: 'All Records',
              pending: 'Pending',
              partially_received: 'Partially Received',
              received: 'Settled / Received'
            };
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === f
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {labels[f]} ({count})
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by person or note..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* 5. Records List or Empty State */}
      {moneyToReceive.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <Handshake className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            No money to receive recorded yet.
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            When you lend money to friends, family, or colleagues, record it here with a reminder to get paid back on time.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Money Given</span>
          </button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs text-gray-400">
          No records matching the filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map(item => {
            const isSettled = item.status === 'received';
            const isPartial = item.status === 'partially_received';
            const returnPct = Math.round(
              ((item.originalAmount - item.remainingAmount) / Math.max(item.originalAmount, 1)) * 100
            );

            // Format reminder label
            let reminderLabel: React.ReactNode = null;
            if (item.reminderDateTime) {
              const remDate = new Date(item.reminderDateTime);
              const isPast = remDate.getTime() <= Date.now();
              const dateText = remDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              if (item.reminderFired || (isPast && !isSettled)) {
                reminderLabel = (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    <Bell className="w-3 h-3 text-amber-500" />
                    <span>Reminder Sent · {dateText}</span>
                  </span>
                );
              } else {
                reminderLabel = (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span>Remind: {dateText}</span>
                  </span>
                );
              }
            } else {
              reminderLabel = (
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 opacity-60" />
                  <span>No reminder set</span>
                </span>
              );
            }

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl bg-white dark:bg-gray-900 border transition-all ${
                  isSettled
                    ? 'border-gray-200/60 dark:border-gray-800/60 opacity-80'
                    : 'border-gray-200 dark:border-gray-800 shadow-2xs hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Person details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs">
                      {item.personName.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                          {item.personName}
                        </h4>

                        {/* Status Badge */}
                        {isSettled ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Received
                          </span>
                        ) : isPartial ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            Pending ({user.currencySymbol}{item.remainingAmount.toLocaleString()} left)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            Pending
                          </span>
                        )}
                      </div>

                      {/* Notes if any */}
                      {item.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          "{item.notes}"
                        </p>
                      )}

                      {/* Meta: Date Given & Reminder */}
                      <div className="flex items-center gap-3 pt-1 text-xs text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Given on {item.dateGiven}</span>
                        </span>
                        <span>·</span>
                        {reminderLabel}
                      </div>

                      {/* Partial progress bar if applicable */}
                      {isPartial && (
                        <div className="pt-2 max-w-sm">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-gray-500">
                              {user.currencySymbol}
                              {(item.originalAmount - item.remainingAmount).toLocaleString()} repaid
                            </span>
                            <span className="font-mono text-teal-600 font-semibold">{returnPct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500 rounded-full transition-all duration-300"
                              style={{ width: `${returnPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amounts & Action Buttons */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-gray-500">
                        {isSettled ? 'Received' : 'Money to Collect'}
                      </div>
                      <div
                        className={`text-xl font-bold font-mono tabular-nums ${
                          isSettled ? 'line-through text-gray-400 dark:text-gray-500' : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {user.currencySymbol}
                        {item.remainingAmount.toLocaleString()}
                      </div>
                      {isPartial && (
                        <div className="text-[10px] text-gray-400 font-mono">
                          Original: {user.currencySymbol}
                          {item.originalAmount.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {/* Add to Home Page / Pin to Home button */}
                      <button
                        onClick={() =>
                          isItemPinnedToHome(item.id)
                            ? unpinItemFromHome(item.id)
                            : pinItemToHome(
                                item.id,
                                'money',
                                `${item.personName} owes ${user.currencySymbol}${item.remainingAmount.toLocaleString()} — Collect payment`
                              )
                        }
                        className={`px-2 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                          isItemPinnedToHome(item.id)
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                        }`}
                        title={isItemPinnedToHome(item.id) ? 'Remove from Home Page' : 'Add to Home Page'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${isItemPinnedToHome(item.id) ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`} />
                        <span className="hidden sm:inline">
                          {isItemPinnedToHome(item.id) ? 'Remove from Home' : 'Add to Home'}
                        </span>
                      </button>

                      {!isSettled && (
                        <>
                          <button
                            onClick={() => markAsFullyReceived(item.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Click when you have received the money"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Mark as Received</span>
                          </button>

                          <button
                            onClick={() => {
                              setPartialPaymentItem(item);
                              setPartialAmount('');
                              setPartialNote('');
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                            title="Record partial repayment"
                          >
                            Partial
                          </button>
                        </>
                      )}

                      {item.payments && item.payments.length > 0 && (
                        <button
                          onClick={() => setHistoryItem(item)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          title="View Repayment History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        title="Edit Record"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete record for ${item.personName}?`)) {
                            deleteMoneyToReceive(item.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Add / Edit Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Handshake className="w-4 h-4 text-blue-600" />
                <span>{editingItem ? 'Edit Money to Receive Record' : 'Record Money Given'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="p-5 space-y-4 text-xs">
              {/* Person Name & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Person's Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rahul Sharma"
                    value={formPersonName}
                    onChange={e => setFormPersonName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Original Amount ({user.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    placeholder="e.g., 1000"
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono tabular-nums focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* If editing, allow directly adjusting remaining amount */}
              {editingItem && (
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Remaining Amount to Collect ({user.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formRemaining}
                    onChange={e => setFormRemaining(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono tabular-nums focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Update directly if partially returned outside of the partial receipt tracker.
                  </span>
                </div>
              )}

              {/* Date Given */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Date Money Was Given *
                </label>
                <input
                  type="date"
                  required
                  value={formDateGiven}
                  onChange={e => setFormDateGiven(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Custom Reminder Date and Time */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-blue-600" />
                    <span>Reminder Date & Time (When to ask for money)</span>
                  </label>
                  {formReminderDateTime && (
                    <button
                      type="button"
                      onClick={() => setFormReminderDateTime('')}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <input
                  type="datetime-local"
                  value={formReminderDateTime}
                  onChange={e => setFormReminderDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-medium">Quick presets:</span>
                  <button
                    type="button"
                    onClick={() => applyReminderPreset(1, 10)}
                    className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    Tomorrow 10 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => applyReminderPreset(3, 10)}
                    className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    In 3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => applyReminderPreset(7, 10)}
                    className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    In 1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => applyReminderPreset(30, 10)}
                    className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    In 1 Month
                  </button>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Optional Note / Reason
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Lent for concert ticket, promises to repay on salary day"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Record Money Given'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Partial Payment Modal */}
      {partialPaymentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-600" />
                <span>Record Partial Repayment</span>
              </h3>
              <button
                onClick={() => setPartialPaymentItem(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPartialPayment} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <div className="text-gray-600 dark:text-gray-300">
                  Borrower: <span className="font-bold text-gray-900 dark:text-white">{partialPaymentItem.personName}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 mt-0.5">
                  Remaining Owed:{' '}
                  <span className="font-bold text-teal-700 dark:text-teal-300 font-mono">
                    {user.currencySymbol}{partialPaymentItem.remainingAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Amount Received Now ({user.currencySymbol}) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={partialPaymentItem.remainingAmount}
                  step="any"
                  autoFocus
                  placeholder={`Max: ${partialPaymentItem.remainingAmount}`}
                  value={partialAmount}
                  onChange={e => setPartialAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono tabular-nums focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Payment Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Repaid via UPI, Cash in hand"
                  value={partialNote}
                  onChange={e => setPartialNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPartialPaymentItem(null)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-2xs cursor-pointer"
                >
                  Update Remaining Amount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Repayment History Modal */}
      {historyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Repayment History: {historyItem.personName}</span>
              </h3>
              <button
                onClick={() => setHistoryItem(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-3">
              <div className="flex justify-between items-center text-gray-500 border-b border-gray-100 dark:border-gray-800 pb-2">
                <span>Original Given:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {user.currencySymbol}{historyItem.originalAmount.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {historyItem.payments?.map((pay, i) => (
                  <div
                    key={pay.id || i}
                    className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-emerald-600 font-mono">
                        +{user.currencySymbol}{pay.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{pay.notes || 'Repayment'}</div>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400">{pay.date}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center font-bold">
                <span>Remaining:</span>
                <span className="font-mono text-blue-600">
                  {user.currencySymbol}{historyItem.remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
