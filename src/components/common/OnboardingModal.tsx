import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPurpose } from '../../types';
import {
  GraduationCap,
  Briefcase,
  Laptop,
  Rocket,
  User,
  Check,
  Globe,
  Coins,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, user, updateUser, setUserPurpose } = useApp();

  const [selectedPurpose, setSelectedPurpose] = useState<UserPurpose>(user.purpose);
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>(user.currency);
  const [name, setName] = useState(user.name);

  if (!isOnboardingOpen) return null;

  const purposeOptions: {
    id: UserPurpose;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'Student',
      title: 'Student',
      description: 'Study schedules, exam notes, semester goals, and assignment deadlines.',
      icon: GraduationCap,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
    },
    {
      id: 'Working Professional',
      title: 'Working Professional',
      description: 'Project deliverables, deep work focus blocks, meetings, and career milestones.',
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
    },
    {
      id: 'Freelancer',
      title: 'Freelancer',
      description: 'Client tasks, project budgets, hishob billing, and portfolio storage.',
      icon: Laptop,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40'
    },
    {
      id: 'Entrepreneur',
      title: 'Entrepreneur',
      description: 'Product launches, revenue tracking, high-priority targets, and growth habits.',
      icon: Rocket,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
    },
    {
      id: 'Personal Use',
      title: 'Personal Use',
      description: 'Fitness habits, personal budget, family schedule, and document storage.',
      icon: User,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40'
    }
  ];

  const handleComplete = () => {
    const symbolMap = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };
    updateUser({
      name: name.trim() || user.name,
      currency: selectedCurrency,
      currencySymbol: symbolMap[selectedCurrency],
      onboardingCompleted: true
    });
    setUserPurpose(selectedPurpose);
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Banner */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Your OneSpace</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            How do you plan to use OneSpace?
          </h2>
          <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-md">
            We will tailor your workspace widgets and initial recommendations to your daily workflow.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* User Name input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Preferred Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:border-blue-500 font-medium"
              placeholder="e.g. Priya"
            />
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Primary Role / Focus
            </label>
            <div className="space-y-2">
              {purposeOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedPurpose === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedPurpose(opt.id)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${opt.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {opt.title}
                        </h4>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currency selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                <span>Primary Currency</span>
              </label>
              <select
                value={selectedCurrency}
                onChange={e => setSelectedCurrency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden font-medium"
              >
                <option value="INR">₹ INR (Indian Rupee - Default)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Timezone</span>
              </label>
              <input
                type="text"
                disabled
                value={user.timezone}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 md:px-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Skip for now
          </button>
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
          >
            <span>Enter My Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
