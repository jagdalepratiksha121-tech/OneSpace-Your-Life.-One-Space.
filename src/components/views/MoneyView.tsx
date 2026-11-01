import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Handshake
} from 'lucide-react';
import { ExpenseDonutChart, CircularProgressRing } from '../common/Charts';
import { MoneyToReceiveSection } from './MoneyToReceiveSection';

export const MoneyView: React.FC = () => {
  const {
    transactions,
    deleteTransaction,
    savings,
    updateSavings,
    moneyToReceive,
    user,
    openQuickAdd
  } = useApp();

  const [sectionTab, setSectionTab] = useState<'expenses' | 'to_receive'>('expenses');
  const [activeTab, setActiveTab] = useState<'all' | 'expense' | 'income'>('all');
  const [savingsInput, setSavingsInput] = useState(savings.currentAmount.toString());

  // Calculations for transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Money to Receive calculations
  const pendingMoneyToReceive = moneyToReceive.filter(m => m.status !== 'received');
  const totalWaitingToReceive = pendingMoneyToReceive.reduce((sum, m) => sum + m.remainingAmount, 0);

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

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

  const donutCategories = Object.keys(categoriesMap).map(cat => {
    const amount = categoriesMap[cat];
    const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
    return {
      category: cat,
      amount,
      percent,
      color: categoryColors[cat] || '#F97316'
    };
  });

  const handleUpdateSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(savingsInput);
    if (!isNaN(val)) {
      updateSavings({ currentAmount: val });
    }
  };

  const savingsRate = savings.targetAmount > 0
    ? Math.min(100, Math.round((savings.currentAmount / savings.targetAmount) * 100))
    : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Personal Finances & Expenses
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Track daily hishob, categorize expenses, monitor money to receive, and grow savings.
          </p>
        </div>

        {sectionTab === 'expenses' ? (
          <button
            onClick={() => openQuickAdd('expense')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        ) : null}
      </div>

      {/* 4 Metric Cards: Balance, Income, Expense, Money to Receive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Net Balance */}
        <div
          onClick={() => setSectionTab('expenses')}
          className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">Net Balance</span>
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white font-mono tabular-nums">
            {user.currencySymbol}{netBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Cash in hand & accounts
          </p>
        </div>

        {/* Total Income (Green) */}
        <div
          onClick={() => setSectionTab('expenses')}
          className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">Total Income</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600 font-mono tabular-nums">
            +{user.currencySymbol}{totalIncome.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1">
            Recorded receipts
          </p>
        </div>

        {/* Total Expenses (Orange) */}
        <div
          onClick={() => setSectionTab('expenses')}
          className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">Total Expenses</span>
            <ArrowUpRight className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-xl font-bold text-orange-500 font-mono tabular-nums">
            -{user.currencySymbol}{totalExpense.toLocaleString()}
          </div>
          <p className="text-[11px] text-orange-500/80 mt-1">
            Across {donutCategories.length} categories
          </p>
        </div>

        {/* Money to Receive (Teal/Blue) */}
        <div
          onClick={() => setSectionTab('to_receive')}
          className={`p-4 rounded-xl bg-white dark:bg-gray-900 border transition-all cursor-pointer shadow-2xs ${
            sectionTab === 'to_receive'
              ? 'border-blue-500 ring-2 ring-blue-500/10'
              : 'border-gray-200 dark:border-gray-800 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Money to Receive</span>
            <Handshake className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
            {user.currencySymbol}{totalWaitingToReceive.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-between">
            <span>{pendingMoneyToReceive.length} pending borrower{pendingMoneyToReceive.length === 1 ? '' : 's'}</span>
            <span className="text-blue-600 font-semibold text-[10px]">View →</span>
          </p>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setSectionTab('expenses')}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            sectionTab === 'expenses'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Expenses & Savings</span>
        </button>

        <button
          onClick={() => setSectionTab('to_receive')}
          className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            sectionTab === 'to_receive'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Handshake className="w-3.5 h-3.5" />
          <span>Money to Receive</span>
          {pendingMoneyToReceive.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono font-bold">
              {pendingMoneyToReceive.length}
            </span>
          )}
        </button>
      </div>

      {/* Conditional Section Render */}
      {sectionTab === 'to_receive' ? (
        <MoneyToReceiveSection />
      ) : (
        <div className="space-y-6">
          {/* Analytics Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Expenses Donut */}
            <div className="lg:col-span-6 bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-2xs">
              <h2 className="font-semibold text-sm text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                Category-Wise Spending Breakdown
              </h2>
              <ExpenseDonutChart
                totalAmount={totalExpense}
                currencySymbol={user.currencySymbol}
                categories={donutCategories}
              />
            </div>

            {/* Savings Goal Card */}
            <div className="lg:col-span-6 bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                  <div className="flex items-center gap-1.5">
                    <PiggyBank className="w-4 h-4 text-emerald-600" />
                    <h2 className="font-semibold text-sm text-gray-900 dark:text-white">
                      Monthly Savings Goal
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    {savingsRate}%
                  </span>
                </div>

                <div className="flex items-center gap-5 my-3">
                  <CircularProgressRing
                    progress={savingsRate}
                    size={80}
                    strokeWidth={8}
                    color="#10B981"
                    showPercent={true}
                  />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                      {user.currencySymbol}{savings.currentAmount.toLocaleString()} Saved
                    </div>
                    <div className="text-xs text-gray-500">
                      Target: {user.currencySymbol}{savings.targetAmount.toLocaleString()}{savings.deadline ? ` by ${savings.deadline}` : ''}
                    </div>
                    {savings.targetAmount > 0 && (
                      <div className="text-[11px] text-emerald-600 font-medium">
                        {user.currencySymbol}{Math.max(0, savings.targetAmount - savings.currentAmount).toLocaleString()} to reach target
                      </div>
                    )}
                  </div>
                </div>

                {/* Simple balance update */}
                <form onSubmit={handleUpdateSavings} className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Update Balance:</span>
                  <input
                    type="number"
                    value={savingsInput}
                    onChange={e => setSavingsInput(e.target.value)}
                    className="w-32 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-mono tabular-nums focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md cursor-pointer"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Transaction History Table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 gap-2 mb-3">
              <h2 className="font-semibold text-sm text-gray-900 dark:text-white">
                Transaction History
              </h2>

              <div className="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
                {(['all', 'expense', 'income'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded font-medium capitalize transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab === 'expense' ? 'Expenses (Orange)' : 'Income (Green)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <th className="text-left font-medium pb-2">Description</th>
                    <th className="text-left font-medium pb-2">Category</th>
                    <th className="text-left font-medium pb-2">Date</th>
                    <th className="text-right font-medium pb-2">Amount</th>
                    <th className="text-right font-medium pb-2 pr-1">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <Wallet className="w-8 h-8 text-orange-400 mx-auto mb-2 opacity-80" />
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          No expenses recorded. Add your first transaction.
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 mb-3">
                          Record income, food, rent, or transport to track your spending.
                        </p>
                        <button
                          onClick={() => openQuickAdd('expense')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Transaction</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(tx => {
                      const isInc = tx.type === 'income';
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="py-2.5 font-medium text-gray-800 dark:text-gray-200">
                            {tx.title}
                          </td>
                          <td className="py-2.5 text-gray-500">
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px]">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-2.5 text-gray-400 font-mono">
                            {tx.date}
                          </td>
                          <td className={`py-2.5 text-right font-mono font-medium ${
                            isInc ? 'text-emerald-600' : 'text-orange-500'
                          }`}>
                            {isInc ? '+' : '-'}{user.currencySymbol}{tx.amount.toLocaleString()}
                          </td>
                          <td className="py-2.5 text-right pr-1">
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="p-1 text-gray-400 hover:text-rose-500 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
