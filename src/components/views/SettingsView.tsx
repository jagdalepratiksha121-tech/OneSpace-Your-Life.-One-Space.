import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  User,
  Sliders,
  Coins,
  Globe,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Shield,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { UserPurpose } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateUser,
    setUserPurpose,
    exportDataJson,
    importDataJson,
    clearUserData
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || user.name,
      email: email.trim() || user.email
    });
    setImportStatus('Profile changes saved successfully.');
    setTimeout(() => setImportStatus(''), 2500);
  };

  const handleCurrencyChange = (curr: 'INR' | 'USD' | 'EUR' | 'GBP') => {
    const symbolMap = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    updateUser({
      currency: curr,
      currencySymbol: symbolMap[curr]
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJson(content);
        if (ok) {
          setImportStatus('Backup JSON restored successfully!');
        } else {
          setImportStatus('Invalid JSON backup file.');
        }
        setTimeout(() => setImportStatus(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Settings & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your OneSpace identity, currency format, backup storage, and workspace focus.
        </p>
      </div>

      {importStatus && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Profile Details</span>
        </h2>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20"
            />
            <div className="space-y-1">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{user.name}</span>
              <div className="text-xs text-slate-400">{user.email}</div>
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Current Role: {user.purpose}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Primary Role & Workspace Configuration */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>Primary Workspace Purpose</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tailor default task recommendations, milestone models, and calendar routines.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {(['Student', 'Working Professional', 'Freelancer', 'Entrepreneur', 'Personal Use'] as UserPurpose[]).map(p => (
            <button
              key={p}
              onClick={() => setUserPurpose(p)}
              className={`p-3 rounded-2xl text-xs font-semibold text-center border transition-all ${
                user.purpose === p
                  ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Regional & Financial Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-600" />
          <span>Currency & Regional Format</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Active Currency
            </label>
            <select
              value={user.currency}
              onChange={e => handleCurrencyChange(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
            >
              <option value="INR">₹ INR (Indian Rupee - Default)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
              <option value="GBP">£ GBP (British Pound)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Timezone
            </label>
            <input
              type="text"
              disabled
              value={user.timezone}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 text-xs text-slate-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Data Management: Export & Backup */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Data Isolation & Offline Backup</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your information is stored in local browser persistence. You can download an encrypted full JSON export or restore at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportDataJson}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export Backup (.JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-teal-600" />
            <span>Restore Backup JSON</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear your personal workspace data? All items will be permanently erased.')) {
                clearUserData();
                setImportStatus('Workspace data cleared.');
                setTimeout(() => setImportStatus(''), 2500);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 text-xs font-semibold rounded-xl transition-colors ml-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
