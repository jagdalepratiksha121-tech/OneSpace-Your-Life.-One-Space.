import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  Sparkles,
  Coffee,
  Flame
} from 'lucide-react';

export const FocusModeView: React.FC = () => {
  const { tasks, focusSessions, logFocusSession } = useApp();

  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<any>(null);

  // Web Audio synthetic chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio not allowed or supported', e);
    }
  };

  const setTimerMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    const mins = newMode === 'focus' ? 25 : newMode === 'shortBreak' ? 5 : 15;
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            playChime();

            if (mode === 'focus') {
              const task = tasks.find(t => t.id === selectedTaskId);
              logFocusSession(durationMinutes, task?.title);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, mode, durationMinutes, selectedTaskId]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeftSeconds(durationMinutes * 60);
  };

  // Circular calculations
  const totalSeconds = durationMinutes * 60;
  const progress = ((totalSeconds - timeLeftSeconds) / totalSeconds) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Focus & Pomodoro Workspace</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Eliminate cognitive clutter, enter deep flow state, and log deliberate practice hours.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
            soundEnabled
              ? 'border-blue-200 dark:border-blue-800 text-blue-600 bg-blue-50/50 dark:bg-blue-900/30'
              : 'border-slate-200 text-slate-400'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Chime On' : 'Muted'}</span>
        </button>
      </div>

      {/* Main Focus Clock Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col items-center justify-center text-center">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
          <button
            onClick={() => setTimerMode('focus')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'focus'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Pomodoro (25m)</span>
          </button>

          <button
            onClick={() => setTimerMode('shortBreak')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break (5m)</span>
          </button>

          <button
            onClick={() => setTimerMode('longBreak')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'longBreak'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Long Break (15m)</span>
          </button>
        </div>

        {/* Circular Animated Timer SVG */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth="10"
              fill="transparent"
              className="dark:stroke-slate-800"
            />
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke={mode === 'focus' ? '#3B82F6' : mode === 'shortBreak' ? '#10B981' : '#8B5CF6'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Time digits in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {formattedTime}
            </div>
            <span className="text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">
              {isActive ? 'In Deep Flow' : 'Ready to Focus'}
            </span>
          </div>
        </div>

        {/* Task association selector */}
        {mode === 'focus' && (
          <div className="w-full max-w-sm mb-6">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 text-left">
              Select task you are working on:
            </label>
            <select
              value={selectedTaskId}
              onChange={e => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="">General Deep Work (No specific task)</option>
              {pendingTasks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{isActive ? 'Pause Session' : 'Start Focus'}</span>
          </button>
        </div>
      </div>

      {/* Focus Session History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          Recent Focus Sessions Log
        </h3>

        <div className="space-y-3">
          {focusSessions.map(session => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {session.taskTitle || 'Autonomous Focus Sprint'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Completed at {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <span className="font-mono font-bold text-blue-600 bg-white dark:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-600 shadow-2xs">
                {session.durationMinutes} mins
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
