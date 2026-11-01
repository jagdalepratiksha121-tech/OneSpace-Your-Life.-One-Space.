import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Check,
  LogOut,
  User,
  Sliders,
  Layers,
  ChevronDown
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    user,
    updateUser,
    setIsSearchOpen,
    notifications,
    markNotificationsAsRead,
    dismissNotification,
    setIsOnboardingOpen,
    setIsAuthModalOpen,
    logout,
    setActiveTab,
    activeTab
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    updateUser({ theme: user.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <header className="h-14 px-4 sm:px-6 md:px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left: Mobile Brand or Current View Title */}
      <div className="flex items-center gap-3">
        <div className="flex md:hidden items-center gap-2">
          <div
            onClick={() => setActiveTab('Dashboard')}
            className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white cursor-pointer"
          >
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">OneSpace</span>
        </div>

        <div className="hidden md:flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200">
          {activeTab}
        </div>
      </div>

      {/* Center: Single Global Search */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-400 group transition-colors text-left"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors shrink-0" />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Search tasks, notes, goals...
            </span>
          </div>
          <kbd className="hidden sm:inline-block font-mono text-[10px] text-gray-400 bg-white dark:bg-gray-700 px-1 rounded border border-gray-200 dark:border-gray-600 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={`Switch to ${user.theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {user.theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotifOpen(prev => !prev);
              if (!isNotifOpen) markNotificationsAsRead();
            }}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-3 z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <span className="font-semibold text-xs text-gray-900 dark:text-white">Notifications</span>
                <button
                  onClick={markNotificationsAsRead}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 mt-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="py-2.5 flex items-start justify-between gap-2.5 group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.read ? 'bg-gray-300' : 'bg-blue-600'}`} />
                          <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{n.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block font-mono">{n.time}</span>
                      </div>
                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 p-1"
                        title="Dismiss"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              referrerPolicy="no-referrer"
            />
            <span className="hidden lg:inline text-xs font-medium text-gray-700 dark:text-gray-200">
              {user.name}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden lg:inline" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-2 z-50 animate-in fade-in duration-100">
              <div className="p-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <div className="font-semibold text-xs text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
              </div>

              <div className="space-y-0.5 text-xs">
                <button
                  onClick={() => {
                    setActiveTab('Settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Profile & Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsOnboardingOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-gray-400" />
                  <span>Switch Workspace Role</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
