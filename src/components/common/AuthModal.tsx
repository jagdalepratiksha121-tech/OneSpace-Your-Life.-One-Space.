import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, updateUser, user } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const demoAccounts: {
    name: string;
    email: string;
    purpose: UserProfile['purpose'];
    avatar: string;
  }[] = [
    {
      name: 'Priya',
      email: 'priya.sharma@example.com',
      purpose: 'Working Professional',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      purpose: 'Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Marcus Vance',
      email: 'marcus@hypergrowth.co',
      purpose: 'Entrepreneur',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const handleDemoSelect = (account: typeof demoAccounts[0]) => {
    updateUser({
      name: account.name,
      email: account.email,
      purpose: account.purpose,
      avatar: account.avatar
    });
    setSuccessMsg(`Switched profile to ${account.name} (${account.purpose})`);
    setTimeout(() => {
      setSuccessMsg('');
      setIsAuthModalOpen(false);
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setSuccessMsg('Password reset instructions sent to ' + email);
      setTimeout(() => {
        setSuccessMsg('');
        setMode('login');
      }, 1500);
      return;
    }

    if (mode === 'register') {
      updateUser({
        name: name.trim() || 'New Member',
        email: email.trim() || 'user@onespace.app'
      });
      setSuccessMsg('Account registered successfully! Welcome to OneSpace.');
    } else {
      updateUser({
        name: name.trim() || user.name || 'Priya',
        email: email.trim() || user.email
      });
      setSuccessMsg('Welcome back to your workspace!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      setIsAuthModalOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              1S
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              {mode === 'login' ? 'Welcome to OneSpace' : mode === 'register' ? 'Create Your Account' : 'Reset Password'}
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {successMsg ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Mode switch */}
          <div className="text-center text-xs text-slate-500 pt-1">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create one
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>One-Click Switch Demo Profiles:</span>
            </div>
            <div className="space-y-1.5">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleDemoSelect(acc)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-left transition-colors border border-slate-100 dark:border-slate-700/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                        {acc.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {acc.purpose}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                    Switch →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
