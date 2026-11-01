import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Target,
  Flame,
  FileText,
  FolderArchive,
  Inbox,
  Wallet,
  Clock,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[];
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    tasks,
    universalInbox
  } = useApp();

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const unreadInboxCount = universalInbox.filter(u => !u.processed).length;

  const sections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Planning',
      items: [
        { id: 'My Tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
        { id: 'Calendar', label: 'Calendar', icon: Calendar },
        { id: 'Goals', label: 'Goals', icon: Target },
        { id: 'Habits', label: 'Habits', icon: Flame }
      ]
    },
    {
      title: 'Workspace',
      items: [
        { id: 'Notes', label: 'Notes', icon: FileText },
        { id: 'Smart Vault', label: 'Documents', icon: FolderArchive },
        { id: 'Universal Inbox', label: 'Inbox', icon: Inbox, badge: unreadInboxCount }
      ]
    },
    {
      title: 'Tracking',
      items: [
        { id: 'My Money', label: 'Finances', icon: Wallet },
        { id: 'Focus Mode', label: 'Focus Mode', icon: Clock },
        { id: 'Analytics', label: 'Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'AI Assistant', label: 'AI Assistant', icon: Sparkles },
        { id: 'Settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-150 z-30 select-none ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      } shrink-0 min-h-screen sticky top-0`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <div
          onClick={() => setActiveTab('Dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group overflow-hidden"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white truncate">
              OneSpace
            </span>
          )}
        </div>

        <button
          onClick={() => setSidebarCollapsed(prev => !prev)}
          className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3.5">
        {sections.map(section => (
          <div key={section.title} className="space-y-0.5">
            {!sidebarCollapsed && (
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {section.title}
              </div>
            )}
            {sidebarCollapsed && (
              <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
            )}

            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors group relative ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700'
                    }`}
                  />

                  {!sidebarCollapsed && (
                    <span className="truncate text-left flex-1">{item.label}</span>
                  )}

                  {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};
