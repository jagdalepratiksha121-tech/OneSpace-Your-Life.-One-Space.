import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { signUp, signIn, signInWithGoogle, resetPassword } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const success = await signUp(name.trim(), email.trim(), password);
        if (!success) {
          setError('An account with this email already exists.');
        }
      } else if (mode === 'login') {
        const success = await signIn(email.trim(), password);
        if (!success) {
          setError('Invalid email or password. Please try again.');
        }
      } else if (mode === 'forgot') {
        const success = await resetPassword(email.trim());
        if (success) {
          setSuccessMsg(`Password reset instructions have been sent to ${email}`);
        } else {
          setError('No account found with this email address.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError('Google Sign-In is unavailable or was interrupted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gray-50/60 dark:bg-gray-950 font-sans selection:bg-blue-500/15 selection:text-blue-700">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-sm mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          OneSpace
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Your Life. One Space.
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your OneSpace account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {mode === 'login' && 'Enter your credentials to access your personal dashboard.'}
            {mode === 'signup' && 'Get started with a clean, private workspace tailored to you.'}
            {mode === 'forgot' && 'Enter your email to receive password recovery instructions.'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In'
                : mode === 'signup'
                ? 'Create Account'
                : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        {mode !== 'forgot' && (
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold text-gray-400 bg-white dark:bg-gray-900 px-2">
              <span>Or</span>
            </div>
          </div>
        )}

        {/* Continue with Google */}
        {mode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {/* Mode Switch Footer */}
        <div className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
          {mode === 'login' && (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </span>
          )}

          {mode === 'signup' && (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </span>
          )}

          {mode === 'forgot' && (
            <span>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Back to Sign in
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Privacy note */}
      <p className="text-[11px] text-gray-400 mt-6 text-center max-w-xs">
        Secure client session. Your personal workspace data is isolated and stored privately to your account.
      </p>
    </div>
  );
};
