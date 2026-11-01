import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';

// Modals
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { QuickAddModal } from './components/common/QuickAddModal';
import { OnboardingModal } from './components/common/OnboardingModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { TasksView } from './components/views/TasksView';
import { CalendarView } from './components/views/CalendarView';
import { NotesView } from './components/views/NotesView';
import { GoalsView } from './components/views/GoalsView';
import { HabitsView } from './components/views/HabitsView';
import { MoneyView } from './components/views/MoneyView';
import { SmartVaultView } from './components/views/SmartVaultView';
import { UniversalInboxView } from './components/views/UniversalInboxView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { FocusModeView } from './components/views/FocusModeView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { SettingsView } from './components/views/SettingsView';

const WorkspaceShell: React.FC = () => {
  const { currentUser, activeTab } = useApp();

  // 1. If not authenticated, always show clean AuthScreen first!
  if (!currentUser) {
    return <AuthScreen />;
  }

  // 2. Authenticated user personal workspace
  return (
    <div className="flex min-h-screen font-sans text-gray-900 dark:text-gray-100 bg-gray-50/40 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-colors">
        <TopBar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {activeTab === 'Dashboard' && <DashboardView />}
          {activeTab === 'My Tasks' && <TasksView />}
          {activeTab === 'Calendar' && <CalendarView />}
          {activeTab === 'Notes' && <NotesView />}
          {activeTab === 'Goals' && <GoalsView />}
          {activeTab === 'Habits' && <HabitsView />}
          {activeTab === 'My Money' && <MoneyView />}
          {activeTab === 'Smart Vault' && <SmartVaultView />}
          {activeTab === 'Universal Inbox' && <UniversalInboxView />}
          {activeTab === 'Analytics' && <AnalyticsView />}
          {activeTab === 'Focus Mode' && <FocusModeView />}
          {activeTab === 'AI Assistant' && <AiAssistantView />}
          {activeTab === 'Settings' && <SettingsView />}
        </main>

        <MobileNav />

        {/* Global Action Modals */}
        <GlobalSearchModal />
        <QuickAddModal />
        <OnboardingModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <WorkspaceShell />
    </AppProvider>
  );
}
