import React, { useState } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Plus,
  Calendar,
  Menu,
  X,
  FileText,
  Target,
  Flame,
  Wallet,
  FolderArchive,
  Inbox,
  BarChart3,
  Clock,
  Sparkles,
  Settings
} from 'lucide-react';

interface NavGroup {
  category: string;
  items: { id: NavTab; label: string; icon: React.ElementType }[];
}

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, openQuickAdd } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const groups: NavGroup[] = [
    {
      category: 'Plan',
      items: [
        { id: 'My Tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'Calendar', label: 'Calendar', icon: Calendar },
        { id: 'Goals', label: 'Goals', icon: Target },
        { id: 'Habits', label: 'Habits', icon: Flame }
      ]
    },
    {
      category: 'Organize',
      items: [
        { id: 'Notes', label: 'Notes', icon: FileText },
        { id: 'Smart Vault', label: 'Smart Vault', icon: FolderArchive },
        { id: 'Universal Inbox', label: 'Universal Inbox', icon: Inbox }
      ]
    },
    {
      category: 'Track',
      items: [
        { id: 'My Money', label: 'Money', icon: Wallet },
        { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'Focus Mode', label: 'Focus', icon: Clock }
      ]
    },
    {
      category: 'Tools',
      items: [
        { id: 'AI Assistant', label: 'AI Assistant', icon: Sparkles },
        { id: 'Settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Bottom Floating Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40 px-4 py-2 flex items-center justify-around shadow-lg">
        {/* Home */}
        <button
          onClick={() => setActiveTab('Dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'Dashboard' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Tasks */}
        <button
          onClick={() => setActiveTab('My Tasks')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'My Tasks' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span>Tasks</span>
        </button>

        {/* Center Quick Add FAB */}
        <div className="-mt-6">
          <button
            onClick={() => openQuickAdd('task')}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 active:scale-90 transition-transform cursor-pointer"
            title="Quick Add"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar */}
        <button
          onClick={() => setActiveTab('Calendar')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'Calendar' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>

        {/* More */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
            isMoreOpen ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>

      {/* More Drawer */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Workspace Navigation</span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pb-6">
              {groups.map(group => (
                <div key={group.category} className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    {group.category}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMoreOpen(false);
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
